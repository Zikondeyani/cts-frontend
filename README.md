# 📦 Commodity Tracking System (CTS)

A Vue 3-based frontend application for tracking commodities, warehouse operations, dispatches, and inventory workflows.  
The application is containerized using Docker and served using Nginx in production.

---

# 🚀 Getting Started

## 📌 Prerequisites

Make sure you have installed:

- Docker Desktop: https://www.docker.com/products/docker-desktop/
- Node.js (optional for local development)

---

# 🐳 Run with Docker (Production)

## 1. Navigate to project folder

```bash
cd new-frontend
```

## 2. Build Docker image

```bash
docker build -t commodity-tracking-system .
```

## 3. Run the container

```bash
docker run -d -p 8080:80 commodity-tracking-system
```

## 4. Open the application

http://localhost:8080

---

# 🛑 Stop the Application (Docker Container)

## 1. List running containers

```bash
docker ps
```

## 2. Stop container

```bash
docker stop <CONTAINER_ID>
```

Example:
```bash
docker stop a1b2c3d4
```

## 3. Remove container (optional)

```bash
docker rm <CONTAINER_ID>
```

---

# 🧹 Stop & Clean Everything

Stop all containers:
```bash
docker stop $(docker ps -q)
```

Remove all containers:
```bash
docker rm $(docker ps -aq)
```

Remove unused images:
```bash
docker image prune -a
```

---

# 🔁 Rebuild After Changes

```bash
docker build -t commodity-tracking-system .
docker run -d -p 8080:80 commodity-tracking-system
```

---

# 🧠 Notes

- The app runs inside a Docker container using `/app` internally
- Port 8080 on your machine maps to port 80 in the container
- Production build is served using Nginx
