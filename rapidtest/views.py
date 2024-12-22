from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import authentication_classes, permission_classes
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
from . import serializer
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from drf_spectacular.utils import extend_schema


class BearerTokenAuthentication(TokenAuthentication):
    keyword = "Bearer"


class RegisterView(APIView):
    @extend_schema(request=serializer.UserSerializer)
    def post(self, request):
        user_serializer = serializer.UserSerializer(data=request.data)

        if user_serializer.is_valid():
            user_serializer.save()

            user = User.objects.get(username=user_serializer.data["username"])
            user.set_password(user_serializer.data["password"])
            user.save()

            token = Token.objects.get_or_create(user=user)[0]
            return Response({"token": token.key, "user": user_serializer.data})

        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    @extend_schema(request=serializer.LoginSerializer)
    def post(self, request):
        login_serializer = serializer.LoginSerializer(data=request.data)

        if login_serializer.is_valid():
            user = login_serializer.validated_data["user"]
            token, _ = Token.objects.get_or_create(user=user)

            user_data = serializer.UserSerializer(user).data

            return Response(
                {"token": token.key, "user": user_data}, status=status.HTTP_200_OK
            )

        return Response(login_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@authentication_classes([BearerTokenAuthentication])
@permission_classes([IsAuthenticated])
class UserView(viewsets.ModelViewSet):
    serializer_class = serializer.UserSerializer
    queryset = User.objects.all()


@authentication_classes([BearerTokenAuthentication])
@permission_classes([IsAuthenticated])
class CategoryView(viewsets.ModelViewSet):
    serializer_class = serializer.CategorySerializer
    queryset = Category.objects.all()


@authentication_classes([BearerTokenAuthentication])
@permission_classes([IsAuthenticated])
class TestView(viewsets.ModelViewSet):
    serializer_class = serializer.TestSerializer
    queryset = Test.objects.all()

    def get_queryset(self):
        queryset = Test.objects.all()
        category_id = self.request.query_params.get("category")

        if self.request.query_params.get("user") == "true":
            queryset = queryset.filter(created_by=self.request.user)
        if category_id:
            queryset = queryset.filter(category=category_id)

        return queryset


@authentication_classes([BearerTokenAuthentication])
@permission_classes([IsAuthenticated])
class QuestionView(viewsets.ModelViewSet):
    serializer_class = serializer.QuestionSerializer
    queryset = Question.objects.all()


@authentication_classes([BearerTokenAuthentication])
@permission_classes([IsAuthenticated])
class AnswerView(viewsets.ModelViewSet):
    serializer_class = serializer.AnswerSerializer
    queryset = Answer.objects.all()


@authentication_classes([BearerTokenAuthentication])
@permission_classes([IsAuthenticated])
class TestAttemptView(viewsets.ModelViewSet):
    serializer_class = serializer.TestAttemptSerializer
    queryset = TestAttempt.objects.all()

    def get_queryset(self):
        test_id = self.request.query_params.get("test")

        if self.request.user:
            queryset = TestAttempt.objects.filter(user=self.request.user)
        if test_id:
            queryset = queryset.filter(test=test_id)

        return queryset.order_by("-start_time")

    def update(self, request, pk=None):
        test_attempt = self.get_object()

        test_attempt.end_time = now()
        test_attempt.save()

        answers_data = request.data.get("answers", None)

        if answers_data:
            self.save_answers(test_attempt, answers_data)

        test_attempt.calculate_score()

        serializer = self.get_serializer(test_attempt)
        return Response(serializer.data)

    def save_answers(self, test_attempt, answers_data):
        for question_id, selected_option_id in answers_data.items():
            question = Question.objects.get(id=question_id)
            selected_option = Option.objects.get(id=selected_option_id)

            answer = Answer.objects.filter(
                question=question, user=test_attempt.user, attempt=test_attempt
            ).first()

            if answer:
                answer.selected_option = selected_option
                answer.save()
            else:
                Answer.objects.create(
                    question=question,
                    user=test_attempt.user,
                    attempt=test_attempt,
                    selected_option=selected_option,
                )


@authentication_classes([BearerTokenAuthentication])
@permission_classes([IsAuthenticated])
class SavedTestView(viewsets.ModelViewSet):
    serializer_class = serializer.SavedTestSerializer
    queryset = SavedTest.objects.all()

    def get_queryset(self):
        return SavedTest.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        user = request.user
        test_id = request.data.get("test")

        if not test_id:
            return Response(
                {"error": "Test ID is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        test = get_object_or_404(Test, id=test_id)

        saved_test, created = SavedTest.objects.get_or_create(user=user, test=test)
        if not created:
            return Response(
                {
                    "message": "Test is already saved.",
                    "id": saved_test.id,
                    "name": saved_test.test.name,
                },
            )

        serializer = self.get_serializer(saved_test)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            return Response(
                {"error": "You can only remove your own saved tests."},
                status=status.HTTP_403_FORBIDDEN,
            )
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
