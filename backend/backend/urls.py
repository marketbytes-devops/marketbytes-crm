from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),

    # Existing apps
    path("api/", include("authapp.urls")),
    path("documentation/", include("documentation.urls")),

    # Works (your projects)
    path("api/works/", include("works.urls")),

    # Newly created apps
    path("api/clients/", include("clients.urls")),

    path("api/categories/", include("categories.urls")),
    path("api/departments/", include("departments.urls")),
    path("api/project-members/", include("project_members.urls")),

    path("api/services/", include("services.urls"))



]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
