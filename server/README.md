# Cosmo Home Server

Express API foundation for Cosmo Home.

Development server defaults to `PORT=9000` and can be overridden with the `PORT` environment variable.

## Initial Admin

Set these environment variables before starting the server for the first time:

```bash
ADMIN_SEED_NAME="Admin Name"
ADMIN_SEED_EMAIL="admin@example.com"
ADMIN_SEED_PASSWORD="a strong password"
```

When the server starts with a database connection, it creates the admin if that email does not already exist. Running the server again with the same seed values will not create a duplicate admin or reset an existing password.

You can also run the seed manually:

```bash
npm run seed:admin
```

To change an admin password, set `ADMIN_SEED_EMAIL` to the existing admin, set `ADMIN_SEED_PASSWORD` to the new password, set `ADMIN_SEED_UPDATE_EXISTING=true`, and run `npm run seed:admin`. Set `ADMIN_SEED_UPDATE_EXISTING=false` again afterward.

To create another admin later, set the seed variables to the new admin's name, email, and password, run `npm run seed:admin`, then remove or rotate the seed values from the runtime environment.
