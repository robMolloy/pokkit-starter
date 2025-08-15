## Pokkit Starter

This is a starter project for Pokkit. It is a NextJS app with a TS server and a Pocketbase instance. It can be used as a starting point for your own Pokkit project - a fast reliable way to prototype your ideas .

## Dev Setup

Use the following commands in 3 different terminals to run the app with appropriate dev feedback:

- `npm run dev1` // this runs the NextJS app
- `npm run dev2` // this runs the TS server
- `npm run dev3` // this runs the Pocketbase instance

## Database setup

- `db:create-backup` // creates a backup of the database using the pocketbase naming convention
- `db:replace-seed` // replaces the currently saved backup seed
- `db:restore-seed` // restores the currently saved backup seed
