from rest_framework import serializers

from book.models.borrow_info import BorrowInfo


class BorrowInfoSerializer(serializers.ModelSerializer):
    active = serializers.BooleanField(required=False, default=True)
    lend_end_time = serializers.DateTimeField(required=False, default=None)
    borrower_username = serializers.ReadOnlyField(source="borrower.username")
    book_title = serializers.ReadOnlyField(source="lend_id.book.title")
    lend_cost = serializers.ReadOnlyField(source="lend_id.cost")
    image = serializers.SerializerMethodField()

    class Meta:
        model = BorrowInfo
        fields = (
            "id",
            "borrower",
            "borrower_username",
            "image",
            "lend_id",
            "book_title",
            "lend_cost",
            "active",
            "lend_start_time",
            "lend_end_time",
        )

    def get_image(self, borrowInfo):
        book = borrowInfo.lend_id.book
        if hasattr(book, "bookimage"):
            return book.bookimage.image.url
        else:
            return None
