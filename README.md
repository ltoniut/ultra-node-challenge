#  Ultra's NodeJS/TypeScript challenge

This is a test application done for Ultra; It features two modules for a Game and a Publisher entity, respectively, with CRUD operations for each, plus a couple additional functions in the Games module.

The file with the requirements has been added to the project's base folder.

### Development Notes

- Although not a specified requirement, based on the review of a fellow applicant's project, and just to be on the safe side, I opted to add a module for handling the Publisher data.
- The decision of storing the game tags as a string split by vertical bars was done in order not to deviate the TypeORM entities too much from the provided data model, but I personally do consider that the right way to handle them would be with additional "tag" and "game_tag" tables to create a relationship.
- The choice to make a game's price and release date optional values was based on the idea that at some point the platform might have to upload games without a set release date.
- As is, the update and create DTOs for each entity are interchangeable, but I opted to separate them instead of creating a single request entity to "future-proof" the code, considering the idea that, if a future point in development existed, the request values might have to be different between each endpoint.

### Stack

- [NestJS](https://docs.nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## About the Author

- Email - [ltoniut@gmail.com]((mailto:ltoniut@gmail.com)
- LinkedIn - [leandro-toniut](https://www.linkedin.com/in/leandro-toniut/)
- Github - [ltoniut](https://github.com/ltoniut)
