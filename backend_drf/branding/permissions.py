"""Object permissions for branding APIs."""

from __future__ import annotations

from rest_framework.permissions import SAFE_METHODS, BasePermission


class StaffWriteReadOnly(BasePermission):
    """Allow public reads but restrict writes to staff users."""

    def has_permission(self, request, view) -> bool:  # type: ignore[override]
        if request.method in SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


class BrandingInquiryPermission(BasePermission):
    """Allow public create/tracking, but restrict listing and transitions."""

    def has_permission(self, request, view) -> bool:  # type: ignore[override]
        action = getattr(view, "action", None)
        if action == "create":
            return True
        if action == "retrieve":
            return True
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)

    def has_object_permission(self, request, view, obj) -> bool:  # type: ignore[override]
        action = getattr(view, "action", None)
        if action == "retrieve":
            if request.user and request.user.is_authenticated and request.user.is_staff:
                return True
            if request.user and request.user.is_authenticated and obj.owner_id == request.user.id:
                return True
            return True
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)
