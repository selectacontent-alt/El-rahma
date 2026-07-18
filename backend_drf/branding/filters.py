"""Whitelisted query filters for branding endpoints."""

from __future__ import annotations

from django.db.models import Q, QuerySet
from rest_framework.filters import BaseFilterBackend
from rest_framework.request import Request
from rest_framework.views import APIView


class BrandingFilterBackend(BaseFilterBackend):
    """Apply strict query-parameter filters without dynamic ORM field access."""

    allowed_filters: dict[str, tuple[str, ...]] = {
        "BrandingBlueprintViewSet": ("category", "status"),
        "BrandingPaletteViewSet": ("category", "status", "is_featured"),
        "PortfolioShowcaseViewSet": ("industry", "status", "is_featured", "palette__slug"),
        "BrandingPackageViewSet": ("tier", "status", "is_priority"),
        "BrandingInquiryViewSet": ("status", "budget_tier", "email"),
    }

    def filter_queryset(self, request: Request, queryset: QuerySet, view: APIView) -> QuerySet:
        view_name = view.__class__.__name__
        for field in self.allowed_filters.get(view_name, ()):
            query_name = field.replace("__slug", "")
            value = request.query_params.get(query_name)
            if value in (None, ""):
                continue
            if field.startswith("is_"):
                queryset = queryset.filter(**{field: value.lower() in {"1", "true", "yes"}})
            else:
                queryset = queryset.filter(**{field: value})

        search = request.query_params.get("q")
        if search:
            search = search[:80]
            queryset = self._apply_search(queryset, view_name, search)
        return queryset

    def _apply_search(self, queryset: QuerySet, view_name: str, search: str) -> QuerySet:
        if view_name == "BrandingBlueprintViewSet":
            return queryset.filter(Q(title__icontains=search) | Q(summary__icontains=search))
        if view_name == "BrandingPaletteViewSet":
            return queryset.filter(Q(name__icontains=search) | Q(category__icontains=search))
        if view_name == "PortfolioShowcaseViewSet":
            return queryset.filter(Q(client_name__icontains=search) | Q(headline__icontains=search))
        if view_name == "BrandingPackageViewSet":
            return queryset.filter(Q(title__icontains=search) | Q(tier__icontains=search))
        if view_name == "BrandingInquiryViewSet":
            return queryset.filter(Q(full_name__icontains=search) | Q(email__icontains=search))
        return queryset
