"""Unified JSON envelope renderer."""

from __future__ import annotations

from typing import Any

from rest_framework.renderers import JSONRenderer


class EnvelopeJSONRenderer(JSONRenderer):
    """Render every API response as status/data/meta/errors."""

    def render(self, data: Any, accepted_media_type: str | None = None, renderer_context: dict[str, Any] | None = None) -> bytes:
        renderer_context = renderer_context or {}
        response = renderer_context.get("response")

        if isinstance(data, dict) and {"status", "data", "meta", "errors"}.issubset(data.keys()):
            return super().render(data, accepted_media_type, renderer_context)

        is_error = bool(getattr(response, "exception", False)) or bool(response and response.status_code >= 400)
        if is_error:
            envelope = {
                "status": "error",
                "data": None,
                "meta": {},
                "errors": data if isinstance(data, list) else [{"detail": data}],
            }
            return super().render(envelope, accepted_media_type, renderer_context)

        meta: dict[str, Any] = {}
        payload = data
        if isinstance(data, dict) and {"count", "next", "previous", "results"}.issubset(data.keys()):
            payload = data.get("results", [])
            meta = {
                "pagination": {
                    "count": data.get("count"),
                    "next": data.get("next"),
                    "previous": data.get("previous"),
                    "page": data.get("page"),
                    "page_size": data.get("page_size"),
                    "total_pages": data.get("total_pages"),
                }
            }
        elif isinstance(data, dict) and ("data" in data or "meta" in data):
            payload = data.get("data")
            meta = data.get("meta", {})

        envelope = {"status": "success", "data": payload, "meta": meta, "errors": []}
        return super().render(envelope, accepted_media_type, renderer_context)
