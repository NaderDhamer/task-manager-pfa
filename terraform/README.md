# Terraform Starter for AWS EKS with EC2 Nodes (Learner Lab Edition)

This directory contains a Terraform scaffold for AWS EKS with EC2 worker nodes on Learner Lab.

## Included resources

- **EKS cluster** (uses existing `LabEksClusterRole`)
- **EC2 node group** (1-2 nodes, uses existing `LabEksNodeRole`)
- **ECR repositories** for `task-service`, `user-service`, and `ui-service`
- **Auto-detects default VPC and subnets** from your AWS account

## Quick Start

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

Cluster creation takes 10-15 minutes.

## After Deployment

1. Update kubeconfig:

```bash
aws eks update-kubeconfig --region us-east-1 --name task-mgmt-eks
kubectl get nodes
```

2. Push Docker images to ECR:

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

docker build -t task-service:latest ./task-service
docker tag task-service:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/task-service:latest
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/task-service:latest
```

3. Deploy Kubernetes manifests to the cluster (see `../k8s/` directory)

## Variables

Customize with:

```bash
terraform apply \
  -var="cluster_name=my-cluster" \
  -var="cluster_version=1.29" \
  -var="node_instance_type=t3.medium" \
  -var="node_desired_capacity=2"
```

