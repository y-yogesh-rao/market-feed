// Include requied packages and make them globally accessible

global.Sequelize = require("sequelize");
global.Op = Sequelize.Op;
global.Fs = require("fs");
require("dotenv").config();
global.Joi = require("joi");
global._ = require("lodash");
global.Path = require("path");
global.uuid = require('uuid');
global.Axios = require('axios');
global.Bcrypt = require("bcrypt");
global.Moment = require("moment");
global.crypto = require('crypto');
global.i18n = require("hapi-i18n");
global.Models = require("./models");
global.Boom = require("@hapi/boom");
global.Hapi = require("@hapi/hapi");
global.Common = require("./common");
global.Jwt = require("jsonwebtoken");
global.Inert = require("@hapi/inert");
global.Vision = require("@hapi/vision");
global.auth_jwt=require("hapi-auth-jwt2");
global.Constants = require("./constants");
global.handlebars = require("handlebars");
global.Routes = require("hapi-auto-route");
global.HapiSwagger = require("hapi-swagger");