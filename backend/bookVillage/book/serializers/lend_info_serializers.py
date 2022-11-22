from json import JSONDecodeError

from rest_framework import serializers

from book.models.lend_info import LendInfo, LendImage
from django.conf import settings


class LendInfoSerializer(serializers.ModelSerializer):
    questions = serializers.JSONField(required=False, default=list)
    cost = serializers.IntegerField(required=True)
    additional = serializers.CharField(required=False, allow_blank=True, default="")
    book_info = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    owner_username = serializers.ReadOnlyField(source="owner.username")
    images = serializers.SerializerMethodField()

    class Meta:
        model = LendInfo
        fields = (
            "id",
            "book",
            "book_info",
            "owner",
            "owner_username",
            "questions",
            "cost",
            "additional",
            "status",
            "images",
        )

    def validate_questions(self, questions):
        if isinstance(questions, list):
            for question in questions:
                if not isinstance(question, str):
                    raise serializers.ValidationError(
                        "questions is list. But must be list string input"
                    )
            return questions
        else:
            raise serializers.ValidationError(
                "questions must be list string input or nothing"
            )

    def get_book_info(self, lend_info):
        from book.serializers.book_serializers import BookSerializer

        book = lend_info.book
        serializer = BookSerializer(book)
        data = serializer.data.copy()
        data.pop("id")
        return data

    def get_status(self, lend_info):
        from book.serializers.borrrow_info_serializers import BorrowInfoSerializer

        borrow_info = lend_info.current_borrow
        if borrow_info:
            serializer = BorrowInfoSerializer(borrow_info)
            data = serializer.data.copy()
            return data
        else:
            return None

    def get_images(self, lend_info):
        data = []
        for image in lend_info.images.all():
            data.append({"id": image.id, "image": image.image})

        return data

    def validate(self, data):
        validated_data = super(LendInfoSerializer, self).validate(data)
        validated_data["new_images"] = data.get("new_images")
        validated_data["delete_images"] = data.get("delete_images")
        return validated_data

    def update(self, instance, validated_data):
        instance.cost = validated_data.get("cost", instance.cost)
        instance.additional = validated_data.get("additional", instance.additional)
        new_images = validated_data.pop("new_images", [])

        if new_images:
            for image in new_images:
                instance.add_image(image)

        delete_images = validated_data.pop("delete_images", [])
        if delete_images:
            for image_id in delete_images:
                image = LendImage.objects.get(id=image_id)
                image.delete()

        instance.save()
        return instance

    def create(self, validated_data):
        validated_data.pop("delete_images")
        new_images = validated_data.pop("new_images", [])
        lend_info = LendInfo.objects.create(**validated_data)
        if new_images:
            for image in new_images:
                lend_info.add_image(image)
        return lend_info
