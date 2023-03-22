const config = require('../config.json');

// Services
const TokenBucket = require('../services/tokenBucket.service');

class TakeController {
    availableEndpoints = [];
    tokenBucketInstance;

    constructor() {
        this.tokenBucketInstance = new TokenBucket();
        this.availableEndpoints = config.rateLimitsPerEndpoint.map(
            (endpointInfo) => {
                return endpointInfo.endpoint;
            }
        );
    }

    take(req, res) {
        // Check if requested endpoint exists
        const endpoint = `${req.query.method.toUpperCase()} ${decodeURI(
            req.query.route
        )}`;

        if (!this.availableEndpoints.includes(endpoint)) {
            res.status(404).send({
                message: 'Requested endpoint does not exist',
            });
        }

        // Perform take & return response
        const takenInfo = this.tokenBucketInstance.take(
            req.query.callerId,
            endpoint
        );
        if (!takenInfo) {
            return res.status(200).send({
                message: 'KO',
                reamainingTokens: 0,
            });
        } else {
            return res.status(200).send({
                message: 'OK',
                reamainingTokens: takenInfo,
            });
        }
    }
}

module.exports = TakeController;
