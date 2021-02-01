## Setup Steps

-   Code

    1.  Deploy DynamoDB tables
        a. VersionInfo: Partition Key: env (String), Sort Key: appId (String)
        b. ApplicationInfo: Partition Key: id (String)
        c. InstanceInfo: Partition Key: env (String), Sort Key: appId (String)
    2.  Deploy lambda: Pyhton 3.7
    3.  Create API Gateway and add trigger to lambda (require ApiKey)
    4.  Create ACM certificate
    5.  Link ACM certificate to API Gateway Custom Domain
    6.  Add Route53 DNS entries for the Custom Domain host

-   Infrastructure

1.  Create private AWS ECR repository, called 'cloudhawk'
2.  Create AWS ECS Cluster, called CloudHawk-Cluster
3.  Create AWS ECS Task Definition, called cloudhawk-task, use Fargate type (Networking only)

-   Create AWS ECS Task Definition -> container, called cloudhawk-container (0.5 vCPU, 2 GB RAM, TCP port 3006)
-   Health Check Command: CMD-SHELL curl -f http://localhost:3006 || exit 1
-   Interval: 40, Timeout: 20, Start Period: 20, Retries: 3

-   Create AWS ECS Service (under Cluster): Type: Fargate, Platform Version: latest, # Tasks: 2, Name: cloudhawk-service, Deployment type: Rolling
-   Make sure Security Group allows inbound port 3006
-   Configure ALB with listener port: 80, health port: 3006 (target group)

-   Create AWS ECS Service (under Cluster): Type: Fargate, Platform Version: latest, # Tasks: 2, Name: cloudhawk-service, Deployment type: Rolling
-   Make sure Security Group allows inbound port 3006

-   Deployment Pipeline

1.  Setup AWS Code Pipeline
2.  Setup connection to GitHub
3.  Create pipeline and CodeBuild stages, auto-deploy with ECS
