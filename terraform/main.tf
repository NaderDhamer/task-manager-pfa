# Get default VPC
data "aws_vpc" "default" {
  default = true
}

# Get all default subnets
data "aws_subnets" "all_default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# Filter subnets for supported availability zones
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
  filter {
    name   = "availability-zone"
    values = ["us-east-1a", "us-east-1b", "us-east-1c", "us-east-1d", "us-east-1f"]
  }
}

# EKS Cluster using existing cluster role
resource "aws_eks_cluster" "cluster" {
  name     = var.cluster_name
  version  = var.cluster_version
  role_arn = var.cluster_role_arn

  vpc_config {
    subnet_ids = slice(data.aws_subnets.default.ids, 0, 2)
  }
}

# EKS Node Group using existing node role
resource "aws_eks_node_group" "nodes" {
  cluster_name    = aws_eks_cluster.cluster.name
  node_group_name = "${var.cluster_name}-nodes"
  node_role_arn   = var.node_role_arn
  subnet_ids      = slice(data.aws_subnets.default.ids, 0, 2)

  scaling_config {
    desired_size = var.node_desired_capacity
    max_size     = var.node_max_capacity
    min_size     = var.node_min_capacity
  }

  ami_type      = "AL2_x86_64"
  instance_types = [var.node_instance_type]
  capacity_type  = "ON_DEMAND"
}

# ECR Repositories
resource "aws_ecr_repository" "task_service" {
  name = "task-service"
}

resource "aws_ecr_repository" "user_service" {
  name = "user-service"
}

resource "aws_ecr_repository" "ui_service" {
  name = "ui-service"
}
