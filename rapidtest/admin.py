from django.contrib import admin
from .models import Category, Test, Question, Answer, TestAttempt, Option, SavedTest

# Register your models here.
admin.site.register(Category)
admin.site.register(Test)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(TestAttempt)
admin.site.register(Option)
admin.site.register(SavedTest)
