from rest_framework import serializers

from book.models.borrow_info import BorrowInfo


class BorrowInfoSerializer(serializers.ModelSerializer):
    active = serializers.BooleanField(required=False, default=True)
    lend_end_time = serializers.DateTimeField(required=False, default=None)
    borrower_username = serializers.ReadOnlyField(source="borrower.username")

    class Meta:
        model = BorrowInfo
        fields = (
            "id",
            "borrower",
            "borrower_username",
            "lend_id",
            "active",
            "lend_start_time",
            "lend_end_time",
        )
