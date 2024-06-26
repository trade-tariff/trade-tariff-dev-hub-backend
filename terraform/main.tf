module "service" {
  source = "git@github.com:trade-tariff/trade-tariff-platform-terraform-modules.git//aws/ecs-service?ref=aws/ecs-service-v1.12.0"

  region = var.region

  service_name  = local.service
  service_count = var.service_count

  private_dns_namespace = "tariff.internal"

  cluster_name              = "trade-tariff-cluster-${var.environment}"
  subnet_ids                = data.aws_subnets.private.ids
  security_groups           = [data.aws_security_group.this.id]
  target_group_arn          = data.aws_lb_target_group.this.arn
  cloudwatch_log_group_name = "platform-logs-${var.environment}"

  min_capacity = var.min_capacity
  max_capacity = var.max_capacity

  docker_image = data.aws_ssm_parameter.ecr_url.value
  docker_tag   = var.docker_tag
  skip_destroy = true

  container_port = 8080

  cpu    = var.cpu
  memory = var.memory

  task_role_policy_arns = [
    aws_iam_policy.task.arn
  ]

  execution_role_policy_arns = [
    aws_iam_policy.exec.arn
  ]

  enable_ecs_exec = true

  service_environment_config = [
    {
      name  = "PORT"
      value = "8080"
    },
    {
      name  = "GOVUK_APP_DOMAIN"
      value = "hub.${var.base_domain}"
    },
    {
      name  = "SENTRY_ENVIRONMENT"
      value = var.environment
    },
    {
      name  = "AUDIT_TABLE_NAME"
      value = data.aws_dynamodb_table.audit_log.name
    },
    {
      name  = "CUSTOMER_API_KEYS_TABLE_NAME"
      value = data.aws_dynamodb_table.customer_api_keys.name
    },
    {
      name  = "USERS_TABLE_NAME"
      value = data.aws_dynamodb_table.users.name
    },
    {
      name  = "ORGANISATIONS_TABLE_NAME"
      value = data.aws_dynamodb_table.organisations.name
    },
    {
      name  = "COGNITO_PUBLIC_KEYS_URL"
      value = data.aws_ssm_parameter.cognito_public_keys_url.value
    },
    {
      name  = "USAGE_PLAN_PER_FPO_RATE_LIMIT"
      value = 100
    },
    {
      name  = "USAGE_PLAN_LIST_PAGINATION_LIMIT"
      value = 100
    },
    {
      name  = "REST_API_ID"
      value = var.rest_api_id
    },
    {
      name  = "REST_STAGE_NAME"
      value = var.environment
    }
  ]

  service_secrets_config = [
    {
      name      = "ENCRYPTION_KEY"
      valueFrom = data.aws_secretsmanager_secret.encryption_key.arn
    },
    {
      name      = "SENTRY_DSN"
      valueFrom = data.aws_secretsmanager_secret.sentry_dsn.arn
    },
  ]
}
