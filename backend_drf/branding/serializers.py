"""DRF serializers for the Visual Branding & Identity API."""

from __future__ import annotations

from typing import Any

from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from .models import (
    BrandingBlueprint,
    BrandingBlueprintStep,
    BrandingInquiry,
    BrandingInquiryStatusEvent,
    BrandingPackage,
    BrandingPalette,
    BudgetTier,
    InquiryStatus,
    PortfolioShowcase,
    PublicationStatus,
)
from .validators import (
    sanitize_plain_text,
    validate_brief_goals,
    validate_lottie_config,
    validate_mockup_mapping,
    validate_safe_json_payload,
)


class ModelCleanMixin:
    """Run Django model validation before persisting serializer data."""

    def _full_clean(self, instance: Any) -> None:
        try:
            instance.full_clean()
        except DjangoValidationError as exc:
            raise serializers.ValidationError(exc.message_dict if hasattr(exc, "message_dict") else exc.messages) from exc

    def create(self, validated_data: dict[str, Any]) -> Any:
        model = self.Meta.model
        instance = model(**validated_data)
        self._full_clean(instance)
        instance.save()
        return instance

    def update(self, instance: Any, validated_data: dict[str, Any]) -> Any:
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        self._full_clean(instance)
        instance.save()
        return instance


class AssetURLMixin:
    """Expose uploaded asset URLs as absolute URLs where a request is available."""

    def get_asset_url(self, obj: Any, field_name: str) -> str | None:
        file_obj = getattr(obj, field_name, None)
        if not file_obj:
            return None
        request = self.context.get("request")
        url = file_obj.url
        return request.build_absolute_uri(url) if request else url


class BlueprintStepSerializer(ModelCleanMixin, serializers.ModelSerializer):
    """Renderable identity blueprint step."""

    blueprint = serializers.SlugRelatedField(read_only=True, slug_field="slug")
    blueprint_slug = serializers.SlugRelatedField(
        source="blueprint",
        slug_field="slug",
        queryset=BrandingBlueprint.objects.all(),
        write_only=True,
    )

    class Meta:
        model = BrandingBlueprintStep
        fields = (
            "id",
            "blueprint",
            "blueprint_slug",
            "title",
            "slug",
            "step_key",
            "description",
            "svg_path_data",
            "lottie_config",
            "metadata",
            "sort_order",
            "is_interactive",
        )
        read_only_fields = ("id",)

    def validate_lottie_config(self, value: Any) -> Any:
        validate_lottie_config(value)
        return value

    def validate_metadata(self, value: Any) -> Any:
        validate_safe_json_payload(value)
        return value


