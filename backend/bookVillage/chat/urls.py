from rest_framework.routers import SimpleRouter
from django.urls import path, include
from chat.views import RoomViewSet

room_app_name = "room"
router = SimpleRouter()
router.register(room_app_name, RoomViewSet, basename=room_app_name)

urlpatterns = [path("", include(router.urls))]
