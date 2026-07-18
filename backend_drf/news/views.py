"""REST API views for S C News."""

from __future__ import annotations

from typing import Any

from django.db.models import Q, QuerySet
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.request import Request
from rest_framework.response import Response

from .models import ArticleType, NewsArticle, NewsCategory, PublicationStatus
from .serializers import (
    NewsArticleDetailSerializer,
    NewsArticleListSerializer,
    NewsCategorySerializer,
    NewsletterSubscriberSerializer,
)


def published_articles() -> QuerySet[NewsArticle]:
    return (
        NewsArticle.objects.filter(status=PublicationStatus.PUBLISHED)
        .select_related("category", "author")
        .prefetch_related("tags")
    )


class NewsArticleViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NewsArticleListSerializer
    lookup_field = "slug"
    permission_classes = (AllowAny,)

    def get_queryset(self) -> QuerySet[NewsArticle]:
        queryset = published_articles()
        category = self.request.query_params.get("category")
        tag = self.request.query_params.get("tag")
        article_type = self.request.query_params.get("type")
        search = self.request.query_params.get("search") or self.request.query_params.get("q")

        if category:
            queryset = queryset.filter(category__slug=category[:140])
        if tag:
            queryset = queryset.filter(tags__slug=tag[:100])
        if article_type in ArticleType.values:
            queryset = queryset.filter(article_type=article_type)
        if search:
            search = search[:100]
            queryset = queryset.filter(
                Q(title_ar__icontains=search)
                | Q(title_en__icontains=search)
                | Q(excerpt_ar__icontains=search)
                | Q(excerpt_en__icontains=search)
            )
        return queryset.distinct()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return NewsArticleDetailSerializer
        return NewsArticleListSerializer


class NewsCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NewsCategorySerializer
    lookup_field = "slug"
    permission_classes = (AllowAny,)

    def get_queryset(self) -> QuerySet[NewsCategory]:
        return NewsCategory.objects.filter(status=PublicationStatus.PUBLISHED).order_by("sort_order", "name_ar")

    @action(detail=True, methods=["get"], url_path="articles")
    def articles(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        category = self.get_object()
        queryset = published_articles().filter(category=category)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = NewsArticleListSerializer(page, many=True, context=self.get_serializer_context())
            return self.get_paginated_response(serializer.data)
        serializer = NewsArticleListSerializer(queryset, many=True, context=self.get_serializer_context())
        return Response(serializer.data)


class NewsletterSubscriberViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    serializer_class = NewsletterSubscriberSerializer
    permission_classes = (AllowAny,)
    http_method_names = ["post", "options", "head"]


@api_view(["GET"])
@permission_classes([AllowAny])
def news_home(request: Request) -> Response:
    queryset = published_articles()
    featured = queryset.filter(is_featured=True).first() or queryset.first()
    hero_side = queryset.exclude(pk=getattr(featured, "pk", None))[:3]
    breaking = queryset.filter(is_breaking=True)[:5]
    latest = queryset[:9]
    company_updates = queryset.filter(article_type=ArticleType.COMPANY_UPDATE)[:4]
    guides = queryset.filter(article_type=ArticleType.GUIDE)[:4]
    videos = queryset.filter(article_type=ArticleType.VIDEO)[:4]
    case_studies = queryset.filter(article_type=ArticleType.CASE_STUDY)[:3]
    trending = queryset.filter(is_trending=True).order_by("-views_count", "-published_at")[:6]
    categories = NewsCategory.objects.filter(status=PublicationStatus.PUBLISHED).order_by("sort_order", "name_ar")[:8]

    article_context = {"request": request}
    payload = {
        "featured": NewsArticleListSerializer(featured, context=article_context).data if featured else None,
        "hero_side": NewsArticleListSerializer(hero_side, many=True, context=article_context).data,
        "breaking": NewsArticleListSerializer(breaking, many=True, context=article_context).data,
        "latest": NewsArticleListSerializer(latest, many=True, context=article_context).data,
        "company_updates": NewsArticleListSerializer(company_updates, many=True, context=article_context).data,
        "guides": NewsArticleListSerializer(guides, many=True, context=article_context).data,
        "videos": NewsArticleListSerializer(videos, many=True, context=article_context).data,
        "case_studies": NewsArticleListSerializer(case_studies, many=True, context=article_context).data,
        "trending": NewsArticleListSerializer(trending, many=True, context=article_context).data,
        "categories": NewsCategorySerializer(categories, many=True).data,
    }
    return Response(payload)