class BrandingBlueprintSerializer(ModelCleanMixin, serializers.ModelSerializer):
    """Blueprint with prefetched steps for the dynamic service-builder UI."""

    steps = BlueprintStepSerializer(many=True, read_only=True)

    class Meta:
        model = BrandingBlueprint
        fields = (
            "id",
            "title",
            "slug",
            "category",
            "status",
            "summary",
            "metadata",
            "sort_order",
            "steps",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def validate_metadata(self, value: Any) -> Any:
        validate_safe_json_payload(value)
        return value


class BrandingPaletteSerializer(ModelCleanMixin, serializers.ModelSerializer):
    """Pre-curated palette used by live color pickers and mockups."""

    colors = serializers.SerializerMethodField()

    class Meta:
        model = BrandingPalette
        fields = (
            "id",
            "name",
            "slug",
            "category",
            "status",
            "primary_hex",
            "secondary_hex",
            "accent_hex",
            "neutral_hex",
            "colors",
            "mockup_mapping",
            "is_featured",
            "sort_order",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "colors", "created_at", "updated_at")

    def get_colors(self, obj: BrandingPalette) -> dict[str, str]:
        return {
            "primary": obj.primary_hex,
            "secondary": obj.secondary_hex,
            "accent": obj.accent_hex,
            "neutral": obj.neutral_hex,
        }

    def validate_mockup_mapping(self, value: Any) -> Any:
        validate_mockup_mapping(value)
        return value


class PortfolioShowcaseSerializer(ModelCleanMixin, AssetURLMixin, serializers.ModelSerializer):
    """Before/after rebranding story with optimized palette relation."""

    legacy_logo_url = serializers.SerializerMethodField()
    transformed_logo_url = serializers.SerializerMethodField()
    palette = BrandingPaletteSerializer(read_only=True)
    palette_slug = serializers.SlugRelatedField(
        source="palette",
        slug_field="slug",
        queryset=BrandingPalette.objects.filter(status=PublicationStatus.ACTIVE),
        allow_null=True,
        required=False,
        write_only=True,
    )

    class Meta:
        model = PortfolioShowcase
        fields = (
            "id",
            "client_name",
            "slug",
            "industry",
            "status",
            "headline",
            "story",
            "legacy_logo",
            "legacy_logo_url",
            "legacy_typography",
            "legacy_palette",
            "transformed_logo",
            "transformed_logo_url",
            "transformed_typography",
            "transformed_assets",
            "palette",
            "palette_slug",
            "published_at",
            "is_featured",
            "sort_order",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "legacy_logo_url", "transformed_logo_url", "created_at", "updated_at")
        extra_kwargs = {
            "legacy_logo": {"write_only": True},
            "transformed_logo": {"write_only": True},
        }

    def get_legacy_logo_url(self, obj: PortfolioShowcase) -> str | None:
        return self.get_asset_url(obj, "legacy_logo")

    def get_transformed_logo_url(self, obj: PortfolioShowcase) -> str | None:
        return self.get_asset_url(obj, "transformed_logo")

    def validate_legacy_palette(self, value: Any) -> Any:
        validate_safe_json_payload(value)
        return value

    def validate_transformed_assets(self, value: Any) -> Any:
        validate_safe_json_payload(value)
        return value


class BrandingPackageSerializer(ModelCleanMixin, serializers.ModelSerializer):
    """Bookable branding package."""

    class Meta:
        model = BrandingPackage
        fields = (
            "id",
            "title",
            "slug",
            "tier",
            "status",
            "starting_price",
            "currency",
            "estimated_timeline_days",
            "deliverables",
            "is_priority",
            "sort_order",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def validate_deliverables(self, value: Any) -> Any:
        validate_safe_json_payload(value)
        return value


class InquiryStatusEventSerializer(serializers.ModelSerializer):
    """Status event exposed for inquiry tracking."""

    class Meta:
        model = BrandingInquiryStatusEvent
        fields = ("id", "status", "note", "created_at")
        read_only_fields = fields


class BrandingInquiryReadSerializer(serializers.ModelSerializer):
    """Read serializer for inquiry tracking and back-office review."""

    package = BrandingPackageSerializer(read_only=True)
    palette = BrandingPaletteSerializer(read_only=True)
    status_events = InquiryStatusEventSerializer(many=True, read_only=True)

    class Meta:
        model = BrandingInquiry
        fields = (
            "public_id",
            "package",
            "palette",
            "full_name",
            "email",
            "company_name",
            "phone",
            "website",
            "budget_tier",
            "budget_min",
            "budget_max",
            "project_summary",
            "goals",
            "status",
            "source",
            "last_status_at",
            "status_events",
            "created_at",
            "updated_at",
        )
        read_only_fields = fields


class BrandingInquiryWriteSerializer(serializers.ModelSerializer):
    """Write serializer for the instant booking/inquiry funnel."""

    package_slug = serializers.SlugRelatedField(
        source="package",
        slug_field="slug",
        queryset=BrandingPackage.objects.filter(status=PublicationStatus.ACTIVE),
        required=False,
        allow_null=True,
        write_only=True,
    )
    palette_slug = serializers.SlugRelatedField(
        source="palette",
        slug_field="slug",
        queryset=BrandingPalette.objects.filter(status=PublicationStatus.ACTIVE),
        required=False,
        allow_null=True,
        write_only=True,
    )
    public_id = serializers.UUIDField(read_only=True)
    status = serializers.ChoiceField(choices=InquiryStatus.choices, read_only=True)

    class Meta:
        model = BrandingInquiry
        fields = (
            "public_id",
            "package_slug",
            "palette_slug",
            "full_name",
            "email",
            "company_name",
            "phone",
            "website",
            "budget_tier",
            "budget_min",
            "budget_max",
            "project_summary",
            "goals",
            "source",
            "utm_payload",
            "status",
        )
        read_only_fields = ("public_id", "status")

    def validate_full_name(self, value: str) -> str:
        return sanitize_plain_text(value, max_length=140)

    def validate_company_name(self, value: str) -> str:
        return sanitize_plain_text(value, max_length=160)

    def validate_phone(self, value: str) -> str:
        return sanitize_plain_text(value, max_length=40)

    def validate_project_summary(self, value: str) -> str:
        return sanitize_plain_text(value, max_length=3000)

    def validate_source(self, value: str) -> str:
        return sanitize_plain_text(value, max_length=80) or "branding_page"

    def validate_goals(self, value: Any) -> Any:
        validate_brief_goals(value)
        return value

    def validate_utm_payload(self, value: Any) -> Any:
        validate_safe_json_payload(value)
        return value

    def validate(self, attrs: dict[str, Any]) -> dict[str, Any]:
        budget_tier = attrs.get("budget_tier")
        package = attrs.get("package")
        if package and budget_tier and package.tier != budget_tier:
            raise serializers.ValidationError({"budget_tier": "Selected package does not match the budget tier."})
        if attrs.get("budget_min") and attrs.get("budget_max") and attrs["budget_min"] > attrs["budget_max"]:
            raise serializers.ValidationError({"budget_max": "budget_max must be greater than or equal to budget_min."})
        if budget_tier not in BudgetTier.values:
            raise serializers.ValidationError({"budget_tier": "Unsupported budget tier."})
        return attrs

    @transaction.atomic
    def create(self, validated_data: dict[str, Any]) -> BrandingInquiry:
        request = self.context.get("request")
        user = request.user if request and request.user.is_authenticated else None
        inquiry = BrandingInquiry(
            **validated_data,
            owner=user,
            client_ip=self.context.get("client_ip"),
            user_agent=self.context.get("user_agent", "")[:512],
            status=InquiryStatus.NEW,
            last_status_at=timezone.now(),
        )
        try:
            inquiry.full_clean()
        except DjangoValidationError as exc:
            raise serializers.ValidationError(exc.message_dict if hasattr(exc, "message_dict") else exc.messages) from exc
        inquiry.save()
        BrandingInquiryStatusEvent.objects.create(
            inquiry=inquiry,
            status=InquiryStatus.NEW,
            note="Inquiry submitted through the branding funnel.",
            actor=user,
        )
        return inquiry


class BrandingInquiryStatusUpdateSerializer(serializers.ModelSerializer):
    """Back-office serializer for status transitions with audit events."""

    note = serializers.CharField(max_length=500, required=False, allow_blank=True, write_only=True)

    class Meta:
        model = BrandingInquiry
        fields = ("status", "note")

    def validate(self, attrs: dict[str, Any]) -> dict[str, Any]:
        if "status" not in attrs:
            raise serializers.ValidationError({"status": "A target status is required."})
        return attrs

    @transaction.atomic
    def update(self, instance: BrandingInquiry, validated_data: dict[str, Any]) -> BrandingInquiry:
        note = sanitize_plain_text(validated_data.pop("note", ""), max_length=500)
        status = validated_data["status"]
        request = self.context.get("request")
        actor = request.user if request and request.user.is_authenticated else None
        instance.status = status
        instance.last_status_at = timezone.now()
        try:
            instance.full_clean()
        except DjangoValidationError as exc:
            raise serializers.ValidationError(exc.message_dict if hasattr(exc, "message_dict") else exc.messages) from exc
        instance.save(update_fields=("status", "last_status_at", "updated_at"))
        BrandingInquiryStatusEvent.objects.create(
            inquiry=instance,
            status=status,
            note=note,
            actor=actor,
        )
        return instance
