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

## Project Architecture

![CS222 1](https://user-images.githubusercontent.com/30245379/236579429-cdff8102-9bb5-4f1a-9b17-3ab37d60ffc5.png)

- Frontend
  - 🌋 Functionality
    - Landing page:
      - Title and instruction: state the pitch of the application
      - Login zone: a Google and Auth0 based login-system.
    - Dashboard:
      - Event list: display all created and participated events.
      - Create event widget: allow users to create new events with specific orientation.
    - Event page:
      - Event information header: display event information and allow updating and deleting the event.
      - Available Time Slots: allow users to fill in their available timeslots and conveniently view others' timeslots.
  - 🖥️ Programming Language(s) used
    - TypeScript: a superset of Javascript. We believe that using typescript will aid debugging since it can expose potential bugs and runtime errors in development.
  - 📕 Major Libraries Used
    - Next.js v13.0: a web-app framework that provides powerful rendering and optimization (pre-rendering, caching, etc.) mechanisms.
    - Auth0: for authentication and avoid storing sensitive user data
  - 🔨 Testing Methodology
    - We believe the best way to test frontend is by visual inspection. However, we believe that a certain amount of rendering testing can also be important so we will also use react testing libraries.
  - 🎢 Interactions With Other Components
    - Interact with the backend using tRPC by calling a procedure directly. We would also send HTTP requests to API endpoints to retrieve data.
- Backend (on Edge)
  - 🌋 Functionality
    - User Authentication: authorize user login actions and presist login status
    - Create Event: In the main page of our website, there is a button “Create Event”. Users or event owners can create an event there and invite other users via email.
    - Event Scheduler: Compare all the meeting members’ timeslots and find their spare times which are able to hold meetings together.
    - Choose time slots and location: There is a 24\*7 table that include all time slots in a week in the event page. Any member of this event can pick the time they are free. Also, they can see what time slots other members are available. Event page also includes some basic information of the event like position and topic.
    - Data Persistent (using MySQL)
  - 🖥️ Programming Language(s) used
    - Typescript. Typescript is a superset of Javascript and we believe that using typescript can expose potential bugs and runtime errors in development.
  - 📕 Major Libraries Used
    - tRPC: a library for writing type-safe api using typescript.
    - Zod: for schema validation
    - Prisma: database ORM for better database development experience
  - 🔨 Testing Methodology
    - We will be using Jest to test our tRPC procedures. Or, we can also expose our RPC procedures and test endpoints with Postman or Insomnia. We might also use Vitest for integration tests as well but since this is a relatively new framework we might not use it.
  - 🎢 Interactions With Other Components
    - Interact with the frontend using RPC by calling a procedure directly.

## Development Guide

1. Git clone the repository

   ```shell
   git clone https://github.com/ParachuteTeam/Parachute.git
   cd Parachute
   ```

2. Install packages using `pnpm`:

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

## Team

<a href="https://github.com/ParachuteTeam/Parachute/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ParachuteTeam/Parachute" />
</a>

Made with [contrib.rocks](https://contrib.rocks).
