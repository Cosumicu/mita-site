FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONOTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
     gettext \
     build-essential \
     python3-dev \
     libblas-dev \
     liblapack-dev \
     gfortran \
  && rm -rf /var/lib/apt/lists/*

COPY ./requirements.txt .

RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .

COPY ./docker/local/django/entrypoint /entrypoint
RUN sed -i 's/\r$//g' /entrypoint
RUN chmod +x /entrypoint

COPY ./docker/local/django/start /start
RUN sed -i 's/\r$//g' /start
RUN chmod +x /start

COPY ./docker/local/django/celery/worker/start /start-celeryworker
RUN sed -i 's/\r$//g' /start-celeryworker
RUN chmod +x /start-celeryworker

COPY ./docker/local/django/celery/beat/start /start-celerybeat
RUN sed -i 's/\r$//g' /start-celerybeat
RUN chmod +x /start-celerybeat

COPY ./docker/local/django/celery/flower/start /start-flower
RUN sed -i 's/\r$//g' /start-flower
RUN chmod +x /start-flower

ENTRYPOINT [ "/entrypoint"]