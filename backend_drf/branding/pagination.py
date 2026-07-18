"""Pagination tuned for interactive portfolio and palette surfaces."""

from __future__ import annotations

from math import ceil

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class BrandingPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 48

    def get_paginated_response(self, data: list[dict]) -> Response:
        page_size = self.get_page_size(self.request) or self.page_size
        return Response(
            {
                "count": self.page.paginator.count,
                "next": self.get_next_link(),
                "previous": self.get_previous_link(),
                "page": self.page.number,
                "page_size": page_size,
                "total_pages": ceil(self.page.paginator.count / page_size) if page_size else 1,
                "results": data,
            }
        )
