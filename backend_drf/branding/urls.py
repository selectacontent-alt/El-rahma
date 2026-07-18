"""URL routes for the Visual Branding & Identity module."""

from __future__ import annotations

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    BlueprintStepViewSet,
    BrandingBlueprintViewSet,
    BrandingInquiryViewSet,
    BrandingPackageViewSet,
    BrandingPaletteViewSet,
    PortfolioShowcaseViewSet,
)

router = DefaultRouter()
router.register("blueprints", BrandingBlueprintViewSet, basename="branding-blueprints")
router.register("blueprint-steps", BlueprintStepViewSet, basename="branding-blueprint-steps")
router.register("palettes", BrandingPaletteViewSet, basename="branding-palettes")
router.register("portfolio", PortfolioShowcaseViewSet, basename="branding-portfolio")
router.register("packages", BrandingPackageViewSet, basename="branding-packages")
router.register("inquiries", BrandingInquiryViewSet, basename="branding-inquiries")

urlpatterns = [
    path("", include(router.urls)),
]
