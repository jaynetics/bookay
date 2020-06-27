# @bookay/server

This is a backend that stores your bookmarks in a database of your choice.

## How to use

Put it on a PAAS or any machine with Node and a database.

### Example: deployment on Heroku

1. [create an app on Heroku](https://heroku.com) - the free tier should do\*
2. add `Heroku Postgres` in the app's `Resources` / `Addons` section
3. [install the Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
4. run the following in your terminal (replace <APP_NAME> with your app name)

```sh
heroku login
curl -n -X POST 'https://api.heroku.com/apps/<APP_NAME>/builds' \
  -d '{"source_blob":{"url":"https://github.com/jaynetics/bookay/archive/master.tar.gz"}}' \
  -H 'Accept: application/vnd.heroku+json; version=3' \
  -H 'Content-Type: application/json'
```

\* It shuts down after 30 minutes, but needs just a few seconds to boot again. You can also install the browser plugin and use its keep-alive feature to keep the server ready while you are browsing.

### Custom deployment

Tell the app about your database using the `BOOKAY_DB_URL` or `BOOKAY_DB_JSON` ENV variable.

Run `npm run build` to prepare and `npm start` to launch the server.

## Development

`$ npm start` launches the server

`$ npm test` (but integration tests are under ../test/)
