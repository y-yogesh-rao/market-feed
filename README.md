# Market Feed

> ### Objective
>
> To take oranization, number of popular repositories (n) and number of committee's (m) who have made contribution to the repositories along with the commit count. 

> ### Technology Stack Used
>
> - **Node.js**: as the backend programming language
> - **Hapi.js**: as the Node.js Framework
> - **MySQL**: as the Database
> - **Github**: as the Version Control System
> - **Heroku**: as platform for deployement and hosting. 

> ### Prerequisites & Installation
>
> Please make sure you have Node.js installed. If not, **[Download and Install Node](https://nodejs.org/en/download/)**
>
> You must also have MySQL installed on you machine. In case you don't have MySQL installed **[Download and Install MYSQL](https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/windows-install-archive.html)**. 

> ### NPM Dependencies
> - "@hapi/boom": "^9.1.2",
> - "@hapi/hapi": "^20.1.2",
> - "@hapi/inert": "^6.0.3",
> - "@hapi/vision": "^6.0.1",
> - "axios": "^0.25.0",
> - "bcrypt": "^5.0.1",
> - "dotenv": "^8.2.0",
> - "fs": "0.0.1-security",
> - "handlebars": "^4.7.7",
> - "hapi-auth-jwt2": "^10.2.0",
> - "hapi-auto-route": "^3.0.4",
> - "hapi-i18n": "^3.0.1",
> - "hapi-swagger": "^14.1.0",
> - "http": "^0.0.1-security",
> - "joi": "^17.4.0",
> - "jsonwebtoken": "^8.5.1",
> - "lodash": "^4.17.21",
> - "md5": "^2.3.0",
> - "moment": "^2.29.1",
> - "mysql2": "^2.2.5",
> - "ngrok": "^4.1.0",
> - "path": "^0.12.7",
> - "pg": "^8.7.3",
> - "request": "^2.88.2",
> - "sequelize": "^6.6.2",
> - "uuid": "^8.3.2". 

## Quick Start
Setup the **.env** file in your local machine and user the below command to install all the dependencies used: ``npm install``

Server can then be started using the following command ``node server.js`` or ``nodemon server.js``

## Docs & Features
> - [Swagger Documentation](https://pikachu-marketfeed.herokuapp.com/documentation): Documentation for all the APIs
> - [Login](https://pikachu-marketfeed.herokuapp.com/documentation#/User/postUserLogin): Authentication using email and password
> - [File Upload](https://pikachu-marketfeed.herokuapp.com/documentation#/File/postFile): Upload file for uploading profile image
> - [Delete File](https://pikachu-marketfeed.herokuapp.com/documentation#/File/deleteFile): Delete file from the server
> - [Get File Detail](https://pikachu-marketfeed.herokuapp.com/documentation#/File/getFileId): Get detail of a file
> - [Get Popular Repositories](https://pikachu-marketfeed.herokuapp.com/documentation#/Task/getTaskRepositoryPopular): Get popular repositories by passing organization name, number of top repositories **based on forks** required and number of top contributors required **based on commits**

## Examples
Organization, n, m
```console
errfree 1, 3
ethereum-biolerplate, 5, 5
```

## People
The original author of application is **[Yogesh Rao](https://github.com/y-yogesh-rao)**
