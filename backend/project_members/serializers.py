from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import ProjectMember, Profile
from departments.models import Department
from designation.models import Designation
from rest_framework.exceptions import ValidationError

User = get_user_model()

class EmployeeSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    employeeId = serializers.CharField(source='profile.employeeId', read_only=True, allow_null=True)
    employeeName = serializers.SerializerMethodField()
    employeeEmail = serializers.CharField(source='email', read_only=True)
    department = serializers.SerializerMethodField()
    designation = serializers.SerializerMethodField()
    dateOfBirth = serializers.DateField(source='profile.dateOfBirth', read_only=True, allow_null=True)
    joiningDate = serializers.DateField(source='profile.joiningDate', read_only=True, allow_null=True)
    probationPeriod = serializers.DateField(source='profile.probationPeriod', read_only=True, allow_null=True)
    slackUsername = serializers.CharField(source='profile.slackUsername', read_only=True, allow_null=True)
    exitDate = serializers.DateField(source='profile.exitDate', read_only=True, allow_null=True)
    gender = serializers.CharField(source='profile.gender', read_only=True, allow_null=True)
    address = serializers.CharField(source='profile.address', read_only=True, allow_null=True)
    skills = serializers.CharField(source='profile.skills', read_only=True, allow_null=True)
    mobile = serializers.CharField(source='profile.mobile', read_only=True, allow_null=True)
    hourlyRate = serializers.DecimalField(source='profile.hourlyRate', max_digits=10, decimal_places=2, read_only=True, allow_null=True)
    logIn = serializers.CharField(source='profile.logIn', read_only=True, allow_null=True)
    emailNotifications = serializers.CharField(source='profile.emailNotifications', read_only=True, allow_null=True)
    reportTo = serializers.CharField(source='profile.reportTo', read_only=True, allow_null=True)
    profilePicture = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'name', 'employeeId', 'employeeName', 'employeeEmail',
            'department', 'designation', 'dateOfBirth', 'joiningDate', 'probationPeriod',
            'slackUsername', 'exitDate', 'gender', 'address', 'skills', 'mobile', 'hourlyRate',
            'logIn', 'emailNotifications', 'reportTo', 'profilePicture',
        ]

    def get_name(self, obj):
        return obj.get_full_name() or obj.username

    def get_employeeName(self, obj):
        return obj.get_full_name() or obj.username

    def get_department(self, obj):
        try:
            profile = obj.profile
            department_name = profile.department.name if profile.department else None
            print(f"get_department: User {obj.email}, department: {department_name}")
            return department_name
        except Profile.DoesNotExist:
            print(f"get_department: No Profile for user {obj.email}")
            return None

    def get_designation(self, obj):
        try:
            profile = obj.profile
            designation_name = profile.designation.designation_name if profile.designation else None
            print(f"get_designation: User {obj.email}, designation: {designation_name}")
            return designation_name
        except Profile.DoesNotExist:
            print(f"get_designation: No Profile for user {obj.email}")
            return None

    def get_profilePicture(self, obj):
        try:
            profile = obj.profile
            if profile.profilePicture:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(profile.profilePicture.url)
                return profile.profilePicture.url
            return None
        except Profile.DoesNotExist:
            return None

