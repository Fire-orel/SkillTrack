from django.contrib import admin
from .models import CustomUser,Certificate,Achievements

# Register your models here.

admin.site.register(CustomUser)
admin.site.register(Certificate)
admin.site.register(Achievements)
