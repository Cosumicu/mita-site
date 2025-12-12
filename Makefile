build:
	docker compose up --build -d --remove-orphans

up:
	docker compose up -d

down:
	docker compose down

build-prod:
	docker compose -f docker-compose.prod.yml up --build -d --remove-orphans

down-prod:
	docker compose -f docker-compose.prod.yml down