from rest_framework import serializers
from .models import (
    CustomUser, Edu, Sphere, Hashtag, Profi, Certificate, Skill,
    ProfiCompet, Competence, Works, Achievements
)

class EduSerializer(serializers.ModelSerializer):
    class Meta:
        model = Edu
        fields = ["id", "num", "degree", "year_beginning",'year_ending', "university",'program','user']

class CustomUserSerializer(serializers.ModelSerializer):
    education = EduSerializer(many=True, read_only=True)  # Вложенный сериализатор

    class Meta:
        model = CustomUser
        fields = ["id", "surname", "name", "patronimyc", "birthdate", "phone", "education","category",'city']


class SphereSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sphere
        fields = ["id", "title"]


class HashtagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hashtag
        fields = ["id", "title"]


class ProfiSerializer(serializers.ModelSerializer):
    sphere = SphereSerializer(read_only=True)
    hashtag = HashtagSerializer(read_only=True)

    class Meta:
        model = Profi
        fields = ["id", "title", "sphere", "hashtag"]


class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = ["id", "user",'file']


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "title", "level","user"]


class ProfiCompetSerializer(serializers.ModelSerializer):
    hashtag = HashtagSerializer(read_only=True)
    skill = SkillSerializer(read_only=True)

    class Meta:
        model = ProfiCompet
        fields = ["id", "hashtag", "skill"]


class CompetenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competence
        fields = ["id", "title"]


class WorksSerializer(serializers.ModelSerializer):
    profi = ProfiSerializer(read_only=True)

    class Meta:
        model = Works
        fields = ["id", "place", "profi", "date_start", "date_end"]


class AchievementsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievements
        fields = ["id", "user","file"]


# class UserAchievementSerializer(serializers.ModelSerializer):
#     user = serializers.PrimaryKeyRelatedField(read_only=True)

#     class Meta:
#         model = UserAchievement
#         fields = ["id", "user"]
