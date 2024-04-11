# TourNament #
## Description ##
This is a simple tournament management system that allows users to create and manage matchs & teams.
It's uses the following technologies:
- Next.JS (React)
- Prisma (ORM)
- SQLite (Database)
- TailwindCSS & DaisyUI (Styling)

Its features include:
- Create a match (team 1, team 2, match date, score, winner) 
- ~~Update a match~~ **(not implemented)**
- Delete a match
- List all matches
- Create a team (team name)
- ~~Update a team~~ **(not implemented)**
- Delete a team
- List all teams
- Show team victories & losses

## Installation ##
You need to have Node.js & NPM installed on your machine. You can download it [here](https://nodejs.org/en/download/) (I use the 20.12.1 for the project).

1. Clone the repository
2. Run `npm install` to install the dependencies
3. Run `npm run dev` to start the development server
4. Open your browser and go to `http://localhost:3000` (or the port that is shown in the terminal if it's different)
5. You can set up the database by running `npx prisma migrate dev` (you can also run `npx prisma migrate reset` to reset the database)
6. To insert some data into the database, you can run `npx prisma db seed`
7. You can access the database by running `npx prisma studio` and go to `http://localhost:5555`
