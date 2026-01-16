from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager
import secrets
import string
import uuid

class CustomUserManager(UserManager):
    def _generate_username(self) -> str:
        alphabet = string.ascii_lowercase + string.digits
        rand = "".join(secrets.choice(alphabet) for _ in range(12))
        return f"user_{rand}"

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("User must provide an e-mail address")
        email = self.normalize_email(email)

        if not extra_fields.get("username"):
            for _ in range(20):
                candidate = self._generate_username()
                if not self.model.objects.filter(username=candidate).exists():
                    extra_fields["username"] = candidate
                    break
            else:
                raise ValueError("Could not generate a unique username")

        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password, **extra_fields):
        extra_fields.setdefault("is_superuser", False)
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_active", True)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")

        return self._create_user(email, password, **extra_fields)



class User(AbstractBaseUser, PermissionsMixin):
    pkid = models.BigAutoField(primary_key=True, editable=False)
    id = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False
    )
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True, blank=True)

    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(blank=True, null=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = CustomUserManager()

    def __str__(self):
        return self.username or self.email

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.email