[standard:img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard:url]: http://standardjs.com

# hapi-starter &middot; [![Standard - JavaScript Style Guide][standard:img]][standard:url]

## Prerequisites

* [Node.js][nodejs]
* [Docker][dockerinstall] (stable channel)

## What is it?

This sample server is a starting point to building a web server with Hapi.js.

It actually gives you the following features :
* HTTP server (Hapi.js)
* GraphQL server (Apollo Server)
* Database ORM (Sequelize)
* Easy mail sending (Nodemailer)
* Database seeding (sequelize-fixtures or raw SQL script)

## How to use it?

First thing to do is to setup your configuration in `src/config`. 

Then add code and data :
* write models in `src/database/models`
* setup associations in `src/database/associations.js`
* database seeding in `src/database/seed` (JSON fixtures file or raw SQL queries file)
* setup GraphQL schema in `src/graphql/type_defs.gql`
* write schema resolvers in `src/graphql/resolvers.js`
* write schema directives in `src/graphql/directives.js`
* setup classic routes in `src/routes`
* write business code in `src/api`

## How to launch it?

**Make sure to update Makefile environment variables according to your needs!**

Multiple commands are available through `make`, main ones are :
* `make source` : builds your code into `build` directory
* `make db` : starts a Docker container handling database
* `make start` : builds sources and starts builded server

Other helpful commands :
* `make install` : install dependencies
* `make fresh-install` : remove `node_modules` and lockfile before installing dependencies again
* `make test` : launch tests

You can see all subcommands in `Makefile` at root folder.

[dockerinstall]: https://docs.docker.com/install/
[nodejs]: https://nodejs.org/en/download/
