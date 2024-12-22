from django.contrib.auth.models import User
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"


class Test(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    duration = models.IntegerField(help_text="Duration in minutes")
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="tests"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deadline = models.DateTimeField(
        null=True, blank=True, help_text="Deadline for taking the test"
    )
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="created_tests", null=True
    )

    def __str__(self):
        return self.name


class Question(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name="questions")
    text = models.TextField()

    def __str__(self):
        return self.text


class Option(models.Model):
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="options"
    )
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"Option for question '{self.question}': {self.text}"


class TestAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="attempts")
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name="attempts")
    score = models.FloatField(default=0)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def calculate_score(self):
        answers = Answer.objects.filter(attempt=self)
        correct_answers = 0
        total_questions = 0

        for answer in answers:
            if answer.selected_option.is_correct:
                correct_answers += 1
            total_questions += 1

        if total_questions > 0:
            self.score = (correct_answers / total_questions) * 100
        else:
            self.score = 0

        self.save()

    @property
    def duration(self):
        if self.end_time and self.start_time:
            return (self.end_time - self.start_time).total_seconds() // 60
        return None


class Answer(models.Model):
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="answers"
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="answers")
    attempt = models.ForeignKey(
        "TestAttempt", on_delete=models.CASCADE, related_name="answers", null=True
    )
    selected_option = models.ForeignKey(
        Option, on_delete=models.CASCADE, related_name="user_answers", null=True
    )

    def __str__(self):
        return f"Answer by {self.user} for question '{self.question}'"


class SavedTest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="saved_tests")
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name="saved_by")
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "test")

    def __str__(self):
        return f"{self.user.username} saved {self.test.name}"
