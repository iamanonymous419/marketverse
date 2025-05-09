# Project - MarketVerse

[![Next.js](https://img.shields.io/badge/Frontend-Next.js-black?logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwindcss)](https://tailwindcss.com)
[![Shadcn UI](https://img.shields.io/badge/UI-Shadcn%20UI-blueviolet)](https://ui.shadcn.com)
[![Lucide Icons](https://img.shields.io/badge/Icons-Lucide-lightgrey)](https://lucide.dev)
[![React Hook Form](https://img.shields.io/badge/Forms-React%20Hook%20Form-red?logo=react)](https://react-hook-form.com)
[![Zod](https://img.shields.io/badge/Validation-Zod-blue)](https://zod.dev)
[![Typed.js](https://img.shields.io/badge/Animations-Typed.js-yellow)](https://github.com/mattboldt/typed.js)
[![TanStack Query](https://img.shields.io/badge/Data%20Fetching-TanStack%20Query-ff4154?logo=react-query)](https://tanstack.com/query)
[![Zustand](https://img.shields.io/badge/State%20Management-Zustand-orange)](https://zustand-demo.pmnd.rs)
[![Drizzle ORM](https://img.shields.io/badge/ORM-Drizzle%20ORM-ff69b4)](https://orm.drizzle.team)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?logo=postgresql)](https://www.postgresql.org)
[![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-yellow?logo=cloudinary)](https://cloudinary.com)
[![Clerk](https://img.shields.io/badge/Authentication-Clerk-ff9900)](https://clerk.com)
[![Nodemailer](https://img.shields.io/badge/Email-Nodemailer-green)](https://nodemailer.com)
[![Docker](https://img.shields.io/badge/Container-Docker-blue?logo=docker)](https://www.docker.com)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-K8s-blue?logo=kubernetes)](https://kubernetes.io)
[![Jenkins](https://img.shields.io/badge/CI%2FCD-Jenkins%20%7C%20ArgoCD-brightgreen?logo=jenkins)](https://www.jenkins.io)
[![Helm](https://img.shields.io/badge/IaC-Helm%20%7C%20Makefile-purple?logo=helm)](https://helm.sh)
[![Prometheus](https://img.shields.io/badge/Monitoring-Prometheus-red?logo=prometheus)](https://prometheus.io)
[![Grafana](https://img.shields.io/badge/Dashboard-Grafana-orange?logo=grafana)](https://grafana.com)
[![AWS](https://img.shields.io/badge/Cloud-AWS-orange?logo=amazon-aws)](https://aws.amazon.com)
[![Minikube](https://img.shields.io/badge/K8s%20Local-Minikube-blue?logo=kubernetes)](https://minikube.sigs.k8s.io)
[![Vercel](https://img.shields.io/badge/Hosting-Vercel-black?logo=vercel)](https://vercel.com)
[![ESLint](https://img.shields.io/badge/Code%20Quality-ESLint-purple?logo=eslint)](https://eslint.org)
[![Prettier](https://img.shields.io/badge/Formatter-Prettier-blue?logo=prettier)](https://prettier.io)
[![TypeScript](https://img.shields.io/badge/Type%20Safety-TypeScript-blue?logo=typescript)](https://www.typescriptlang.org)
[![TSX](https://img.shields.io/badge/Bundler-TSX-lightblue)](https://www.typescriptlang.org/docs/handbook/jsx.html)
[![PostCSS](https://img.shields.io/badge/CSS%20Processing-PostCSS-red?logo=postcss)](https://postcss.org)

**MarketVerse** is a dynamic e-commerce platform built with Next.js, where users can seamlessly buy and sell products. Whether you want to shop for quality goods or become a seller to showcase your products, MarketVerse provides a smooth and intuitive experience. With secure transactions, user-friendly navigation, and a robust marketplace, MarketVerse empowers individuals to connect, trade, and grow their businesses effortlessly.

> [!WARNING]
> This project is created for **learning purposes** to explore and implement various web development and DevOps technologies.

# Table of Contents

- [Project - MarketVerse](#project---marketverse)
- [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Tech Stack](#tech-stack)
    - [Frontend](#frontend)
    - [Backend \& API](#backend--api)
    - [Development \& Build Tools](#development--build-tools)
    - [DevOps \& Deployment](#devops--deployment)
  - [Features](#features)
  - [Project Structure](#project-structure)
  - [Future Plans](#future-plans)
  - [How To Setup This Project](#how-to-setup-this-project)
    - [Local Development Setup](#local-development-setup)
      - [1. Clone the Repository](#1-clone-the-repository)
      - [2. Install Dependencies](#2-install-dependencies)
      - [3. Set Up Environment Variables](#3-set-up-environment-variables)
      - [4. Generate and Push Schema to Database](#4-generate-and-push-schema-to-database)
      - [5. Run the Development Server](#5-run-the-development-server)
      - [6. Access the Application](#6-access-the-application)
    - [Docker Development Setup](#docker-development-setup)
      - [1. Clone the Repository](#1-clone-the-repository-1)
      - [2. Build the Docker Image](#2-build-the-docker-image)
      - [3. Create Docker Network](#3-create-docker-network)
      - [4. Set Up PostgreSQL Database](#4-set-up-postgresql-database)
      - [5. Initialize Database Schema](#5-initialize-database-schema)
      - [6. Run the Container](#6-run-the-container)
      - [Using Docker Compose](#using-docker-compose)
  - [Author](#author)

## Prerequisites

Before running MarketVerse, ensure you have the following installed:

- **Node.js** (>= 18.0.0) → [Download Here](https://nodejs.org/)
- **Docker** & **Docker Compose** → [Install Guide](https://docs.docker.com/get-docker/)
- **PostgreSQL** (>= 14) → [Setup Guide](https://www.postgresql.org/download/)
- **Cloudinary Account** → [Sign Up](https://cloudinary.com/) (For image uploads)
- **Clerk Account** → [Sign Up](https://clerk.dev/) (For authentication)

## Tech Stack

### Frontend

[![Next.js](https://img.shields.io/badge/Framework-Next.js-black?logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwindcss)](https://tailwindcss.com)
[![Shadcn UI](https://img.shields.io/badge/UI%20Components-Shadcn%20UI-blueviolet)](https://ui.shadcn.com)
[![Lucide Icons](https://img.shields.io/badge/Icons-Lucide-lightgrey)](https://lucide.dev)
[![React Hook Form](https://img.shields.io/badge/Forms-React%20Hook%20Form-red?logo=react)](https://react-hook-form.com)
[![Zod](https://img.shields.io/badge/Validation-Zod-blue)](https://zod.dev)
[![Typed.js](https://img.shields.io/badge/Animations-Typed.js-yellow)](https://mattboldt.com/demos/typed-js)
[![TanStack Query](https://img.shields.io/badge/Data%20Fetching-TanStack%20Query-ff4154?logo=react-query)](https://tanstack.com/query/latest)

### Backend & API

[![Drizzle ORM](https://img.shields.io/badge/Database%20ORM-Drizzle%20ORM-ff69b4)](https://orm.drizzle.team)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?logo=postgresql)](https://www.postgresql.org)
[![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-yellow?logo=cloudinary)](https://cloudinary.com)
[![Clerk](https://img.shields.io/badge/Authentication-Clerk-ff9900)](https://clerk.dev)
[![Nodemailer](https://img.shields.io/badge/Email%20Service-Nodemailer-green)](https://nodemailer.com)

### Development & Build Tools

[![TypeScript](https://img.shields.io/badge/Type%20Safety-TypeScript-blue?logo=typescript)](https://www.typescriptlang.org)
[![ESLint](https://img.shields.io/badge/Code%20Quality-ESLint-purple?logo=eslint)](https://eslint.org)
[![Prettier](https://img.shields.io/badge/Formatter-Prettier-blue?logo=prettier)](https://prettier.io)
[![TSX](https://img.shields.io/badge/Bundling-TSX-lightblue)](https://www.typescriptlang.org/docs/handbook/jsx.html)
[![PostCSS](https://img.shields.io/badge/CSS%20Processing-PostCSS-red?logo=postcss)](https://postcss.org)

### DevOps & Deployment

#### Containerization & Orchestration

[![Docker](https://img.shields.io/badge/Container-Docker-blue?logo=docker)](https://www.docker.com)
[![Kubernetes](https://img.shields.io/badge/Orchestration-Kubernetes-326CE5?logo=kubernetes)](https://kubernetes.io)
[![Minikube](https://img.shields.io/badge/Local%20K8s-Minikube-3970e4?logo=kubernetes)](https://minikube.sigs.k8s.io/docs)
[![AWS EKS](https://img.shields.io/badge/Cloud-AWS%20EKS-FF9900?logo=amazon-aws)](https://aws.amazon.com/eks)

#### Infrastructure as Code (IaC)

[![Terraform](https://img.shields.io/badge/IaC-Terraform-7B42BC?logo=terraform)](https://www.terraform.io)
[![Ansible](https://img.shields.io/badge/Automation-Ansible-EE0000?logo=ansible)](https://www.ansible.com)
[![Helm](https://img.shields.io/badge/K8s%20Packages-Helm-0F1689?logo=helm)](https://helm.sh)

#### CI/CD Pipeline & Automation

[![Jenkins](https://img.shields.io/badge/CI%2FCD-Jenkins-D24939?logo=jenkins)](https://www.jenkins.io)
[![Shell](https://img.shields.io/badge/Automation-Shell%20Scripting-4EAA25?logo=gnu-bash)](https://www.gnu.org/software/bash)
[![Linux](<https://img.shields.io/badge/OS-Linux%20(Ubuntu%2FDebian)-FCC624?logo=linux>)](https://ubuntu.com)

#### Monitoring & Logging

[![Grafana](https://img.shields.io/badge/Dashboard-Grafana-F46800?logo=grafana)](https://grafana.com)
[![Prometheus](https://img.shields.io/badge/Monitoring-Prometheus-E6522C?logo=prometheus)](https://prometheus.io)
[![Loki](https://img.shields.io/badge/Logging-Loki-33cc33?logo=loki)](https://grafana.com/oss/loki)

#### Cloud & Hosting

[![AWS EC2](https://img.shields.io/badge/Cloud-AWS%20EC2-FF9900?logo=amazon-aws)](https://aws.amazon.com/ec2)
[![Vercel](https://img.shields.io/badge/Frontend%20Hosting-Vercel-000000?logo=vercel)](https://vercel.com)

#### Continuous Delivery & GitOps

[![ArgoCD](https://img.shields.io/badge/GitOps-ArgoCD-blue?logo=argocd)](https://argoproj.github.io/)

## Features

- 🛍️ Buy & sell products effortlessly
- 🔒 Secure authentication with **Clerk**
- 📸 Image management using **Cloudinary**
- 📩 Email notifications with **Nodemailer**
- 📦 PostgreSQL with **Drizzle ORM** for efficient data handling
- 🌗 Dark Mode support with **Next-Themes**
- ⚡ Lightning-fast UI with **React, Tailwind CSS & Shadcn UI**
- 🛠️ Fully containerized and orchestrated using **Docker & Kubernetes**

## Project Structure

```
src
├── app
│   ├── api
│   │   ├── (buyer)
│   │   │   └── user
│   │   │       ├── add-user
│   │   │       ├── address-user
│   │   │       │   ├── default
│   │   │       │   └── [email]
│   │   │       ├── get-user
│   │   │       ├── payment
│   │   │       │   ├── unlink
│   │   │       │   │   └── [username]
│   │   │       │   └── [email]
│   │   │       ├── update-user
│   │   │       └── upload-image
│   │   ├── (seller)
│   │   │   ├── add-product
│   │   │   ├── check
│   │   │   ├── delete
│   │   │   ├── delete-products
│   │   │   │   └── [id]
│   │   │   ├── details
│   │   │   ├── get-products
│   │   │   ├── login
│   │   │   ├── order
│   │   │   │   ├── accept-orders
│   │   │   │   │   └── [orderId]
│   │   │   │   ├── decline-orders
│   │   │   │   │   └── [orderId]
│   │   │   │   ├── delivered-orders
│   │   │   │   │   └── [orderId]
│   │   │   │   ├── get-approve-orders
│   │   │   │   │   └── [email]
│   │   │   │   ├── get-decline-orders
│   │   │   │   │   └── [email]
│   │   │   │   ├── get-delivered-orders
│   │   │   │   │   └── [email]
│   │   │   │   └── get-orders
│   │   │   │       └── [email]
│   │   │   ├── payment
│   │   │   │   ├── unlink
│   │   │   │   │   └── [username]
│   │   │   │   └── [email]
│   │   │   ├── update
│   │   │   └── upload
│   │   ├── cron
│   │   │   └── newsletter
│   │   ├── newsletter
│   │   └── products
│   │       ├── cart
│   │       │   ├── add
│   │       │   ├── fetch
│   │       │   └── remove
│   │       ├── fetch
│   │       ├── order
│   │       │   ├── auto-cancel
│   │       │   ├── cancel
│   │       │   │   └── [orderId]
│   │       │   └── [email]
│   │       ├── review
│   │       │   └── [no]
│   │       ├── wishlist
│   │       │   ├── add
│   │       │   ├── fetch
│   │       │   └── remove
│   │       └── [no]
│   ├── common
│   │   ├── address
│   │   ├── cart
│   │   ├── orders
│   │   ├── payment
│   │   ├── profile
│   │   └── wishlist
│   ├── dashboard
│   │   ├── list
│   │   ├── order
│   │   │   ├── accept
│   │   │   ├── complete
│   │   │   ├── decline
│   │   │   └── pending
│   │   ├── payment
│   │   ├── profile
│   │   └── view
│   └── products
│       ├── buynow
│       │   └── [id]
│       ├── explore
│       └── [no]
├── components
│   ├── custom
│   │   ├── products
│   │   └── skeleton
│   ├── theme
│   └── ui
├── db
├── hooks
├── lib
├── service
│   ├── buyer-detail
│   ├── product-detail
│   └── seller-detail
├── types
│   ├── api
│   ├── products
│   └── schema
├── utils
└── validation
    └── schema
```

Each folder serves a specific purpose:

- **app/api** → Handles all API endpoints
- **components/** → Reusable UI components
- **service/** → Business logic for buyers, products, and sellers
- **db/** → Database-related files
- **utils/** → Helper functions
- **validation/** → Schema validation

This structured approach ensures scalability and ease of maintenance.

## Future Plans

> [!IMPORTANT]
> These technologies are planned for future implementation.

- [x] Docker
- [x] Kubernetes (Minikube)
- [x] Jenkins
- [x] Shell Scripting
- [x] Linux
- [x] Helm
- [x] AWS EC2
- [x] Terraform
- [x] Ansible
- [x] Grafana
- [x] Prometheus
- [x] GraphQL (Planned)
- [ ] Redis (Planned)

## How To Setup This Project

### Local Development Setup

Follow these steps to set up the project on your local machine:

#### 1. Clone the Repository

```bash
# Clone the project repository
git clone https://github.com/iamanonymous419/marketverse.git marketverse
cd marketverse

# For a specific branch
git clone -b main https://github.com/iamanonymous419/marketverse.git marketverse
cd marketverse
```

#### 2. Install Dependencies

```bash
npm install # for npm
# or
bun install # for bun
# or
yarn install # for yarn
# or
pnpm install # for pnpm (recommended)
```

#### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory and add your environment variables:

```bash
# Clerk authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database configuration (PostgreSQL)
DATABASE_URL=

# Cloudinary configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Nodemailer configuration
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
```

#### 4. Generate and Push Schema to Database

```bash
npx drizzle-kit generate
npx drizzle-kit push

# or
pnpm exec drizzle-kit generate
pnpm exec drizzle-kit push

# or (for linux)
pnpm drizzle-kit generate
pnpm drizzle-kit push
```

#### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev # (recommended)
# or
bun dev
```

#### 6. Access the Application

> [!NOTE]
> Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Docker Development Setup

#### 1. Clone the Repository

```bash
# Clone the project repository
git clone https://github.com/iamanonymous419/marketverse.git marketverse
cd marketverse

# For a specific branch
git clone -b main https://github.com/iamanonymous419/marketverse.git marketverse
cd marketverse
```

#### 2. Build the Docker Image

```bash
docker build --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here -t marketverse:latest .
```

#### 3. Create Docker Network

Create a Docker network to enable communication between containers:

```bash
docker network create marketverse-network -d bridge
```

#### 4. Set Up PostgreSQL Database

```bash
# Create a volume for persistent data
docker volume create marketverse-data

# Run PostgreSQL container
docker run -d \
  --name marketverse-database \
  --network marketverse-network \
  -p 5400:5432 \
  -e POSTGRES_USER=something \
  -e POSTGRES_PASSWORD=something \
  -e POSTGRES_DB=marketverse \
  -v marketverse-data:/var/lib/postgresql/data \
  postgres
```

#### 5. Initialize Database Schema

_For Linux :_ Connect to the database container and run the following commands:

```bash
pnpm exec drizzle-kit generate
pnpm exec drizzle-kit push
```

#### 6. Run the Container

```bash
docker run --name marketverse --network marketverse-network -d \
-p 3000:3000 \
-e CLERK_SECRET_KEY=your_clerk_secret \
-e DATABASE_URL=postgresql://something:something@marketverse-database:5432/marketverse \
-e NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name \
-e CLOUDINARY_API_KEY=your_cloudinary_key \
-e CLOUDINARY_API_SECRET=your_cloudinary_secret \
-e SMTP_HOST=your_smtp_host \
-e SMTP_PORT=your_smtp_port \
-e SMTP_USER=your_smtp_user \
-e SMTP_PASSWORD=your_smtp_password \
-e SMTP_FROM=your_smtp_from \
marketverse:latest
```

#### Using Docker Compose

Create a `.env` file in the root directory and add your environment variables for Docker Compose:

```env
DATABASE_URL="postgresql://something:something@marketverse-database:5432/marketverse"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
```

Then run:

```bash
docker-compose up --build -d
```

> [!NOTE]
> Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Author

**Anonymous**  
📧 Email: [anonymous292009@gmail.com](mailto:anonymous292009@gmail.com)  
🔗 GitHub: [https://github.com/iamanonymous419](https://github.com/iamanonymous419)
