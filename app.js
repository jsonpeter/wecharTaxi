const express = require('express');

const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const routes = require('./routes/routes');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);

module.exports = app;
