build-dev:
	docker compose up --build -d --remove-orphans

down-dev:
	docker compose down

build-prod:
	docker compose -f docker-compose.prod.yml up --build -d --remove-orphans

down-prod:
	docker compose -f docker-compose.prod.yml down