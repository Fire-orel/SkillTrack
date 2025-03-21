from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated,IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from .models import (
    CustomUser, Edu, Sphere, Hashtag, Profi, Certificate, Skill,
    ProfiCompet, Competence, Works, Achievements,Links
)
from .serializers import (
    CustomUserSerializer, EduSerializer, SphereSerializer, HashtagSerializer, ProfiSerializer,
    CertificateSerializer, SkillSerializer, ProfiCompetSerializer, CompetenceSerializer,
    WorksSerializer, AchievementsSerializer
)

# 🔹 API для списка пользователей (GET, POST)
class CustomUserListView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        users = CustomUser.objects.all()
        serializer = CustomUserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🔹 API для одного пользователя (GET, DELETE)
class CustomUserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        user = get_object_or_404(CustomUser, pk=pk)
        serializer = CustomUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):  # 🔥 Добавляем обновление данных
        user = get_object_or_404(CustomUser, pk=pk)
        serializer = CustomUserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        user = get_object_or_404(CustomUser, pk=pk)
        user.delete()
        return Response({"message": "Пользователь удалён."}, status=status.HTTP_204_NO_CONTENT)

# 🔹 Edu API
class EduView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        edu_entries = Edu.objects.all()
        serializer = EduSerializer(edu_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = EduSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        edu = get_object_or_404(Edu, pk=pk)
        edu.delete()
        return Response({"message": "Образование удалено."}, status=status.HTTP_204_NO_CONTENT)


# 🔹 Sphere API
class SphereView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        spheres = Sphere.objects.all()
        serializer = SphereSerializer(spheres, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = SphereSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        sphere = get_object_or_404(Sphere, pk=pk)
        sphere.delete()
        return Response({"message": "Сфера удалена."}, status=status.HTTP_204_NO_CONTENT)


# 🔹 Hashtag API
class HashtagView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        hashtags = Hashtag.objects.all()
        serializer = HashtagSerializer(hashtags, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = HashtagSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        hashtag = get_object_or_404(Hashtag, pk=pk)
        hashtag.delete()
        return Response({"message": "Хэштег удалён."}, status=status.HTTP_204_NO_CONTENT)


# 🔹 Profi API
class ProfiView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        professions = Profi.objects.all()
        serializer = ProfiSerializer(professions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ProfiSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        profession = get_object_or_404(Profi, pk=pk)
        profession.delete()
        return Response({"message": "Профессия удалена."}, status=status.HTTP_204_NO_CONTENT)




class CertificateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        certificates = Certificate.objects.all()
        serializer = CertificateSerializer(certificates, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CertificateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        if pk is None:
            return Response({"error": "ID сертификата не передан"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            certificate = Certificate.objects.get(pk=pk, user=request.user)
        except Certificate.DoesNotExist:
            return Response({"error": "Сертификат не найден"}, status=status.HTTP_404_NOT_FOUND)

        certificate.delete()
        return Response({"message": "Сертификат удалён"}, status=status.HTTP_204_NO_CONTENT)

class AchievementsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        achievements = Achievements.objects.all()
        serializer = AchievementsSerializer(achievements, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = AchievementsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class WorksView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        works = Works.objects.all()
        serializer = WorksSerializer(works, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = WorksSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class LinksView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        links = Links.objects.filter(user=request.user)
        data = [{"id": link.id, "url": link.url} for link in links]
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        url = request.data.get("url")
        if not url:
            return Response({"error": "URL не указан"}, status=status.HTTP_400_BAD_REQUEST)

        link, created = Links.objects.get_or_create(user=request.user, url=url)
        if not created:
            return Response({"error": "Такая ссылка уже существует"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"id": link.id, "url": link.url}, status=status.HTTP_201_CREATED)

    def delete(self, request, pk):
        link = get_object_or_404(Links, id=pk, user=request.user)
        link.delete()
        return Response({"message": "Ссылка удалена"}, status=status.HTTP_204_NO_CONTENT)
