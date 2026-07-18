"""REST API views for the Visual Branding & Identity module."""

from __future__ import annotations

from typing import Any

from django.db.models import Prefetch, QuerySet
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response

from .cache import DEFAULT_PORTFOLIO_TIMEOUT_SECONDS, DEFAULT_STATIC_TIMEOUT_SECONDS, cached_response
from .filters import BrandingFilterBackend
from .models import (
    BrandingBlueprint,
    BrandingBlueprintStep,
    BrandingInquiry,
    BrandingPackage,
    BrandingPalette,
    PortfolioShowcase,
    PublicationStatus,
)
from .permissions import BrandingInquiryPermission, StaffWriteReadOnly
from .serializers import (
    BlueprintStepSerializer,
    BrandingBlueprintSerializer,
    BrandingInquiryReadSerializer,
    BrandingInquiryStatusUpdateSerializer,
    BrandingInquiryWriteSerializer,
    BrandingPackageSerializer,
    BrandingPaletteSerializer,
    PortfolioShowcaseSerializer,
)
from .throttles import BrandingInquiryThrottle


def get_client_ip(request: Request) -> str | None:
    """Resolve the best available client IP while respecting reverse proxies."""

    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


class CachedReadModelViewSet(viewsets.ModelViewSet):
    """ViewSet base that caches successful GET list/retrieve responses."""

    filter_backends = (BrandingFilterBackend,)
    permission_classes = (StaffWriteReadOnly,)
    lookup_field = "slug"
    cache_namespace = "branding"
    cache_timeout = DEFAULT_STATIC_TIMEOUT_SECONDS

    def _public_status_queryset(self, queryset: QuerySet) -> QuerySet:
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return queryset
        return queryset.filter(status=PublicationStatus.ACTIVE)

    def list(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        return cached_response(
            request,
            namespace=f"{self.cache_namespace}:list",
            timeout=self.cache_timeout,
            producer=lambda: super(CachedReadModelViewSet, self).list(request, *args, **kwargs),
        )

    def retrieve(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        return cached_response(
            request,
            namespace=f"{self.cache_namespace}:detail",
            timeout=self.cache_timeout,
            producer=lambda: super(CachedReadModelViewSet, self).retrieve(request, *args, **kwargs),
        )


class BrandingBlueprintViewSet(CachedReadModelViewSet):
    """Service Blueprint Engine endpoints for identity creation steps."""

    serializer_class = BrandingBlueprintSerializer
    cache_namespace = "blueprints"

    def get_queryset(self) -> QuerySet[BrandingBlueprint]:
        steps = BrandingBlueprintStep.objects.order_by("sort_order", "id")
        queryset = BrandingBlueprint.objects.prefetch_related(Prefetch("steps", queryset=steps))
        return self._public_status_queryset(queryset)


class BlueprintStepViewSet(CachedReadModelViewSet):
    """Direct step endpoint for clients that stream a single animation step."""

    serializer_class = BlueprintStepSerializer
    cache_namespace = "blueprint_steps"
    lookup_field = "pk"

    def get_queryset(self) -> QuerySet[BrandingBlueprintStep]:
        queryset = BrandingBlueprintStep.objects.select_related("blueprint")
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return queryset
        return queryset.filter(blueprint__status=PublicationStatus.ACTIVE)


class BrandingPaletteViewSet(CachedReadModelViewSet):
    """Dynamic Palette Selector endpoints."""

    serializer_class = BrandingPaletteSerializer
    cache_namespace = "palettes"

    def get_queryset(self) -> QuerySet[BrandingPalette]:
        queryset = BrandingPalette.objects.all()
        return self._public_status_queryset(queryset)

    @action(detail=True, methods=["get"], url_path="mockup-map")
    def mockup_map(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        def producer() -> Response:
            palette = self.get_object()
            payload = {
                "slug": palette.slug,
                "colors": {
                    "primary": palette.primary_hex,
                    "secondary": palette.secondary_hex,
                    "accent": palette.accent_hex,
                    "neutral": palette.neutral_hex,
                },
                "mockup_mapping": palette.mockup_mapping,
            }
            return Response(payload)

        return cached_response(
            request,
            namespace=f"{self.cache_namespace}:mockup_map",
            timeout=self.cache_timeout,
            producer=producer,
        )


class PortfolioShowcaseViewSet(CachedReadModelViewSet):
    """Interactive before/after portfolio slider endpoints."""

    serializer_class = PortfolioShowcaseSerializer
    cache_namespace = "portfolio"
    cache_timeout = DEFAULT_PORTFOLIO_TIMEOUT_SECONDS

    def get_queryset(self) -> QuerySet[PortfolioShowcase]:
        queryset = PortfolioShowcase.objects.select_related("palette")
        return self._public_status_queryset(queryset)


class BrandingPackageViewSet(CachedReadModelViewSet):
    """Bookable package endpoints for checkout-style inquiry starts."""

    serializer_class = BrandingPackageSerializer
    cache_namespace = "packages"

    def get_queryset(self) -> QuerySet[BrandingPackage]:
        queryset = BrandingPackage.objects.all()
        return self._public_status_queryset(queryset)

    def get_permissions(self):
        if self.action == "inquire":
            return [AllowAny()]
        return super().get_permissions()

    @action(detail=True, methods=["post"], url_path="inquire", throttle_classes=[BrandingInquiryThrottle])
    def inquire(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        package = self.get_object()
        payload = request.data.copy()
        payload["package_slug"] = package.slug
        payload.setdefault("budget_tier", package.tier)
        serializer = BrandingInquiryWriteSerializer(data=payload, context=self.get_serializer_context())
        serializer.context["client_ip"] = get_client_ip(request)
        serializer.context["user_agent"] = request.META.get("HTTP_USER_AGENT", "")
        serializer.is_valid(raise_exception=True)
        inquiry = serializer.save()
        read_serializer = BrandingInquiryReadSerializer(inquiry, context=self.get_serializer_context())
        return Response(read_serializer.data, status=status.HTTP_201_CREATED)


class BrandingInquiryViewSet(viewsets.ModelViewSet):
    """Instant Booking/Inquiry Funnel with auditable status tracking."""

    lookup_field = "public_id"
    http_method_names = ["get", "post", "patch", "head", "options"]
    filter_backends = (BrandingFilterBackend,)
    permission_classes = (BrandingInquiryPermission,)

    def get_queryset(self) -> QuerySet[BrandingInquiry]:
        queryset = BrandingInquiry.objects.select_related("package", "palette", "owner").prefetch_related(
            "status_events"
        )
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return queryset
        if self.action == "retrieve":
            return queryset
        if self.request.user.is_authenticated:
            return queryset.filter(owner=self.request.user)
        return queryset.none()

    def get_serializer_class(self):
        if self.action == "create":
            return BrandingInquiryWriteSerializer
        if self.action in {"partial_update", "transition"}:
            return BrandingInquiryStatusUpdateSerializer
        return BrandingInquiryReadSerializer

    def get_throttles(self):
        if self.action == "create":
            return [BrandingInquiryThrottle(), *super().get_throttles()]
        return super().get_throttles()

    def get_serializer_context(self) -> dict[str, Any]:
        context = super().get_serializer_context()
        context["client_ip"] = get_client_ip(self.request)
        context["user_agent"] = self.request.META.get("HTTP_USER_AGENT", "")
        return context

    def create(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        inquiry = serializer.save()
        read_serializer = BrandingInquiryReadSerializer(inquiry, context=self.get_serializer_context())
        headers = self.get_success_headers(read_serializer.data)
        return Response(read_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def partial_update(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        inquiry = serializer.save()
        read_serializer = BrandingInquiryReadSerializer(inquiry, context=self.get_serializer_context())
        return Response(read_serializer.data)

    @action(detail=True, methods=["patch"], url_path="transition")
    def transition(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        return self.partial_update(request, *args, **kwargs)
