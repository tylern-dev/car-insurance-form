# Getting Started

1. run `npm install`
2. run `npm run db:reset` to reset the db (this will make sure the db is clean and migrations are
   ran)
3. run `npm run db:generate` to set things up if the server doesn't start
4. run `npm start`
5. Enjoy

# This Repository

The `api` is a basic Express application and uses Prisma for data access with a SQLite database.

The `client` is a basic Vite + React application.

All dependencies are installed in the root of the project for simplicity. You can run both projects
together with

```
$> npm run start
```

or individually with

```
$> npm run start:api
$> npm run start:client
```

The API and client will both automatically reload on file changes to help speed up development.
