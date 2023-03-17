const express = require('express');

// Routes
const tokenBucketRoutes = require('./routes/tokenBucket.route');
const healthCheckRoutes = require('./routes/healthCheck.route');

const app = express();
app.use(express.json());

app.use('/health', healthCheckRoutes);
app.use('/', tokenBucketRoutes);

app.listen(3000);
