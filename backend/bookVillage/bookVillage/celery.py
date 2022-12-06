import os

from celery import Celery, shared_task

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "bookVillage.settings")

app = Celery(
    "bookVillage",
    broker="redis://redis_storage:6379",
    backend="redis://redis_storage:6379",
    include=["user.tasks"],
)

# -namespace='CELERY' 의 의미는 셀러리와 관련된 모든 설정은 CELERY_ 라는 prefix로 시작함을 의미
app.config_from_object("django.conf:settings", namespace="CELERY")

# Django 에 등록된 모든 task 모듈을 로드합니다.
app.autodiscover_tasks()


app.conf.update(
    result_expires=3600,
)

if __name__ == "__main__":
    app.start()