class EmployeeCreateSerializer(serializers.ModelSerializer):
    employeeId = serializers.CharField(required=False, allow_null=True)
    employeeName = serializers.CharField(source='first_name', required=True)
    employeeEmail = serializers.EmailField(source='email', required=True)
    password = serializers.CharField(write_only=True)
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all(), required=False, allow_null=True)
    designation = serializers.PrimaryKeyRelatedField(queryset=Designation.objects.all(), required=False, allow_null=True)
    dateOfBirth = serializers.DateField(required=False, allow_null=True)
    joiningDate = serializers.DateField(required=False, allow_null=True)
    probationPeriod = serializers.DateField(required=False, allow_null=True)
    slackUsername = serializers.CharField(required=False, allow_null=True)
    exitDate = serializers.DateField(required=False, allow_null=True)
    gender = serializers.ChoiceField(choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], required=False)
    address = serializers.CharField(required=False, allow_null=True)
    skills = serializers.CharField(required=False, allow_null=True)
    mobile = serializers.CharField(required=False, allow_null=True)
    hourlyRate = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    logIn = serializers.ChoiceField(choices=[('Enable', 'Enable'), ('Disable', 'Disable')], required=False)
    emailNotifications = serializers.ChoiceField(choices=[('Enable', 'Enable'), ('Disable', 'Disable')], required=False)
    profilePicture = serializers.ImageField(required=False, allow_null=True)
    reportTo = serializers.CharField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            'employeeId', 'employeeName', 'employeeEmail', 'password', 'department', 'designation',
            'dateOfBirth', 'joiningDate', 'probationPeriod', 'slackUsername', 'exitDate', 'gender',
            'address', 'skills', 'mobile', 'hourlyRate', 'logIn', 'emailNotifications', 'profilePicture',
            'reportTo',
        ]

    def validate(self, data):
        email = data.get('email')
        first_name = data.get('first_name')
        
        if User.objects.filter(email=email).exists():
            raise ValidationError({"employeeEmail": "A user with this email already exists."})
        
        if User.objects.filter(first_name=first_name).exclude(id=self.instance.id if self.instance else None).exists():
            raise ValidationError({"employeeName": "A user with this name already exists."})
        
        return data

    def create(self, validated_data):
        profile_data = {
            'employeeId': validated_data.pop('employeeId', None),
            'department': validated_data.pop('department', None),
            'designation': validated_data.pop('designation', None),
            'dateOfBirth': validated_data.pop('dateOfBirth', None),
            'joiningDate': validated_data.pop('joiningDate', None),
            'probationPeriod': validated_data.pop('probationPeriod', None),
            'slackUsername': validated_data.pop('slackUsername', None),
            'exitDate': validated_data.pop('exitDate', None),
            'gender': validated_data.pop('gender', 'male'),
            'address': validated_data.pop('address', None),
            'skills': validated_data.pop('skills', None),
            'mobile': validated_data.pop('mobile', None),
            'hourlyRate': validated_data.pop('hourlyRate', None),
            'logIn': validated_data.pop('logIn', 'Enable'),
            'emailNotifications': validated_data.pop('emailNotifications', 'Enable'),
            'profilePicture': validated_data.pop('profilePicture', None),
            'reportTo': validated_data.pop('reportTo', None),
        }
        password = validated_data.pop('password')
        username = validated_data.get('email')
        user = User.objects.create_user(
            username=username,
            email=validated_data.get('email'),
            first_name=validated_data.get('first_name'),
            password=password
        )
        profile = Profile.objects.create(user=user, **profile_data)
        print(f"Created Profile for user {user.email}: designation={profile.designation}, department={profile.department}, employeeId={profile.employeeId}")
        from works.models import Work
        from .models import ProjectMember
        default_project, created = Work.objects.get_or_create(
            workName="Unassigned Project",
            defaults={"workName": "Unassigned Project"}
        )
        project_member, created = ProjectMember.objects.get_or_create(
            member=user,
            project=default_project,
            defaults={"allocated_hours": 0}
        )
        print(f"Created ProjectMember for {user.email} with ID {project_member.id}")
        return user

class ProjectMemberSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source="member.username", read_only=True)
    project_name = serializers.CharField(source="project.workName", read_only=True)
    member_email = serializers.CharField(source="member.email", read_only=True)

    class Meta:
        model = ProjectMember
        fields = ["id", "project", "project_name", "member", "member_name", "allocated_hours", "member_email"]

class EmployeeUpdateSerializer(serializers.ModelSerializer):
    department = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), required=False, allow_null=True
    )
    designation = serializers.PrimaryKeyRelatedField(
        queryset=Designation.objects.all(), required=False, allow_null=True
    )
    dateOfBirth = serializers.DateField(required=False, allow_null=True)
    joiningDate = serializers.DateField(required=False, allow_null=True)
    probationPeriod = serializers.DateField(required=False, allow_null=True)
    slackUsername = serializers.CharField(required=False, allow_null=True)
    exitDate = serializers.DateField(required=False, allow_null=True)
    gender = serializers.CharField(required=False, allow_null=True)
    address = serializers.CharField(required=False, allow_null=True)
    skills = serializers.CharField(required=False, allow_null=True)
    mobile = serializers.CharField(required=False, allow_null=True)
    hourlyRate = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    logIn = serializers.CharField(required=False, allow_null=True)
    emailNotifications = serializers.CharField(required=False, allow_null=True)
    reportTo = serializers.CharField(required=False, allow_null=True)
    profilePicture = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            "id", "username", "email", "first_name", "department", "designation",
            "dateOfBirth", "joiningDate", "probationPeriod", "slackUsername", "exitDate",
            "gender", "address", "skills", "mobile", "hourlyRate", "logIn",
            "emailNotifications", "reportTo", "profilePicture",
        ]

    def update(self, instance, validated_data):
        # Update User fields
        instance.username = validated_data.get("username", instance.username)
        instance.email = validated_data.get("email", instance.email)
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.save()

        # Update Profile fields
        profile = instance.profile
        profile_data = {
            key: validated_data.pop(key)
            for key in list(validated_data.keys())
            if hasattr(profile, key)
        }
        if 'profilePicture' in validated_data:
            profile.profilePicture = validated_data.pop('profilePicture')
        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        profile.save()

        return instance