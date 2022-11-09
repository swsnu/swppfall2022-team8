from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from book.models.lend_info import LendInfo
from book.serializers.lend_info_serializers import LendInfoSerializer
from rest_framework.decorators import action


class LendInfoViewSet(viewsets.GenericViewSet):
    queryset = LendInfo.objects.all()
    serializer_class = LendInfoSerializer
    permission_classes = (IsAuthenticated(),)

    def get_permissions(self):
        return self.permission_classes

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
        datas = self.get_serializer(lend_infos, many=True).data
        for data in datas:
            data["status"] = "borrowed" if data["status"] else None
        return Response(datas, status=status.HTTP_200_OK)

    # POST /api/lend/
    def create(self, request):
        data = request.data.copy()
        user = request.user
        data["owner"] = user.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # GET /api/lend/{lend_info_id}
    def retrieve(self, request, pk=None):
        lend_info = self.get_object()
        data = self.get_serializer(lend_info).data
        if lend_info.owner != request.user:
            data["status"] = "borrowed" if data["status"] else None
        return Response(data, status=status.HTTP_200_OK)

    # PUT /api/lend/{lend_info_id}
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

    # DELETE /api/lend/{lend_info_id}
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
        lend_infos = user.lend_infos
        data = self.get_serializer(lend_infos, many=True).data
        return Response(data, status=status.HTTP_200_OK)
