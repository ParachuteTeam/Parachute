# Parachute.fyi - when2meet alternative

Link to website: [parachute.fyi](https://parachute.fyi).

## Introduction

🪂 Parachute.fyi is an open-sourced web-based scheduling application built with modern frameworks. It integrates modern user interface and login mechanism, thus offering way better experience than when2meet.com.

## Key Features

- 📦 All features of when2meet.com.
- 🎊 Modern interface offering clearer information display and quicker operations.
- 🗒️ Login with Google / Auth0 to automatically fill-in names and track all joined events.
- 🚀 Use join code to quickly join a event without typing the full link.
- ⏰ Full timezone support allows scheduling over multiple regions and tracking which timezone each participant is in.
- 🔒 Have full control over your information, free and easy to delete anything you have created.

## Tech Stack

- create-t3-app
  - Next.js
  - TypeSript
  - NextAuth.js
  - Prisma.js
  - tRPC
  - tailwindcss
- MySQL (not part of repository)

## Development Guide

1. Git clone the repository

   ```shell
   git clone https://github.com/ParachuteTeam/Parachute.git
   cd Parachute
   ```

2. Install packages using `pnpm` [make sure you have [pnpm](https://pnpm.io/) installed]:

   The command will also generate prisma client. Run it again whenever you changed `prisma.schema`.

   ```shell
   pnpm install
   ```

3. Create a `.env` file and make sure you have the required variables as shown in `.env.example`.

4. Start the project for development:

   ```shell
   pnpm run dev
   ```

5. If you want to test build (without HMR and with production behaviors), use:

   ```shell
   pnpm run build
   pnpm run start
   ```

## Deployment

It is recommended to deply using [Vercel](https://vercel.com), simply select Next.js project and fill-in all environment variables will do. Remember to also create a production-ready MySQL database for data persistence. Here is our deployed web [Parachute](https://parachute.fyi).

## Contributors

<a href="https://github.com/ParachuteTeam/Parachute/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ParachuteTeam/Parachute" />
</a>

Made with [contrib.rocks](https://contrib.rocks).
