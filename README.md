# nextjs-greentouch-app 🌿

GreenTouch is a web application built with **Next.js** that focuses on improving student mental health through guided exercises, multimedia content, and reflective activities.

---

## Getting Started 🧩

### Prerequisites

Before running the project, make sure you have the following installed:

- **Node.js** (recommended: LTS version)
- **Docker** and **Docker Compose**
- A **PostgreSQL** database

---

## Installation & Setup ⚙️🛠️

### 1. Clone the repository

```bash
git clone <repository-url>
cd greentouch-app
```

---

### 2. Environment variables

After cloning the project, create a file named **`.env`** in the root directory of the project. This file is used to configure environment-specific variables required for the application to run.

Add the following variables to the `.env` file:

```env
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
```

#### DATABASE_URL

The application uses a **PostgreSQL** database. The `DATABASE_URL` environment variable is used to define the connection string to your PostgreSQL database.

Example format:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/greentouch
```

This variable allows the application to establish a connection to the PostgreSQL database and is required for all database-related operations.

---

#### BETTER_AUTH_SECRET

GreenTouch uses the **Better Auth** library for user authentication and authorization.

`BETTER_AUTH_SECRET` is used to encrypt data and generate secure hashes. It must:

- Be **at least 32 characters long**
- Be generated with **high entropy**

You may define your own secure random string, or generate one using the official Better Auth documentation:

[https://www.better-auth.com/docs/installation](https://www.better-auth.com/docs/installation)

---

#### BETTER_AUTH_URL

`BETTER_AUTH_URL` defines the **base URL** of the application. This is required by Better Auth to correctly handle authentication flows.

Example:

```env
BETTER_AUTH_URL=http://localhost:3000
```

For production deployments, this should match the public URL of your application.

---

## Running the Application with Docker 🐋

`docker compose` starts everything the app needs:

- **db** – a PostgreSQL database (data is kept in the `db-data` volume)
- **migrate** – applies database migrations and creates the default admin account, then exits
- **nextapp** – the application, started once `migrate` has finished

With Docker, `DATABASE_URL` is set automatically, so `.env` only needs `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`. The following optional variables can also be set in `.env`:

```env
# Database (defaults shown)
POSTGRES_USER=greentouch
POSTGRES_PASSWORD=greentouch
POSTGRES_DB=greentouch

# Default admin account, created on first start (defaults shown)
ADMIN_EMAIL=greentouchtool@gmail.com
ADMIN_PASSWORD=Greentouch001!!
ADMIN_NAME=GreenTouch Admin

# Time zone used for dates shown by the server
TZ=Europe/Riga
```

The admin account is only created if it doesn't exist yet. Changing `ADMIN_PASSWORD` later does not change the password of an existing account.

### Build and start

```bash
docker compose up -d --build
```

After the containers start successfully, the application will be available at the URL specified in `BETTER_AUTH_URL`.

### Updating

```bash
git pull
docker compose up -d --build
```

New database migrations are applied automatically on every start.

### Database changes (developers)

The database schema is managed with Prisma migrations in `prisma/migrations`. After changing `prisma/schema.prisma`, create a migration with:

```bash
npx prisma migrate dev --name <short-description>
```

---

## Development Server (Optional) 🌐

If you prefer to run the application without Docker during development, you can start the Next.js development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Then open:

[http://localhost:3000](http://localhost:3000)

in your browser.

---

## Learn More

To learn more about the technologies used in this project:

- **Next.js Documentation** – [https://nextjs.org/docs](https://nextjs.org/docs)
- **Better Auth Documentation** – [https://www.better-auth.com/docs](https://www.better-auth.com/docs)
- **PostgreSQL** – [https://www.postgresql.org/](https://www.postgresql.org/)
