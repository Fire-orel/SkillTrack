from django.db import models
from django.contrib.auth.models import User, AbstractUser

class CustomUser(AbstractUser):
    surname = models.CharField(max_length=35,blank=True, null=True)
    name = models.CharField(max_length=35,blank=True, null=True)
    patronimyc = models.CharField(max_length=35,blank=True, null=True)
    birthdate = models.DateField(blank=True, null=True)
    phone = models.CharField(max_length=12, unique=True,blank=True, null=True)

    # def __str__(self):
    #     return f""

class Edu(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="education_entries")
    num = models.CharField(max_length=30)
    degree = models.CharField(max_length=15)
    year = models.DateField()
    university = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.university} ({self.degree})"


class Sphere(models.Model):

    title = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.title


class Hashtag(models.Model):

    title = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.title


class Profi(models.Model):

    sphere = models.ForeignKey(Sphere, on_delete=models.CASCADE, related_name="professions")
    title = models.CharField(max_length=50)
    hashtag = models.ForeignKey(Hashtag, on_delete=models.CASCADE, related_name="professions", blank=True, null=True)

    def __str__(self):
        return self.title


class Certificate(models.Model):

    link = models.URLField(max_length=300)

    def __str__(self):
        return self.link


class Skill(models.Model):

    title = models.CharField(max_length=30, unique=True)
    level = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self):
        return f"{self.title} ({self.level})"


class ProfiCompet(models.Model):

    hashtag = models.ForeignKey(Hashtag, on_delete=models.CASCADE, related_name="competencies")
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name="competencies")

    def __str__(self):
        return f"{self.hashtag.title} - {self.skill.title}"


class Competence(models.Model):

    title = models.CharField(max_length=5, unique=True)

    def __str__(self):
        return self.title


class Works(models.Model):

    place = models.CharField(max_length=100)
    profi = models.ForeignKey(Profi, on_delete=models.CASCADE, related_name="work_experiences")
    date_start = models.DateField()
    date_end = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.place} ({self.profi.title})"


class Achievements(models.Model):

    link = models.URLField(max_length=300)

    def __str__(self):
        return self.link


class UserAchievement(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="achievements")

    def __str__(self):
        return f"Achievement for {self.user.surname} {self.user.name}"
