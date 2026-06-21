s# Cognifyr ERP Integration Setup Guide

This repository contains the containerized ERPNext backend and the custom Nuxt 3/4 frontend application.

## Repository Structure

- **`frappe_docker/`**: The Frappe/ERPNext backend container environment orchestrated with Docker Compose.
- **`frontend/`**: The modern Nuxt 4 frontend application that integrates with ERPNext APIs.

---

## Prerequisites

Before starting, ensure you have the following installed on your local machine:
- **Docker** and **Docker Compose v2**
- **Node.js** (v18.x or v20.x recommended)
- **npm** or another package manager (Yarn, pnpm, Bun)

---

## 1. Backend Setup (Frappe/ERPNext)

The backend is configured to run using a single-file Compose setup (`pwd.yml`) which includes MariaDB, Redis, a Celery worker queue, the Frappe socketio service, and the core ERPNext application.

### Step 1: Start the Docker containers
Navigate to the `frappe_docker` folder and boot up the stack:
```bash
cd frappe_docker
docker compose -f pwd.yml up -d
```
*Note: This command runs the containers in detached mode. It may take a couple of minutes on the first run for the site (`frontend`) to be initialized and built.*

### Step 2: Verify the Site Creation
The `pwd.yml` configuration automatically runs a `create-site` container that creates a default site named `frontend` and installs the `erpnext` app. You can monitor the progress with:
```bash
docker compose -f pwd.yml logs -f create-site
```
Once the site is created, the backend web console will be accessible at:
- **URL**: `http://localhost:8080`
- **Default Username**: `Administrator`
- **Default Password**: `admin`

### Step 3: Seed HRMS Demo Data
A custom seeding script is provided in `frappe_docker/seed.js` to pre-populate designations, employees, holiday lists, leave types, attendances, salary structures, shift types, and other HR data.

To run the seeding script:
1. Ensure the containers are running and healthy.
2. Install the seeding dependencies:
   ```bash
   npm install
   ```
3. Run the script:
   ```bash
   node seed.js
   ```
*(By default, the script targets `http://localhost:8080`. If you are using a different URL or an ngrok address, you can export `BASE_URL="http://your-url"` before running the script).*

---

## 2. Frontend Setup (Nuxt)

The frontend is a Nuxt application that interfaces with the ERPNext API using a server-side proxy to handle authentication, CORS, and cookies safely.

### Step 1: Configure Environment Variables
Navigate to the `frontend` directory:
```bash
cd ../frontend
```
Ensure you have a `.env` file containing the URL to your local running backend:
```env
NUXT_PUBLIC_API_BASE=http://localhost:8080
```

### Step 2: Install Dependencies
Install the project packages:
```bash
npm install
```

### Step 3: Start the Development Server
Run the Nuxt application in development mode:
```bash
npm run dev
```
The application will start on:
- **URL**: `http://localhost:3000`

---

## Core Integration Architecture

### Session Persistence & Proxying
- The Nuxt frontend routes all backend API requests through `/api/proxy/...` handled by `frontend/server/api/proxy/[...path].ts`.
- This proxy automatically forwards requests to the base URL configured in `NUXT_PUBLIC_API_BASE`.
- Session management is handled by extracting the Frappe Session ID (`sid`) from the response and passing it in a custom `x-erpnext-sid` header to bypass typical cookie-based CORS restrictions.
