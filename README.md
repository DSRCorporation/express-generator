# Yeoman generator for Express/NodeJS by DSR Corporation
An ExpressJs generator for Yeoman.

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
- root files


## Features
- Smart structure for NodeJS applications
- Mongoose (MongoDB), Sequelize (Postgres, Mysql) support
- JWT Authorization
- ObjectValidator (used in routes for data validation)
- RouteBuilder (easy and smart interface for creating routes)
- LodashExt (extends lodash library with several useful functions)
- Ability to run the application in docker container


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

