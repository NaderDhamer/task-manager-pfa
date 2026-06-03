output "cluster_name" {
  description = "EKS cluster name."
  value       = aws_eks_cluster.cluster.name
}

output "cluster_endpoint" {
  description = "EKS cluster endpoint."
  value       = aws_eks_cluster.cluster.endpoint
}

output "cluster_certificate_authority_data" {
  description = "Cluster CA certificate data for kubeconfig."
  value       = aws_eks_cluster.cluster.certificate_authority[0].data
}

output "ecr_task_service" {
  description = "ECR repository URI for task-service image."
  value       = aws_ecr_repository.task_service.repository_url
}

output "ecr_user_service" {
  description = "ECR repository URI for user-service image."
  value       = aws_ecr_repository.user_service.repository_url
}

output "ecr_ui_service" {
  description = "ECR repository URI for ui-service image."
  value       = aws_ecr_repository.ui_service.repository_url
}
