"""DRF serializers for S C News."""

from __future__ import annotations

from typing import Any

from rest_framework import serializers

from .models import NewsArticle, NewsAuthor, NewsCategory, NewsTag, NewsletterSubscriber


class AssetURLMixin:
    def get_asset_url(self, obj: Any, field_name: str) -> str | None:
        file_obj = getattr(obj, field_name, None)
        if not file_obj:
            return None
        request = self.context.get("request")
        url = file_obj.url
        return request.build_absolute_uri(url) if request else url


class NewsCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsCategory
        fields = (
            "id",
            "name_ar",
            "name_en",
            "slug",
            "description_ar",
            "description_en",
            "status",
            "sort_order",
        )


class NewsTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsTag
        fields = ("id", "name_ar", "name_en", "slug")


class NewsAuthorSerializer(AssetURLMixin, serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = NewsAuthor
        fields = (
            "id",
            "name_ar",
            "name_en",
            "slug",
            "title_ar",
            "title_en",
            "bio_ar",
            "bio_en",
            "avatar_url",
            "social_links",
        )

    def get_avatar_url(self, obj: NewsAuthor) -> str | None:
        return self.get_asset_url(obj, "avatar")


class NewsArticleListSerializer(AssetURLMixin, serializers.ModelSerializer):
    category = NewsCategorySerializer(read_only=True)
    author = NewsAuthorSerializer(read_only=True)
    tags = NewsTagSerializer(many=True, read_only=True)
    featured_image_url = serializers.SerializerMethodField()

    class Meta:
        model = NewsArticle
        fields = (
            "id",
            "title_ar",
            "title_en",
            "slug",
            "excerpt_ar",
            "excerpt_en",
            "featured_image_url",
            "image_alt_ar",
            "image_alt_en",
            "category",
            "tags",
            "author",
            "article_type",
            "is_featured",
            "is_breaking",
            "is_trending",
            "published_at",
            "read_time_minutes",
            "views_count",
            "meta_title_ar",
            "meta_title_en",
            "meta_description_ar",
            "meta_description_en",
        )

    def get_featured_image_url(self, obj: NewsArticle) -> str | None:
        return self.get_asset_url(obj, "featured_image")


class NewsArticleDetailSerializer(NewsArticleListSerializer):
    related_articles = serializers.SerializerMethodField()
    previous_article = serializers.SerializerMethodField()
    next_article = serializers.SerializerMethodField()
    latest_articles = serializers.SerializerMethodField()
    trending_articles = serializers.SerializerMethodField()

    class Meta(NewsArticleListSerializer.Meta):
        fields = NewsArticleListSerializer.Meta.fields + (
            "body_ar",
            "body_en",
            "related_articles",
            "previous_article",
            "next_article",
            "latest_articles",
            "trending_articles",
            "created_at",
            "updated_at",
        )

    def get_related_articles(self, obj: NewsArticle) -> list[dict[str, Any]]:
        queryset = (
            NewsArticle.objects.filter(status="published", category=obj.category)
            .exclude(pk=obj.pk)
            .select_related("category", "author")
            .prefetch_related("tags")[:3]
        )
        return NewsArticleListSerializer(queryset, many=True, context=self.context).data

    def get_previous_article(self, obj: NewsArticle) -> dict[str, Any] | None:
        article = (
            NewsArticle.objects.filter(status="published", published_at__lt=obj.published_at)
            .select_related("category", "author")
            .prefetch_related("tags")
            .order_by("-published_at")
            .first()
        )
        return NewsArticleListSerializer(article, context=self.context).data if article else None

    def get_next_article(self, obj: NewsArticle) -> dict[str, Any] | None:
        article = (
            NewsArticle.objects.filter(status="published", published_at__gt=obj.published_at)
            .select_related("category", "author")
            .prefetch_related("tags")
            .order_by("published_at")
            .first()
        )
        return NewsArticleListSerializer(article, context=self.context).data if article else None

    def get_latest_articles(self, obj: NewsArticle) -> list[dict[str, Any]]:
        queryset = (
            NewsArticle.objects.filter(status="published")
            .exclude(pk=obj.pk)
            .select_related("category", "author")
            .prefetch_related("tags")
            .order_by("-published_at")[:4]
        )
        return NewsArticleListSerializer(queryset, many=True, context=self.context).data

    def get_trending_articles(self, obj: NewsArticle) -> list[dict[str, Any]]:
        queryset = (
            NewsArticle.objects.filter(status="published")
            .exclude(pk=obj.pk)
            .select_related("category", "author")
            .prefetch_related("tags")
            .order_by("-is_trending", "-views_count", "-published_at")[:5]
        )
        return NewsArticleListSerializer(queryset, many=True, context=self.context).data


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ("email", "source", "is_active", "created_at")
        read_only_fields = ("is_active", "created_at")

    def validate_source(self, value: str) -> str:
        return (value or "sc_news")[:80]
