from rest_framework import permissions


class IsInRoom(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user in (obj.lender, obj.borrower)
