from rest_framework import serializers

from book.models.borrow_info import BorrowInfo


class BorrowInfoSerializer(serializers.ModelSerializer):
    active = serializers.BooleanField(required=False, default=True)
    lend_end_time = serializers.DateTimeField(required=False, default=None)
    borrower_username = serializers.ReadOnlyField(source="borrower.username")
    image = serializers.SerializerMethodField()

    class Meta:
        model = BorrowInfo
        fields = (
            "id",
            "borrower",
            "borrower_username",
            "image",
            "lend_id",
            "active",
            "lend_start_time",
            "lend_end_time",
        )

    def get_image(self, borrowInfo):
        book = borrowInfo.lend_id.book
        return book.bookimage.get(book=book).image.url
