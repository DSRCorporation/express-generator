# Yeoman generator for Express/NodeJS by DSR Corporation
An [Express](http://expressjs.com/) generator for Yeoman.

## Install

```
npm install generator-express-dsr
yo express-dsr
```
During the installation process you are going to be asked a few questions.

## Run
Express generator uses docker containers. If you want to start application in docker, you should use:
```
docker-compose up
```

## Directories structure

- config
- libs
 - dictionaries 
 - errors
 - initializers
 - models
 - routes
 - utils
- views 
- root files

#### Config
Includes 4 files:
- constants: contains application constants
- defaults, development, production: containts settings dependent on current environment

There is configuration for:
- mongoose
- sequelize
- redis
- express 
- security
- file storage
- credentials for email service
- logger

For getting right config nconf module is used.

#### Libs
##### Dictionaries
Includes files with data set for populating database with initial data.

##### Errors
Error classes:
- AbstractError
- AlreadyExistsError
- EmailIsNotVerifiedError
- InternalServerError
- NotFoundError
- SchemaValidationError
- SecurityError
- Validation Error

##### Initializers
- Dictionaries: fills data in database from libs/dictionaries
- Middlewares: adds middlewares to express application
- Models: initializes collections in database
- Mongoose, Redis, Sequelize: configures connection to database
- Routes: adds app routes by dint of routeBuilder

##### Models
Describes database schema

##### Routes
Includes two directories(api and views) and index.js file. Each directories contains two type of files: js and json.
Business logic for routes is described in js files. Request validation schemas, request methods and configuration
for applying conditional-applied middlewares are described in json files.
Index.js has a list endpoints. For each endpoint you must specify url by which it will be available and path to js and json file.

##### Templates
Contains EJS templates used for emails.

##### Utils
- **config**: helper for getting config
- **bcrypt**: promisified version of bcrypt module
- **dictionaries-loader**: helper for loading datasets to database from libs/dictionaries
- **flow-helpers**: contains several helper functions
- **fs**: promisified version of fs module
- **jwt**: helper functions for authorization with JSON Web Token
- **lodash-ext**: adds useful functons to lodash
- **logger**: utility which allows to specify different logger level and settings for each environment
- **middlewares**: contains methods used by middleware initializer
- **module-packer**: packs a folder in one module and allows to access files from folder by 'folder/filename'
- **mongoose**: provides a pre-configured version of mongoose
- **object-validator**: utility for request validation based on [validator](https://github.com/chriso/validator.js)
- **promise**: wrapper over promise libraries
- **redis**: creates two clients(regular and pub-sub) for working with redis
- **sequelize**: creates instance of database connection
- **route-builder**: utility for adding routes to express app. Used in 'initializers/routes'
- **mailer**: helper functions for sending emails
- **storage-helpers**: helper functions for saving files on local machine or AWS
- **storage-helpers-local**: helper functions for storage files on local machine
- **storage-helpers-s3**: helper functions for working with Amazon storage

#### Views
Contains EJS templates used for express app routes.

## Features
- Smart structure for Express based applications
- Mongoose (MongoDB), Sequelize (Postgres, Mysql), Redis support
- JWT Authorization
- ObjectValidator (used in routes for data validation)
- RouteBuilder (easy and smart interface for creating routes)
- LodashExt (extends lodash library with several useful functions)
- Ability to run the application in docker container
- Application uses async/await feature with NodeJS 7.3.0,
  but you can also use it with NodeJS 6.9.5 LTS through Babel
- Support local and AWS storage for files
- Support sending emails via fake transport or AWS
- YARN for installing dependencies


## License
The MIT License (MIT)

Copyright (c) 2016 DSR Corporation

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

