variable "region" {
  description = "AWS region for the EKS cluster."
  type        = string
  default     = "us-east-1"
}

variable "cluster_name" {
  description = "Name of the EKS cluster."
  type        = string
  default     = "task-mgmt-eks"
}

variable "cluster_version" {
  description = "EKS Kubernetes version."
  type        = string
  default     = "1.29"
}

variable "cluster_role_arn" {
  description = "ARN of the existing EKS cluster role."
  type        = string
  default     = "arn:aws:iam::636449817691:role/c205024a5229197l15172502t1w636449-LabEksClusterRole-wGmEwOB2Os7v"
}

variable "node_role_arn" {
  description = "ARN of the existing EKS node role."
  type        = string
  default     = "arn:aws:iam::636449817691:role/c205024a5229197l15172502t1w636449817-LabEksNodeRole-0YXwIbrXWgaC"
}

variable "node_instance_type" {
  description = "EC2 instance type for worker nodes."
  type        = string
  default     = "t3.small"
}

variable "node_desired_capacity" {
  description = "Desired number of worker nodes."
  type        = number
  default     = 1
}

variable "node_min_capacity" {
  description = "Minimum number of worker nodes."
  type        = number
  default     = 1
}

variable "node_max_capacity" {
  description = "Maximum number of worker nodes."
  type        = number
  default     = 2
}
