deploy: deploy-api deploy-web
	docker-compose down
	docker-compose up -d
	yes | docker image prune --filter="dangling=true"

deploy-api:
	DOCKER_BUILDKIT=1 docker build -t ocr-api api/

deploy-web:
	cd web && npm run build && npm run export
	docker build -t ocr-web web/

dev:
	FLASK_APP=api/main.py flask run --host=0.0.0.0
