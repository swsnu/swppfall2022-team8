from rest_framework import viewsets, permissions, status
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from book.models.lend_info import LendInfo
from chat.models import Room
from chat.serializers import RoomSerializer
from chat.paginations import RoomSetPagination
from chat.permissions import IsInRoom
from chat.consumers import ChatConsumer

# Create your views here.


class RoomViewSet(viewsets.GenericViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    pagination_class = RoomSetPagination
    permission_classes = (permissions.IsAuthenticated, IsInRoom)

    # GET /api/room/
    def list(self, request):
        rooms = self.get_queryset().filter(
            Q(lender=request.user) | Q(borrower=request.user)
        )
        paginated_rooms = self.paginate_queryset(rooms)
        data = self.get_serializer(paginated_rooms, many=True).data
        return self.get_paginated_response(data)

    # POST /api/room/
    def create(self, request):
        data = request.data.copy()
        data["borrower"] = request.user.id
        data["lender"] = get_object_or_404(LendInfo, id=data["lend_id"]).owner.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        existing_rooms = self.get_queryset().filter(
            borrower=request.user, lend_id=data["lend_id"]
        )
        if existing_rooms:
            return Response(
                {"error": "you cannot create chat room for same book"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer.save()
        ChatConsumer.get_create_data(
            serializer.data["id"],
            request.user.id,
            f"'{request.user.username}' requested your book!",
            "info",
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)
