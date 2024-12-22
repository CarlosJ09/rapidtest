from django.urls import path, include
from rest_framework.routers import SimpleRouter
from rapidtest import views
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

router = SimpleRouter()
router.register(r"users", views.UserView, "users")
router.register(r"categories", views.CategoryView, "categories")
router.register(r"tests", views.TestView, "tests")
router.register(r"questions", views.QuestionView, "questions")
router.register(r"answers", views.AnswerView, "answers")
router.register(r"attempts", views.TestAttemptView, "attempts")
router.register(r"saved_tests", views.SavedTestView, "saved_tests")

urlpatterns = [
    path("api/", include(router.urls)),
    path("api/register/", views.RegisterView.as_view(), name="register"),
    path("api/login/", views.LoginView.as_view(), name="login"),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
]
