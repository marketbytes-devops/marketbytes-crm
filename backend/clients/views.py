from rest_framework import viewsets
from .models import Client
from .serializers import ClientSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
import random
import string


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

@api_view(['GET'])
def generate_password(request):
    # Generate a 12-character random password
    password = ''.join(random.choices(
        string.ascii_letters + string.digits + '!@#$%^&*()', k=12
    ))
    return Response({"password": password})