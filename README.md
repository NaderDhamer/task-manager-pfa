**Task Management Microservices**

**Overview:**
- **What:** Small microservices example (users, tasks, UI) built with Node.js and PostgreSQL, runnable locally with `docker-compose`.
- **Purpose:** Development playground and starting point for cloud-native deployment (EKS + Terraform).

**Services:**
- **user-service:** HTTP API for user CRUD — port 3001.
- **task-service:** HTTP API for task CRUD — port 3002.
- **ui:** React-like single-page UI served by a small Node server — port 3000.
- **postgres-users/postgres-tasks:** Two Postgres containers for usersdb and tasksdb.

See service code: [user-service](user-service/index.js), [task-service](task-service/index.js), [ui](ui/index.js).

**Run locally (docker-compose)**
1. Build and start services:

```bash
docker compose up --build
```

2. Access the UI: http://localhost:3000

3. API endpoints:
- Users: http://localhost:3001/users
- Tasks: http://localhost:3002/tasks

**What I'll generate next (Terraform EKS starter scaffold)**
The scaffold will be tuned for a Learner Lab environment and will include:
- VPC (minimal subnets) and networking primitives
- EKS cluster (managed) with one small nodegroup (on-demand or Fargate option)
- ECR repositories for images
- AWS Load Balancer Controller (ALB) integration for Ingress
- IAM roles and IRSA bindings for pods that need AWS API access
- cert-manager guidance / ACM notes (ACM is preferred for production TLS)

Notes and constraints for Learner Lab:
- Use a single AZ or small instance sizes to keep costs low.
- Prefer S3 + CloudFront for the React static assets (cheapest and fastest). If you containerize the UI, Ingress will route to the UI pod.
- Prefer managed services for production-grade databases (MongoDB Atlas, DocumentDB, or RDS). The local Postgres containers are for development only.

**Quick Terraform / EKS workflow (high level)**

1. Create ECR repo and push images (CI will automate this):

```bash
# build and tag
docker build -t <account>.dkr.ecr.<region>.amazonaws.com/task-service:latest ./task-service
docker push <account>.dkr.ecr.<region>.amazonaws.com/task-service:latest
```

2. Apply Terraform to create infra (VPC, EKS, IAM, ECR):

```bash
terraform init
terraform apply
```

3. Deploy apps via Helm / kubectl (or use GitOps with ArgoCD/Flux):

```bash
# example using kubectl + kustomize/helm
kubectl apply -f k8s/
```

**Next steps I can do for you:**
- Generate the Terraform EKS starter scaffold (VPC, EKS, ALB controller, IAM roles, ECR) tuned for Learner Lab limits.
- Produce Helm charts / ArgoCD `Application` manifests for the microservices and observability stack (Prometheus/Grafana).

If you want the scaffold now, tell me whether you prefer: (A) minimal single-AZ setup (lowest cost, for learning), or (B) multi-AZ production-like setup (higher cost).

