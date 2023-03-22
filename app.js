require('dotenv').config();

const express = require('express');
const logger = require('morgan');
const cors = require('cors');

// Routes
const tokenBucketRoutes = require('./routes/tokenBucket.route');
const healthCheckRoutes = require('./routes/healthCheck.route');

const app = express();

//don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//To allow cross-origin requests
app.use(cors());

app.use('/health', healthCheckRoutes);
app.use('/', tokenBucketRoutes);

module.exports = app;
