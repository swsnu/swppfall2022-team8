from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from book.pagination import LendPageNumberPagination
from book.models.lend_info import LendInfo, LendImage
from book.serializers.lend_info_serializers import LendInfoSerializer
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404


class LendInfoViewSet(viewsets.GenericViewSet):
    serializer_class = LendInfoSerializer
    permission_classes = (IsAuthenticated(),)
    pagination_class = LendPageNumberPagination

    def get_permissions(self):
        return self.permission_classes

    def get_queryset(self):
        qs = LendInfo.objects.all().prefetch_related("history", "images")
        if self.action == "list" or self.action == "user":
            return qs.prefetch_related("book", "book__tags", "owner")
        return qs

    # GET /api/lend/
    def list(self, request):
        title = request.GET.get("title", "")
        author = request.GET.get("author", "")
        tags = request.GET.getlist("tag[]", [])
        lend_infos = (
            self.get_queryset()
            .filter(
                book__title__icontains=title,
                book__author__icontains=author,
            )
            .distinct()
        )
        if tags:
            lend_infos = lend_infos.filter(book__tags__name__in=tags)
        page = self.paginate_queryset(lend_infos)
        serializer = self.get_serializer(page, many=True)
        serializer.user_id = request.user.id
        return self.get_paginated_response(serializer.data)

    # POST /api/lend/
    def create(self, request):
        data = request.data.copy()
        user = request.user
        data["owner"] = user.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # GET /api/lend/{lend_info_id}/
    def retrieve(self, request, pk=None):
        lend_info = self.get_object()
        serializer = self.get_serializer(lend_info)
        serializer.set_sercurity(request.user.id)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # PUT /api/lend/{lend_info_id}/
    def update(self, request, pk=None):
        data = request.data
        lend_info = self.get_object()
        if lend_info.owner != request.user:
            return Response(
                {"error": "You can't update other's book"},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = self.get_serializer(lend_info, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(self.get_serializer(lend_info).data, status=status.HTTP_200_OK)

    # DELETE /api/lend/{lend_info_id}/
    def destroy(self, request, pk=None):
        lend_info = self.get_object()
        if lend_info.owner != request.user:
            return Response(
                {"error": "You can't delete other's book"},
                status=status.HTTP_403_FORBIDDEN,
            )
        lend_info.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    # GET /api/lend/user/
    @action(detail=False, methods=["GET"])
    def user(self, request):
        user = request.user
        lend_infos = user.lend_infos.all()
        page = self.paginate_queryset(lend_infos)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)


class LendImageViewSet(viewsets.GenericViewSet):
    queryset = LendImage.objects.all()
    permission_classes = (IsAuthenticated(),)

    def get_permissions(self):
        return self.permission_classes

    # POST /api/lend/image/
    def create(self, request):
        data = request.data
        if "lend_id" not in data or "image" not in data:
            return Response({"error": "keyerror"}, status=status.HTTP_400_BAD_REQUEST)

        lend_info = get_object_or_404(LendInfo, id=data["lend_id"])
        if lend_info.owner != request.user:
            return Response(
                {"error": "You can't edit image on other's image"},
                status=status.HTTP_403_FORBIDDEN,
            )
        if lend_info.images.count() > 2:
            return Response(
                {"error": "exceeded image counts"}, status=status.HTTP_400_BAD_REQUEST
            )
        image = LendImage.objects.create(lend=lend_info, image=data["image"])
        return Response(
            {"image_id": image.id, "image": image.image.url, "lend_id": lend_info.id},
            status=status.HTTP_201_CREATED,
        )

    # DELETE /api/lend/image/delete_pk/
    def destroy(self, request, pk=None):
        image = self.get_object()
        if image.lend.owner != request.user:
            return Response(
                {"error": "You can't edit image on other's image"},
                status=status.HTTP_403_FORBIDDEN,
            )
        data = {"image_id": image.id, "lend_id": image.lend.id}
        image.delete()
        return Response(data, status=status.HTTP_200_OK)
