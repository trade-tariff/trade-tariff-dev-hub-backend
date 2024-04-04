data "aws_vpc" "vpc" {
  tags = { Name = "trade-tariff-${var.environment}-vpc" }
}

data "aws_subnets" "private" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.vpc.id]
  }

  tags = {
    Name = "*private*"
  }
}

data "aws_lb_target_group" "this" {
  name = "hub-backend"
}

data "aws_security_group" "this" {
  name = "trade-tariff-ecs-security-group-${var.environment}"
}

data "aws_kms_key" "secretsmanager_key" {
  key_id = "alias/secretsmanager-key"
}

data "aws_ssm_parameter" "ecr_url" {
  name = "/${var.environment}/FPO_DEVELOPER_HUB_BACKEND_ECR_URL"
}

data "aws_dynamodb_table" "customer_api_keys" {
  name = "CustomerApiKeys"
}

data "aws_secretsmanager_secret" "encryption_key" {
  name = "dev-hub-backend-encryption-key"
}

data "aws_secretsmanager_secret" "usage_plan_id" {
  name = "dev-hub-backend-usage-plan-id"
}
