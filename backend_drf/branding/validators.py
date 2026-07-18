"""Validation helpers for the branding domain.

The frontend renders SVG paths, Lottie JSON, and uploaded brand assets directly
inside rich interactive surfaces, so this module errs on the side of rejecting
ambiguous or executable payloads.
"""

from __future__ import annotations

import html
import re
from collections.abc import Mapping, Sequence
from typing import Any

import bleach
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import UploadedFile
from jsonschema import Draft202012Validator, ValidationError as JSONSchemaError

HEX_COLOR_RE = re.compile(r"^#[0-9A-Fa-f]{6}$")
SVG_PATH_RE = re.compile(r"^[MmZzLlHhVvCcSsQqTtAaEe0-9,.\-\s]+$")
SCRIPTISH_RE = re.compile(
    r"(<\s*script|javascript:|data:text/html|on[a-z]+\s*=|<\s*foreignObject|<\s*iframe|<\s*object)",
    re.IGNORECASE,
)
SAFE_ASSET_EXTENSIONS = {".webp", ".png", ".jpg", ".jpeg", ".svg"}
MAX_ASSET_SIZE_BYTES = 5 * 1024 * 1024
MAX_SVG_PAYLOAD_BYTES = 512 * 1024

LOTTIE_SCHEMA: dict[str, Any] = {
    "type": "object",
    "required": ["v", "fr", "ip", "op", "w", "h", "layers"],
    "properties": {
        "v": {"type": "string", "maxLength": 20},
        "fr": {"type": "number", "minimum": 1, "maximum": 240},
        "ip": {"type": "number", "minimum": 0},
        "op": {"type": "number", "minimum": 1},
        "w": {"type": "integer", "minimum": 1, "maximum": 8192},
        "h": {"type": "integer", "minimum": 1, "maximum": 8192},
        "layers": {"type": "array", "maxItems": 300},
        "assets": {"type": "array", "maxItems": 300},
        "markers": {"type": "array", "maxItems": 100},
    },
    "additionalProperties": True,
}

MOCKUP_MAPPING_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "logo": {"type": "object"},
        "backgrounds": {"type": "array", "maxItems": 24},
        "surfaces": {"type": "array", "maxItems": 24},
        "cssVariables": {"type": "object"},
    },
    "additionalProperties": True,
}

BRIEF_GOALS_SCHEMA: dict[str, Any] = {
    "type": "array",
    "items": {"type": "string", "minLength": 2, "maxLength": 120},
    "maxItems": 12,
}


def validate_hex_color(value: str) -> None:
    """Validate strict six-digit HEX color values."""

    if not HEX_COLOR_RE.fullmatch(value or ""):
        raise ValidationError("Color must be a strict 6-digit HEX value, for example #9d027c.")


def sanitize_plain_text(value: str, *, max_length: int | None = None) -> str:
    """Strip HTML from user-entered text while preserving readable content."""

    cleaned = bleach.clean(value or "", tags=[], attributes={}, strip=True)
    cleaned = html.unescape(cleaned).strip()
    if max_length is not None and len(cleaned) > max_length:
        raise ValidationError(f"Text exceeds the maximum length of {max_length} characters.")
    return cleaned


def _contains_scriptish_value(value: Any) -> bool:
    if isinstance(value, str):
        return bool(SCRIPTISH_RE.search(value))
    if isinstance(value, Mapping):
        return any(
            str(key).startswith("__") or _contains_scriptish_value(child)
            for key, child in value.items()
        )
    if isinstance(value, Sequence) and not isinstance(value, bytes | bytearray):
        return any(_contains_scriptish_value(child) for child in value)
    return False


def validate_safe_json_payload(value: Any, *, schema: dict[str, Any] | None = None) -> None:
    """Validate JSON payload shape and reject executable-looking strings."""

    if value in (None, ""):
        return
    if _contains_scriptish_value(value):
        raise ValidationError("JSON payload contains executable or unsafe markup.")
    if schema is not None:
        try:
            Draft202012Validator(schema).validate(value)
        except JSONSchemaError as exc:
            raise ValidationError(f"Invalid JSON schema: {exc.message}") from exc


def validate_lottie_config(value: Any) -> None:
    """Validate a bounded Lottie configuration for frontend playback."""

    if value in (None, "", {}):
        return
    validate_safe_json_payload(value, schema=LOTTIE_SCHEMA)
    if isinstance(value, Mapping) and float(value.get("op", 0)) <= float(value.get("ip", -1)):
        raise ValidationError("Lottie out-point must be greater than the in-point.")


def validate_mockup_mapping(value: Any) -> None:
    """Validate palette-to-mockup mapping metadata."""

    validate_safe_json_payload(value, schema=MOCKUP_MAPPING_SCHEMA)


def validate_brief_goals(value: Any) -> None:
    """Validate structured inquiry goals."""

    validate_safe_json_payload(value, schema=BRIEF_GOALS_SCHEMA)


def validate_svg_path_data(value: str) -> None:
    """Validate SVG path data without allowing arbitrary SVG/XML documents."""

    if not value:
        return
    if len(value.encode("utf-8")) > MAX_SVG_PAYLOAD_BYTES:
        raise ValidationError("SVG path data is too large.")
    if SCRIPTISH_RE.search(value) or "<" in value or ">" in value:
        raise ValidationError("SVG path data cannot contain markup or executable attributes.")
    if not SVG_PATH_RE.fullmatch(value):
        raise ValidationError("SVG path data contains unsupported commands or characters.")


def validate_svg_document(svg: str) -> None:
    """Reject executable SVG documents before they are stored."""

    if len(svg.encode("utf-8")) > MAX_SVG_PAYLOAD_BYTES:
        raise ValidationError("SVG file exceeds the allowed size.")
    if SCRIPTISH_RE.search(svg):
        raise ValidationError("SVG file contains unsafe executable markup.")
    if "<svg" not in svg.lower():
        raise ValidationError("SVG file must contain a valid <svg> root element.")


def validate_uploaded_brand_asset(file_obj: UploadedFile) -> None:
    """Validate uploaded brand assets for size, extension, and SVG safety."""

    name = getattr(file_obj, "name", "") or ""
    suffix = "." + name.rsplit(".", 1)[-1].lower() if "." in name else ""
    if suffix not in SAFE_ASSET_EXTENSIONS:
        raise ValidationError("Only WebP, PNG, JPG, JPEG, and SVG brand assets are allowed.")
    if getattr(file_obj, "size", 0) and file_obj.size > MAX_ASSET_SIZE_BYTES:
        raise ValidationError("Brand assets must be 5MB or smaller.")
    if suffix == ".svg":
        position = file_obj.tell() if hasattr(file_obj, "tell") else None
        payload = file_obj.read(MAX_SVG_PAYLOAD_BYTES + 1)
        if position is not None:
            file_obj.seek(position)
        text = payload.decode("utf-8", errors="ignore")
        validate_svg_document(text)
