# Budget API

To start this API, create a `.env` file in the root of this folder with this content

```
NODE_ENV="development"
DATABASE_USERNAME="root"
DATABASE_PASSWORD=""
AUTH_JWKS_URI=your auth0 domain/.well-known/jwks.json
AUTH_AUDIENCE=your unique auth0 id for the webservice
AUTH_ISSUER=your auth0 domain
AUTH_USER_INFO=your auth0 domain/userinfo
```

Update the username and password with the credentials of your local database.

You can also extend the .env file with these configurations, only if the database host/port are different than our default.

```
DATABASE_HOST="localhost"
DATABASE_PORT=3306
```

## How to start

Run the app in development mode with `yarn start`.

Run the app in production mode with `yarn start:prod`. We then assume all necessary environment variables are set, no `.env` file is ever read with this command.

## How to test

Create a `.env.test` with the same configuration as above and these extra's:

```
AUTH_TEST_USER_USER_ID=your test user id
AUTH_TEST_USER_USERNAME=your test user username
AUTH_TEST_USER_PASSWORD=your test user password
AUTH_TOKEN_URL=your auth0 domain/oauth/token
AUTH_CLIENT_ID=your auth0 application client id
AUTH_CLIENT_SECRET=your auth0 application client id secret
```

Run the tests with `yarn test`. To get coverage run `yarn test:coverage`.

## Common errors

* Modules not found errors, try this and run again:

```
yarn install
```

* Migrations failed, try dropping the existing `budget` database and run again

* Others: Google is your friend
