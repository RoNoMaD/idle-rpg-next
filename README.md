# Idle RPG

> A basic idle RPG game

A simple RPG character creator and idle game to test the market and the concept.

## Developing

### Built With

#### Front (UI) dependencies

- [React](https://reactjs.org/) : A JavaScript library for building user interfaces

#### Back (server) dependencies

- [NextJS](https://nextjs.org/): The React Famework for Production
- [Prisma](https://www.prisma.io/): an open source ORM.

#### Database

- [PostgreSQL](https://www.postgresql.org/): PostgreSQL is a powerful, open source object-relational database system with over 30 years of active development that has earned it a strong reputation for reliability, feature robustness, and performance.

#### Formatting/Linting/Testing dev dependencies

- [Prettier](https://prettier.io/) : An opinionated code formatter.
- [ESLint](https://eslint.org/) : A pluggable linting utility for JavaScript and JSX.
- [stylelint](https://stylelint.io/) : A mighty, modern linter that helps you avoid errors and enforce conventions in your styles.
- [Jest](https://jestjs.io/) : is a delightful JavaScript Testing Framework with a focus on simplicity.
- [testing-library](https://testing-library.com/) : Simple and complete testing utilities that encourage good testing practices
- [cypress](https://www.cypress.io/) : Fast, easy and reliable testing for anything that runs in a browser.

### Prerequisites

Install the following tools :

- [Git](https://git-scm.com/downloads) : A distributed version control system.

- [NodeJS](https://nodejs.org/en/download/) : a JavaScript runtime built on Chrome's V8 JavaScript engine. It includes [npm](https://www.npmjs.com/) as a package manager for JavaScript.

### Configuration

Rename the .env.local.example file to .env and fill it with your database and oAuth provider infos.

### Setting up Dev

Here's a brief intro about what a developer must do in order to start developing
the project further:

```shell
git clone https://github.com/RoNoMaD/idle-rpg-next.git
cd idle-rpg-next/
npm install
npm run dev
```

### Building

```shell
npm run build
```

## Tests

Unit and integration

```shell
npm run test
```

End to end

```shell
npm run test:e2e:run
```

## Api Reference

If the api is external, link to api documentation. If not describe your api including authentication methods as well as explaining all the endpoints with their required parameters.

## Database

Explaining what database (and version) has been used. Provide download links.
Documents your database design and schemas, relations etc...

## Licensing

MIT
