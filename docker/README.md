# Docker Local Environment Reference

This file explains the Docker setup used in the `ecommerce-ai-local` project.

The goal is to make it easy to understand what each Docker Compose setting does and what commands to run during development.

---

## 1. Useful Commands

The project has these scripts in `package.json`:

```json
{
  "scripts": {
    "docker:up": "docker compose -f docker/docker-compose.yml up -d",
    "docker:down": "docker compose -f docker/docker-compose.yml down",
    "docker:logs": "docker compose -f docker/docker-compose.yml logs -f",
    "docker:ps": "docker compose -f docker/docker-compose.yml ps"
  }
}
```

These are npm shortcuts for Docker Compose commands.

### Start Docker services

```bash
npm run docker:up
```

This runs:

```bash
docker compose -f docker/docker-compose.yml up -d
```

Meaning:

- `docker compose` → use Docker Compose
- `-f docker/docker-compose.yml` → use this specific Compose file
- `up` → create/start the configured containers
- `-d` → run them in the background

---

### Check running services

```bash
npm run docker:ps
```

This runs:

```bash
docker compose -f docker/docker-compose.yml ps
```

Use it to check whether MongoDB, Redis, RabbitMQ, and other Docker services are running and healthy.

---

### View Docker logs

```bash
npm run docker:logs
```

This runs:

```bash
docker compose -f docker/docker-compose.yml logs -f
```

`-f` means **follow**.

The terminal continues showing new log messages as they happen.

Stop following logs with:

```text
Ctrl + C
```

This does not stop the containers.

---

### Stop Docker services

```bash
npm run docker:down
```

This runs:

```bash
docker compose -f docker/docker-compose.yml down
```

It stops and removes the containers created by this Compose project.

Normally, named volumes are **not removed**, so database data remains available.

---

## 2. Docker Compose Project Name

```yaml
name: ecommerce-ai-local
```

This gives the Docker Compose project a name.

It helps Docker group the containers, networks, and other resources belonging to this local environment.

---

# 3. MongoDB Service

Example configuration:

```yaml
services:
  mongodb:
    image: mongo:8
    container_name: ecommerce-ai-mongodb
    restart: unless-stopped

    ports:
      - '27017:27017'

    volumes:
      - mongodb-data:/data/db

    healthcheck:
      test:
        [
          'CMD-SHELL',
          'mongosh --quiet --eval "db.adminCommand(''ping'').ok" | grep 1',
        ]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 20s

    networks:
      - ecommerce-ai-network
```

---

## 4. `image`

```yaml
image: mongo:8
```

An image is the blueprint used to create a container.

This tells Docker:

> Use the MongoDB 8 image.

Docker downloads the image if it is not already available locally.

After it has been downloaded, Docker can usually start it again without internet access.

Conceptually:

```text
MongoDB Image
     ↓
MongoDB Container
```

---

## 5. `container_name`

```yaml
container_name: ecommerce-ai-mongodb
```

This gives the running container a fixed readable name.

Instead of Docker generating a name, the container appears as:

```text
ecommerce-ai-mongodb
```

You can see running containers with:

```bash
docker ps
```

---

## 6. `restart: unless-stopped`

```yaml
restart: unless-stopped
```

This tells Docker to restart the container when appropriate, unless you explicitly stopped it.

For example:

```text
PC shuts down
    ↓
Docker stops
    ↓
PC starts again
    ↓
Docker Desktop starts
    ↓
Container can automatically start again
```

If you explicitly stopped the container, Docker generally respects that.

---

# 7. Ports

```yaml
ports:
  - '27017:27017'
```

The format is:

```text
HOST_PORT:CONTAINER_PORT
```

In this case:

```text
Windows / Host      Docker Container

27017        →        27017
```

MongoDB runs inside the container on port `27017`.

Because that port is exposed to the host machine, an application running directly on Windows can connect using:

```text
mongodb://localhost:27017
```

---

## Important: `localhost` vs Docker service name

If NestJS is running directly on Windows:

```text
NestJS
  ↓
mongodb://localhost:27017
```

If NestJS is also running inside Docker on the same Docker network:

