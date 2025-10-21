from rest_framework import viewsets
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import ProjectMember, Profile
from .serializers import EmployeeSerializer, EmployeeCreateSerializer, EmployeeUpdateSerializer, ProjectMemberSerializer
from works.models import Work
from rest_framework import status
from django.db import transaction

User = get_user_model()

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().select_related('profile')  # Optimize queryset to include profile

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return EmployeeCreateSerializer
        elif self.request.method in ['PUT', 'PATCH']:
            return EmployeeUpdateSerializer  # Use EmployeeUpdateSerializer for updates
        return EmployeeSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        print("Submitted data:", request.data)  # Debug submitted data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = serializer.save()
            user.refresh_from_db()  # Ensure profile is loaded
            try:
                profile = Profile.objects.get(user=user)
                print(f"Profile after creation: designation={profile.designation}, department={profile.department}, employeeId={profile.employeeId}")  # Debug
            except Profile.DoesNotExist:
                print(f"No Profile found for user {user.email} after creation")  # Debug
            # Create or get a default project
            default_project, created = Work.objects.get_or_create(
                workName="Unassigned Project",
                defaults={"workName": "Unassigned Project"}
            )
            # Create a ProjectMember record
            project_member, created = ProjectMember.objects.get_or_create(
                member=user,
                project=default_project,
                defaults={"allocated_hours": 0}
            )
            print(f"Created ProjectMember for {user.email} with ID {project_member.id}")
            # Serialize response
            response_serializer = EmployeeSerializer(user)
            print(f"Response data: {response_serializer.data}")  # Debug
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"Error during creation: {str(e)}")  # Debug errors
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)  # Allow partial updates
        serializer.is_valid(raise_exception=True)
        try:
            user = serializer.save()
            user.refresh_from_db()  # Ensure updated data is loaded
            print(f"Updated user: {user.email}, first_name={user.first_name}")  # Debug
            try:
                profile = Profile.objects.get(user=user)
                print(f"Updated profile: designation={profile.designation}, department={profile.department}, employeeId={profile.employeeId}")  # Debug
            except Profile.DoesNotExist:
                print(f"No Profile found for user {user.email} after update")  # Debug
            # Serialize response
            response_serializer = EmployeeSerializer(user)
            print(f"Update response data: {response_serializer.data}")  # Debug
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error during update: {str(e)}")  # Debug errors
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        print(f"List response data: {serializer.data}")  # Debug
        return Response(serializer.data)

class ProjectMemberViewSet(viewsets.ModelViewSet):
    queryset = ProjectMember.objects.all()
    serializer_class = ProjectMemberSerializer
    permission_classes = []  # For testing; adjust as needed