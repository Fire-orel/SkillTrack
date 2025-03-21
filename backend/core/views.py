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

from gigachat import GigaChat
import ast

import requests
from bs4 import BeautifulSoup
from django.http import JsonResponse
from django.views import View


GIGACHAT_API_KEY = "MWNiMjM5YTgtNzViMS00MWRhLTgwNGUtZTY3NWE5YjY2YzkzOjljZWZiNWUwLWIzOTQtNDFiNy04M2Q2LTc0OWVhMmFlNjE3MQ=="

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
        request.data["user"] = request.user.id
        serializer = WorksSerializer(data=request.data)
        print(request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, work_id):
        try:
            work = Works.objects.get(id=work_id, user=request.user)  # Удаляем только записи текущего пользователя
            work.delete()
            return Response({"message": "Опыт работы удалён"}, status=status.HTTP_204_NO_CONTENT)
        except Works.DoesNotExist:
            return Response({"error": "Опыт работы не найден"}, status=status.HTTP_404_NOT_FOUND)


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



class SkillView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        skills = Skill.objects.filter(user=request.user)
        serializer = SkillSerializer(skills, many=True)
        return Response(serializer.data)

    def post(self, request):
        request.data["user"] = request.user.id  # Привязываем навык к текущему пользователю
        serializer = SkillSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk=None):
        if pk is None:
            return Response({"error": "ID навыка не передан"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            skill = Skill.objects.get(pk=pk, user=request.user)
        except Skill.DoesNotExist:
            return Response({"error": "Навык не найден"}, status=status.HTTP_404_NOT_FOUND)

        serializer = SkillSerializer(skill, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        if pk is None:
            return Response({"error": "ID навыка не передан"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            skill = Skill.objects.get(pk=pk, user=request.user)
        except Skill.DoesNotExist:
            return Response({"error": "Навык не найден"}, status=status.HTTP_404_NOT_FOUND)

        skill.delete()
        return Response({"message": "Навык удалён"}, status=status.HTTP_204_NO_CONTENT)



class CareerRecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        skills = Skill.objects.filter(user=request.user)
        if not skills:
            return Response({"error": "Нет данных о навыках пользователя"}, status=status.HTTP_400_BAD_REQUEST)

        formatted_skills = ", ".join([f"{skill.title}: {skill.level}" for skill in skills])
        prompt = (
            f"Пользователь обладает следующими навыками: {formatted_skills}. "
            "На основе этих навыков предложи список направлений карьеры, "
            "которые лучше всего подходят пользователю. "
            "Для каждого направления укажи, насколько пользователь готов к этому направлению "
            "в процентном соотношении (например, 'FullStack-разработчик': 80%). "
            "Выведи данные строго в формате JSON, например: "
            "[{\"career\": \"FullStack-разработчик\", \"readiness\": 80}, "
            "{\"career\": \"Бизнес-аналитик\", \"readiness\": 65}]. "
            "Не добавляй никакой лишней информации, описаний или пояснений."
        )

        try:
            with GigaChat(credentials=GIGACHAT_API_KEY, verify_ssl_certs=False) as giga:
                response = giga.chat(prompt)
                career_paths = response.choices[0].message.content

                # Преобразуем строку в список, если нужно
                try:
                    career_paths = ast.literal_eval(career_paths) if isinstance(career_paths, str) else career_paths
                except (ValueError, SyntaxError):
                    return Response({"error": "GigaChat вернул некорректный формат данных"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                return Response({"career_paths": career_paths})
        except Exception as e:
            return Response({"error": "Ошибка при обращении к GigaChat", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




class SberParserView(View):
    def get(self, request, *args, **kwargs):
        url = 'https://developers.sber.ru/help'
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        urls_list = []

        articles = soup.find_all('div', class_='Cell-sc-22bce6e3-0 gPJwHF')

        for article in articles:
            link_tag = article.find('a', href=True)
            if link_tag:
                urls_list.append(f"https://developers.sber.ru{link_tag['href']}")

        parsed_articles = []

        for article_url in urls_list:
            response = requests.get(article_url)
            soup = BeautifulSoup(response.text, 'html.parser')
            articles = soup.find_all('div', class_='Cell-sc-c2899c52-0 cmQkJU')

            for article in articles:
                title_tag = article.find('div', class_='plasma-new-hope__sc-1xug4g9-0 cQUwqC typography-bold typo__BodyL-sc-45e1da05-17 fRTVYY')
                first_paragraph_tag = article.find('div', class_='plasma-new-hope__sc-1xug4g9-0 hQTHVb typo__BodyM-sc-45e1da05-18 ShhxH')
                link_tag = article.find('a', href=True)

                title_text = title_tag.text.strip() if title_tag else ""
                first_paragraph_text = first_paragraph_tag.text.strip() if first_paragraph_tag else ""
                full_article_url = f"https://developers.sber.ru{link_tag['href']}" if link_tag else ""

                parsed_articles.append({
                    "title": title_text,
                    "first_paragraph": first_paragraph_text,
                    "url": full_article_url
                })



        return JsonResponse({"articles": parsed_articles}, json_dumps_params={'ensure_ascii': False}, safe=False)





import requests
import json
from django.http import JsonResponse
from django.views import View
import time

USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'

class HHVacancyParserView(View):
    def get(self, request, *args, **kwargs):
        search_text = request.GET.get("text", "программист 1С")
        required_experience = request.GET.get("experience", "between1And3")
        max_vacancies = int(request.GET.get("limit", 20))

        def search_vacancies(text, experience, page=0):
            url = 'https://api.hh.ru/vacancies'
            params = {
                'text': text,
                'experience': experience,
                'page': page,
                'per_page': 100,
            }
            headers = {'User-Agent': USER_AGENT}

            try:
                response = requests.get(url, params=params, headers=headers)
                response.raise_for_status()
                data = response.json()
                return data.get('items', [])
            except:
                return []

        def get_vacancy_details(vacancy_id):
            url = f'https://api.hh.ru/vacancies/{vacancy_id}'
            headers = {'User-Agent': USER_AGENT}
            try:
                response = requests.get(url, headers=headers)
                response.raise_for_status()
                return response.json()
            except:
                return {}

        all_vacancies = []
        page = 0
        while True:
            vacancies = search_vacancies(search_text, required_experience, page)
            if not vacancies:
                break

            all_vacancies.extend(vacancies)
            page += 1
            time.sleep(0.25)

            if len(all_vacancies) >= max_vacancies:
                break

        results = []
        for vacancy in all_vacancies[:max_vacancies]:
            details = get_vacancy_details(vacancy['id'])
            if details:
                results.append({
                    "title": details.get("name"),
                    "url": details.get("alternate_url"),
                    "employer": details.get("employer", {}).get("name"),
                    "description": details.get("description")
                })

        return JsonResponse({"vacancies": results}, json_dumps_params={'ensure_ascii': False}, safe=False)
