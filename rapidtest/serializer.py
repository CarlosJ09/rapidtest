from rest_framework import serializers
from .models import (
    User,
    Category,
    Test,
    Question,
    Answer,
    TestAttempt,
    Option,
    SavedTest,
)
from django.utils import timezone
from django.contrib.auth import authenticate
import random


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = "__all__"

    def create(self, validated_data):
        validated_data["attempt"] = self.context["attempt"]
        return super().create(validated_data)


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        exclude = ["question", "is_correct"]


class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True)

    class Meta:
        model = Question
        fields = ["id", "text", "options"]

    def create(self, validated_data):
        options_data = validated_data.pop("options", [])
        question = Question.objects.create(**validated_data)
        for option_data in options_data:
            Option.objects.create(question=question, **option_data)
        return question

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        options = representation.get("options", [])
        random.shuffle(options)
        representation["options"] = options
        return representation


class TestSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    questions = QuestionSerializer(many=True)

    class Meta:
        model = Test
        fields = "__all__"

    def create(self, validated_data):
        questions_data = validated_data.pop("questions", [])
        category = validated_data.pop("category")
        user = self.context["request"].user

        test = Test.objects.create(created_by=user, category=category, **validated_data)

        for question_data in questions_data:
            options_data = question_data.pop("options", [])
            question = Question.objects.create(test=test, **question_data)
            for option_data in options_data:
                Option.objects.create(question=question, **option_data)

        return test

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["category"] = CategorySerializer(instance.category).data
        representation["created_by"] = UserSerializer(instance.created_by).data
        return representation


class TestAttemptSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    test_name = serializers.SerializerMethodField()
    test = serializers.PrimaryKeyRelatedField(queryset=Test.objects.all())
    answers = serializers.DictField(write_only=True)
    answers_details = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()

    class Meta:
        model = TestAttempt
        fields = "__all__"

    def get_test_name(self, obj):
        if isinstance(obj, TestAttempt) and obj.test:
            return obj.test.name
        return None

    def get_answers_details(self, obj):
        answers = Answer.objects.filter(attempt=obj)
        return AnswerSerializer(answers, many=True).data

    def get_duration(self, obj):
        return obj.duration

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["score"] = instance.score
        return representation

    def create(self, validated_data):
        user = self.context["request"].user
        test = validated_data.get("test")

        if test.deadline and test.deadline < timezone.now():
            raise serializers.ValidationError({"test": "Test is closed."})

        answers_data = validated_data.pop("answers", {})

        validated_data["user"] = user
        test_attempt = super().create(validated_data)

        self.save_answers(test_attempt, answers_data)

        return test_attempt

    def save_answers(self, test_attempt, answers_data):
        for question_id, selected_option_id in answers_data.items():
            question = Question.objects.get(id=question_id)
            selected_option = Option.objects.get(id=selected_option_id)

            Answer.objects.update_or_create(
                question=question,
                user=test_attempt.user,
                attempt=test_attempt,
                defaults={"selected_option": selected_option},
            )


class SavedTestSerializer(serializers.ModelSerializer):
    test_detail = TestSerializer(source="test")

    class Meta:
        model = SavedTest
        fields = ["id", "test", "test_detail", "saved_at"]


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data["username"], password=data["password"])
        if user and user.is_active:
            return {"user": user}
        raise serializers.ValidationError("Invalid credentials or inactive user.")
