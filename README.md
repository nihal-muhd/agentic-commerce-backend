# Agentic Commerce Backend

A production-style distributed backend for an e-commerce platform with microservices, event-driven communication, AI-powered incident investigation, RAG, observability, and AWS deployment.

The backend combines NestJS services for application workloads with a FastAPI-based AI agent service.

## Tech Stack

<p>
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-DD0031?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonwebservices&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" />
</p>

## Services

* API Gateway / BFF
* Authentication Service
* Catalog Service
* Order Service
* Payment Service
* AI Agent Service

## Features

### Authentication & Security

* Email/password authentication
* JWT access tokens
* Refresh tokens
* OAuth 2.0 / OpenID Connect
* Role-based access control
* User and Admin roles

### E-commerce Backend

* Product management
* Order management
* Simulated payment processing
* Service-owned MongoDB databases
* MongoDB indexing
* Redis caching
* Idempotent payment processing

### Event-Driven Architecture

* RabbitMQ messaging
* Order events
* Payment events
* Consumers and producers
* Message acknowledgements
* Retry handling
* Exponential backoff
* Dead-letter queues
* Duplicate-message safety

### AI Incident Response

* FastAPI AI service
* LangGraph workflows
* Tool/function calling
* Structured outputs
* Incident triage
* Log inspection
* Metrics inspection
* Deployment history inspection
* RAG-based runbook retrieval
* Agent state persistence
* Workflow checkpoints
* Human-in-the-loop approval
* Recovery verification
* Tool retries
* Model fallback
* Prompt versioning
* Agent evaluations
* Latency and token tracking

### Media

* AWS S3 storage
* Presigned uploads
* Direct browser-to-S3 uploads
* Temporary media state
* Abandoned upload cleanup
* Image replacement cleanup
* CloudFront CDN delivery

### Observability

* OpenTelemetry
* Distributed tracing
* Logs
* Metrics
* Trace propagation
* SigNoz
* AWS CloudWatch

### Infrastructure & Deployment

* Docker
* Docker Compose
* AWS ECR
* AWS ECS
* GitHub Actions
* CI/CD
* Health checks
* Environment-based configuration
