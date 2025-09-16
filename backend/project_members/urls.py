# project_members/urls.py
from rest_framework.routers import DefaultRouter
from .views import ProjectMemberViewSet, EmployeeViewSet

router = DefaultRouter()
router.register(r'project-members', ProjectMemberViewSet)
router.register(r'employees', EmployeeViewSet)  # If you want to keep this
urlpatterns = router.urls