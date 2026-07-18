"""Admin registrations for branding models."""

from __future__ import annotations

from django.contrib import admin

from .models import (
    BrandingBlueprint,
    BrandingBlueprintStep,
    BrandingInquiry,
    BrandingInquiryStatusEvent,
    BrandingPackage,
    BrandingPalette,
    PortfolioShowcase,
)


class BrandingBlueprintStepInline(admin.TabularInline):
    model = BrandingBlueprintStep
    extra = 0
    fields = ("title", "slug", "step_key", "sort_order", "is_interactive")


@admin.register(BrandingBlueprint)
class BrandingBlueprintAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "status", "sort_order", "updated_at")
    list_filter = ("status", "category")
    search_fields = ("title", "slug", "summary")
    prepopulated_fields = {"slug": ("title",)}
    inlines = (BrandingBlueprintStepInline,)


@admin.register(BrandingPalette)
class BrandingPaletteAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "status", "primary_hex", "is_featured", "sort_order")
    list_filter = ("status", "category", "is_featured")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(PortfolioShowcase)
class PortfolioShowcaseAdmin(admin.ModelAdmin):
    list_display = ("client_name", "industry", "status", "is_featured", "published_at")
    list_filter = ("status", "industry", "is_featured")
    search_fields = ("client_name", "slug", "headline")
    prepopulated_fields = {"slug": ("client_name",)}
    autocomplete_fields = ("palette",)


@admin.register(BrandingPackage)
class BrandingPackageAdmin(admin.ModelAdmin):
    list_display = ("title", "tier", "status", "starting_price", "currency", "is_priority")
    list_filter = ("tier", "status", "is_priority")
    search_fields = ("title", "slug")
    prepopulated_fields = {"slug": ("title",)}


class BrandingInquiryStatusEventInline(admin.TabularInline):
    model = BrandingInquiryStatusEvent
    extra = 0
    readonly_fields = ("created_at",)


@admin.register(BrandingInquiry)
class BrandingInquiryAdmin(admin.ModelAdmin):
    list_display = ("public_id", "full_name", "email", "budget_tier", "status", "created_at")
    list_filter = ("status", "budget_tier", "source")
    search_fields = ("public_id", "full_name", "email", "company_name")
    readonly_fields = ("public_id", "client_ip", "user_agent", "created_at", "updated_at")
    autocomplete_fields = ("package", "palette", "owner")
    inlines = (BrandingInquiryStatusEventInline,)


@admin.register(BrandingInquiryStatusEvent)
class BrandingInquiryStatusEventAdmin(admin.ModelAdmin):
    list_display = ("inquiry", "status", "actor", "created_at")
    list_filter = ("status",)
    search_fields = ("inquiry__public_id", "note")
    autocomplete_fields = ("inquiry", "actor")
