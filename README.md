## Setup Steps

-   Deploy DynamoDB tables
-   Deploy lambda
-   Create API Gateway and add trigger to lambda (require ApiKey)
-   Create ACM certificate
-   Link ACM certificate to API Gateway Custom Domain
-   Add Route53 DNS entries

-   Create private AWS ECR repository, called 'cloudhawk'
-   Create AWS ECS Cluster, called CloudHawk-Cluster
-   Create AWS ECS Task Definition, called cloudhawk-task, use Fargate type (Networking only)

*   Create AWS ECS Task Definition -> container, called cloudhawk-container (0.5 vCPU, 2 GB RAM, TCP port 3006)
*   Health Check Command: CMD-SHELL curl -f http://localhost:3006 || exit 1
*   Interval: 40, Timeout: 20, Start Period: 20, Retries: 3

-   Create AWS ECS Service (under Cluster): Type: Fargate, Platform Version: latest, # Tasks: 2, Name: cloudhawk-service, Deployment type: Rolling
-   Make sure Security Group allows inbound port 3006

-   Configure ALB with listener port: 80, health port: 3006 (target group)

*   Create AWS ECS Service (under Cluster): Type: Fargate, Platform Version: latest, # Tasks: 2, Name: cloudhawk-service, Deployment type: Rolling
*   Make sure Security Group allows inbound port 3006

*   Setup AWS Code Pipeline
*   Setup connection to GitHub
*   Create pipeline and CodeBuild stages, auto-deploy with ECS
