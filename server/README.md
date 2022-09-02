# @bookay/server

This is a backend that stores your bookmarks in a database of your choice.

## How to use

Put it on a PAAS or any machine with Node and a database.

### Example: deployment on the free tier of fly.io

First sign up with [fly.io](https://fly.io) and [install flyctl](https://fly.io/docs/hands-on/install-flyctl/).

Then do this:

```bash
git clone https://github.com/jaynetics/bookay
cd bookay
BOOKAY_NAME=bookay$RANDOM # or any other unique name
sed -i '' "s/bookay/$BOOKAY_NAME/" fly.toml
fly auth login
fly apps create $BOOKAY_NAME
fly pg create --name $BOOKAY_NAME-db
fly pg attach $BOOKAY_NAME-db
fly launch
```

### Example: deployment on Heroku (no longer free after 11/2022)

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/jaynetics/bookay)

### Custom deployment

Tell the app about your database using the `BOOKAY_DB_URL` or `BOOKAY_DB_JSON` ENV variable.

Run `npm run build` to prepare and `npm start` to launch the server.

## Development

`$ npm start` launches the server

`$ npm test` (but integration tests are under ../test/)
