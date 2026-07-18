"""Exception normalization for the response envelope."""

from __future__ import annotations

from typing import Any

from rest_framework.views import exception_handler


def _flatten_errors(payload: Any, *, field: str | None = None) -> list[dict[str, str | None]]:
    if isinstance(payload, dict):
        errors: list[dict[str, str | None]] = []
        for key, value in payload.items():
            errors.extend(_flatten_errors(value, field=key))
        return errors
    if isinstance(payload, list):
        errors = []
        for value in payload:
            errors.extend(_flatten_errors(value, field=field))
        return errors
    return [{"field": field, "detail": str(payload)}]


def envelope_exception_handler(exc: Exception, context: dict[str, Any]) -> Any:
    """Return DRF exceptions in the shared JSON envelope."""

    response = exception_handler(exc, context)
    if response is None:
        return response
    response.data = {
        "status": "error",
        "data": None,
        "meta": {},
        "errors": _flatten_errors(response.data),
    }
    return response
