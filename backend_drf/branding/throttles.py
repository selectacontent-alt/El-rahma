"""Custom scoped throttles for critical branding entry points."""

from __future__ import annotations

from rest_framework.throttling import ScopedRateThrottle


class BrandingInquiryThrottle(ScopedRateThrottle):
    """Rate-limit public inquiry submissions to prevent funnel spam."""

    scope = "branding_inquiry"

    def allow_request(self, request, view) -> bool:  # type: ignore[override]
        original_scope = getattr(view, self.scope_attr, None)
        setattr(view, self.scope_attr, self.scope)
        try:
            return super().allow_request(request, view)
        finally:
            if original_scope is None:
                delattr(view, self.scope_attr)
            else:
                setattr(view, self.scope_attr, original_scope)
