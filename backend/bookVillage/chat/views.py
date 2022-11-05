from rest_framework import viewsets, permissions, status
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from book.models.lend_info import LendInfo
from chat.models import Room
from chat.serializers import RoomSerializer
from chat.permissions import IsInRoom

# Create your views here.


class RoomViewSet(viewsets.GenericViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = (permissions.IsAuthenticated, IsInRoom)

    def list(self, request):
        room_lend = self.get_queryset().filter(lender=request.user)
        room_borrow = self.get_queryset().filter(borrower=request.user)
        data = {
            "room_lend": self.get_serializer(room_lend, many=True).data,
            "room_borrow": self.get_serializer(room_borrow, many=True).data,
        }
        return Response(data, status=status.HTTP_200_OK)

    def create(self, request):
        data = request.data.copy()
        data["borrower"] = request.user.id
        lend_info = get_object_or_404(LendInfo, id=data["lend_id"])
        data["lender"] = lend_info.owner.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        existing_room = self.get_queryset().filter(
            Q(borrower=request.user) | Q(lend_id=data["lend_id"])
        )
        if existing_room:
            return Response(
                {"error": "you cannot create chat room for same book"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
