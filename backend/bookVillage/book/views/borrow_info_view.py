from django.utils.datetime_safe import datetime
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from book.models.borrow_info import BorrowInfo
from book.models.lend_info import LendInfo
from book.serializers.borrrow_info_serializers import BorrowInfoSerializer
from rest_framework.decorators import action


class BorrowInfoViewSet(viewsets.GenericViewSet):
    queryset = BorrowInfo.objects.all()
    serializer_class = BorrowInfoSerializer
    permission_classes = (IsAuthenticated(),)

    def get_permissions(self):
        return self.permission_classes

    # POST /api/borrow/
    def create(self, request):
        data = request.data.copy()
        user = request.user
        data["borrower"] = user.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        lend_info = LendInfo.objects.get(id=data["lend_id"])
        if lend_info.current_borrow:
            return Response(
                {"error": "Book is already borrowed"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if lend_info.owner == request.user:
            return Response(
                {"error": "You can't borrow your book"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # PUT /api/borrow/id/
    def update(self, request, pk=None):
        borrow_info = self.get_object()
        if request.data:
            return Response(
                {
                    "error": "You can only toggle borrow active status. Please make your request body empty"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not borrow_info.active:
            return Response(
                {"error": "You can't toggle on borrow active status again"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not borrow_info.is_accesible(request.user):
            return Response(
                {"error": "You can't update other's status"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        borrow_info.active = False
        borrow_info.lend_end_time = datetime.now()
        borrow_info.save()
        return Response(
            self.get_serializer(borrow_info).data, status=status.HTTP_200_OK
        )

    @action(detail=False, methods=["GET"])
    def user(self, request):
        user = request.user
        borrow_infos = user.borrow_history
        serializer = self.get_serializer(borrow_infos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
