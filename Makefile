.PHONY: default build run clean

run: clean build
	yarn run start

test:
	yarn run test

localstack: clean-localstack
	$(eval USAGE_PLAN_ID=$(shell docker-compose up | grep -m1 -oP 'usagePlanId=\K\w+'))
	@if [ -z "$(USAGE_PLAN_ID)" ]; then \
		echo "Failed to extract USAGE_PLAN_ID"; \
		exit 1; \
	fi
	@sed -i 's/export USAGE_PLAN_ID=.*/export USAGE_PLAN_ID=$(USAGE_PLAN_ID)/' .env.development
	@echo "Updated USAGE_PLAN_ID in .env.development to $(USAGE_PLAN_ID)"
	@echo "Localstack is running. Run make stop-localstack to stop it."

clean-localstack: stop-localstack
	docker-compose rm -f -s -v

stop-localstack:
	docker-compose down

clean:
	yarn run clean

build:
	yarn run build
