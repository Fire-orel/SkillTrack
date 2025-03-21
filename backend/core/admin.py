from django.contrib import admin
from .models import CustomUser,Certificate,Achievements,Edu,Skill

# Register your models here.

admin.site.register(CustomUser)
admin.site.register(Certificate)
admin.site.register(Achievements)
admin.site.register(Edu)
admin.site.register(Skill)