```text
NestJS container
  ↓
mongodb://mongodb:27017
```

Inside the Docker network, `mongodb` is the service hostname.

---

# 8. Volumes

MongoDB uses:

```yaml
volumes:
  - mongodb-data:/data/db
```

MongoDB normally stores its database files inside:

```text
/data/db
```

The Docker volume:

```text
mongodb-data
```

is mounted there.

Conceptually:

```text
MongoDB Container
       │
       │ writes to /data/db
       ↓
Docker Volume
mongodb-data
       ↓
Stored locally through Docker
```

The main reason for using a volume is **data persistence**.

Containers can be removed and recreated.

The volume exists separately from the container.

So:

```bash
npm run docker:down
```

followed later by:

```bash
npm run docker:up
```

should normally give MongoDB access to the same stored data.

---

## Volume is not the same as a backup

A Docker volume gives you persistent storage.

It should not be treated as a proper production backup.

For example:

```bash
docker compose down -v
```

The `-v` option removes the Compose volumes as well.

That can delete the stored database data.

Be careful with:

```text
-v
```

when working with database containers.

---

# 9. Where are Docker volumes stored?

With Docker Desktop on Windows, Docker-managed volumes are stored locally on your computer, typically inside Docker Desktop's Linux/WSL environment.

They are **not automatically stored in the cloud**.

Conceptually:

```text
Your Windows PC
└── Docker Desktop
    └── WSL / Linux environment
        └── Docker volumes
            ├── mongodb-data
            ├── redis-data
            └── rabbitmq-data
```

You can list Docker volumes with:

```bash
docker volume ls
```

---

# 10. Healthcheck

MongoDB has:

```yaml
healthcheck:
  test:
    [
      'CMD-SHELL',
      'mongosh --quiet --eval "db.adminCommand(''ping'').ok" | grep 1',
    ]

  interval: 10s
  timeout: 5s
  retries: 5
  start_period: 20s
```

A running container does not always mean the application inside it is ready.

For example:

```text
Container started
      ↓
MongoDB is still starting
      ↓
MongoDB is finally ready
```

The healthcheck lets Docker test whether MongoDB is actually responding.

This command:

```bash
mongosh --quiet --eval "db.adminCommand('ping').ok"
```

asks MongoDB to respond to a ping.

Docker then tracks the container health.

Possible states include:

```text
starting
healthy
unhealthy
```

---

## Healthcheck settings

### `interval`

```yaml
interval: 10s
```

Run the healthcheck roughly every 10 seconds.

### `timeout`

```yaml
timeout: 5s
```

If a healthcheck takes longer than 5 seconds, treat that check as failed.

### `retries`

```yaml
retries: 5
```

Allow multiple failed checks before marking the service unhealthy.

### `start_period`

```yaml
start_period: 20s
```

Give MongoDB some startup time before treating healthcheck failures seriously.

---

# 11. Docker Network

The project defines:

```yaml
networks:
  ecommerce-ai-network:
    name: ecommerce-ai-network
    driver: bridge
```

This creates a Docker network called:

```text
ecommerce-ai-network
```

---

## Why use a Docker network?

It allows containers in the project to communicate with each other.

For example:

```text
ecommerce-ai-network

├── mongodb
├── redis
├── rabbitmq
├── user-service
├── order-service
├── notification-service
└── agent-service
```

Containers on this network can communicate using service names.

Examples:

```text
mongodb:27017
redis:6379
rabbitmq:5672
```

You normally do not need to manually find container IP addresses.

---

# 12. `driver: bridge`

```yaml
driver: bridge
```

`bridge` is a standard Docker networking mode for containers running on the same Docker host.

For local development, you can think of it as:

> Create a private local network where these Docker containers can communicate.

---

# 13. Top-Level Volumes

The Compose file declares:

```yaml
volumes:
  mongodb-data:
  redis-data:
  rabbitmq-data:
```

These define Docker-managed named volumes.

Their intended use is:

```text
mongodb-data
    ↓
MongoDB persistent data

redis-data
    ↓
Redis persistent data

rabbitmq-data
    ↓
RabbitMQ persistent data
```

