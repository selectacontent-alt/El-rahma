"""Cache helpers for sub-50ms branding read endpoints."""

from __future__ import annotations

import hashlib
from collections.abc import Callable
from typing import Any

from django.core.cache import cache
from rest_framework.request import Request
from rest_framework.response import Response

BRANDING_CACHE_VERSION_KEY = "branding:version"
BRANDING_CACHE_PREFIX = "branding"
DEFAULT_STATIC_TIMEOUT_SECONDS = 60 * 15
DEFAULT_PORTFOLIO_TIMEOUT_SECONDS = 60 * 10


def get_branding_cache_version() -> int:
    """Return the active branding cache version, creating it if missing."""

    version = cache.get(BRANDING_CACHE_VERSION_KEY)
    if version is None:
        cache.set(BRANDING_CACHE_VERSION_KEY, 1, timeout=None)
        return 1
    return int(version)


def bump_branding_cache_version() -> None:
    """Invalidate all branding cache keys by bumping a version namespace."""

    try:
        cache.incr(BRANDING_CACHE_VERSION_KEY)
    except ValueError:
        cache.set(BRANDING_CACHE_VERSION_KEY, 2, timeout=None)
    delete_pattern = getattr(cache, "delete_pattern", None)
    if callable(delete_pattern):
        delete_pattern(f"*{BRANDING_CACHE_PREFIX}:v*")


def make_request_cache_key(request: Request, *, namespace: str) -> str:
    """Build a stable, scope-aware cache key from request path and query string."""

    version = get_branding_cache_version()
    user_scope = "staff" if request.user.is_authenticated and request.user.is_staff else "public"
    path_hash = hashlib.sha256(request.get_full_path().encode("utf-8")).hexdigest()
    return f"{BRANDING_CACHE_PREFIX}:v{version}:{namespace}:{user_scope}:{path_hash}"


def cached_response(
    request: Request,
    *,
    namespace: str,
    timeout: int,
    producer: Callable[[], Response],
) -> Response:
    """Cache successful DRF responses as primitive response data."""

    key = make_request_cache_key(request, namespace=namespace)
    cached = cache.get(key)
    if cached is not None:
        return Response(cached["data"], status=cached["status"], headers={"X-Cache": "HIT"})

    response = producer()
    if 200 <= response.status_code < 300:
        cache.set(key, {"data": response.data, "status": response.status_code}, timeout=timeout)
        response.headers["X-Cache"] = "MISS"
    return response
