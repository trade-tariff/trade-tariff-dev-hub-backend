.PHONY: default build run clean

IMAGE_NAME := trade-tariff-dev-hub-backend
SHELL := /usr/bin/env bash

run: clean build
	source .env.development && yarn run start

test:
	yarn run test

localstack: clean-localstack
	$(eval USAGE_PLAN_ID=$(shell docker-compose up | grep -m1 'usagePlanId=' | awk -F'=' '{print $$2}'))
	@if [ -z "$(USAGE_PLAN_ID)" ]; then \
		echo "Failed to extract USAGE_PLAN_ID"; \
		exit 1; \
	fi
	@sed -i'' -e 's/export USAGE_PLAN_ID=.*/export USAGE_PLAN_ID=$(USAGE_PLAN_ID)/' .env.development
	@echo "Updated USAGE_PLAN_ID in .env.development to $(USAGE_PLAN_ID)"
	@echo "Localstack is running. Run make stop-localstack to stop it."

clean-localstack: stop-localstack
	docker-compose rm -f -s -v

stop-localstack:
	docker-compose down

clean:
	yarn run clean

source:
	source .env.development

build:
	yarn run build

docker-configure:
	cp .env.development .env.development.local
	sed -i'' -e 's/^export //' .env.development.local

docker-build:
	docker build -t $(IMAGE_NAME) .

docker-run: docker-configure
	docker run \
		--network=host \
		--rm \
		--name $(IMAGE_NAME) \
		-e DEBUG=express:* \
		-e NODE_ENV=test \
		--env-file .env.development.local \
		-it \
		$(IMAGE_NAME) \

docker-clean:
	docker rmi $(IMAGE_NAME)
	rm .env.development.local

docker-shell:
	docker run \
		--rm \
		--name $(IMAGE_NAME)-shell \
		--no-healthcheck \
		-it $(IMAGE_NAME) /bin/sh