A service then connects to one of those volumes.

For example:

```yaml
mongodb:
  volumes:
    - mongodb-data:/data/db
```

The bottom `volumes:` section **declares** the volume.

The `mongodb.volumes:` section **mounts/uses** it.

---

# 14. Network vs Volume

A simple mental model:

```text
NETWORK
= communication between containers

VOLUME
= persistent data for containers
```

Example:

```text
                     ecommerce-ai-network

NestJS ─────────── MongoDB ─────────── FastAPI
                     │
                     │
                     ↓
               mongodb-data
                  volume
```

The network allows communication.

The volume keeps the database data.

---

# 15. Where Containers Run

For Docker Desktop on Windows:

```text
Windows PC
└── Docker Desktop
    └── Linux / WSL environment
        ├── MongoDB container
        ├── Redis container
        └── RabbitMQ container
```

These containers are running **locally on your computer**.

They are not automatically cloud servers.

---

# 16. Internet Requirement

Internet is normally required when Docker needs to download an image.

For example, the first time you run:

```bash
docker pull mongo:8
```

or:

```bash
npm run docker:up
```

Docker may download:

```text
mongo:8
```

from a container registry.

Once the required image already exists locally, Docker can generally start it again without downloading it.

Check downloaded images with:

```bash
docker images
```

---

# 17. What Happens When the PC Shuts Down?

When Windows shuts down:

```text
Windows shuts down
     ↓
Docker Desktop stops
     ↓
Docker containers stop
```

Your persistent volume data remains stored locally.

When the computer starts again, Docker Desktop can start again.

Because this project uses:

```yaml
restart: unless-stopped
```

some containers may start automatically when Docker starts.

Check them with:

```bash
npm run docker:ps
```

---

# 18. Normal Daily Development Workflow

### Start of the day

Start Docker Desktop.

Then check:

```bash
npm run docker:ps
```

If the required services are not running:

```bash
npm run docker:up
```

Then start your application services normally.

For example:

```bash
npm run start:dev
```

or for FastAPI:

```bash
python -m uvicorn app.main:app --reload
```

---

### During development

Check containers:

```bash
npm run docker:ps
```

Watch logs:

```bash
npm run docker:logs
```

---

### End of the day

You can stop the Compose environment with:

```bash
npm run docker:down
```

Your named volumes normally remain.

Or you can simply shut down the computer.

---

# 19. Why Docker Is Useful for This Project

Without Docker, a developer may need to manually install:

```text
MongoDB
Redis
RabbitMQ
Node.js
Python
and other dependencies
```

For infrastructure such as MongoDB, Redis, and RabbitMQ, Docker allows the team to define the required versions and configuration in one Compose file.

A new developer can often do something close to:

```bash
git clone <repository>

cd <project>

# configure .env if required

npm run docker:up
```

and get the project's infrastructure running.

This helps reduce:

```text
"It works on my machine."
```

problems.

---

# 20. Image vs Container

Remember:

```text
IMAGE
= blueprint/package

CONTAINER
= running instance created from that image
```

Example:

```text
mongo:8 image
      ↓
ecommerce-ai-mongodb container
```

One image can also create multiple containers.

---

# 21. Docker Compose

Docker Compose is useful when an application requires multiple containers.

Instead of manually starting:

```text
MongoDB
Redis
RabbitMQ
4 application services
```

one by one, they can all be defined in one Compose file.

Then:

```bash
docker compose up
```

can start the environment.

In this project, npm scripts provide shorter commands such as:

```bash
npm run docker:up
```

---

# Quick Reference

```text
docker image
    = blueprint used to create containers

docker container
    = running instance of an image

docker compose
    = manages multiple Docker services together

docker network
    = lets containers communicate

docker volume
    = persistent local container data

ports
    = expose container ports to the host machine

healthcheck
    = verifies that the service inside a container is actually ready

restart: unless-stopped
    = automatically restart unless it was explicitly stopped
```

### Project Commands

```bash
npm run docker:up
npm run docker:ps
npm run docker:logs
npm run docker:down
```

### Useful Docker Commands

```bash
docker ps
docker images
docker volume ls
docker network ls
```
