const config = require('../config.json');
const callersDb = require('../db/callers.db.js');

class TokenBucket {
    endpointsHash = {};

    constructor() {
        config.rateLimitsPerEndpoint.forEach((endpointInfo) => {
            this.endpointsHash[endpointInfo.endpoint] = {
                ...endpointInfo,
            };
        });
        setInterval(() => this.addTokens(), 1000);
    }

    addTokens() {
        Object.keys(this.endpointsHash).forEach((endpoint) => {
            const capacityAdded = parseFloat(
                (this.endpointsHash[endpoint].sustained / 60000).toFixed(6)
            );
            Object.keys(callersDb).forEach((caller) => {
                if (
                    parseFloat(callersDb[caller][endpoint]?.capacity) <
                    this.endpointsHash[endpoint].burst
                ) {
                    const callerCapacityAdded =
                        parseFloat(callersDb[caller][endpoint].capacity) +
                        parseFloat(capacityAdded);
                    if (
                        callerCapacityAdded >=
                        this.endpointsHash[endpoint].burst
                    ) {
                        callersDb[caller][endpoint].capacity =
                            this.endpointsHash[endpoint].burst;
                    } else {
                        callersDb[caller][endpoint].capacity += capacityAdded;
                    }
                }
            });
        });
    }

    take(callerId, endpoint) {
        // Create endpoint registry if does not exists
        if (!callersDb[callerId]) {
            callersDb[callerId] = {};
        }

        if (!callersDb[callerId][endpoint]) {
            callersDb[callerId][endpoint] = {
                capacity: this.endpointsHash[endpoint].burst - 1,
            };
            return callersDb[callerId][endpoint].capacity;
        }

        // Check if caller has exeeced its limits and return response
        if (callersDb[callerId][endpoint].capacity < 1) {
            return false;
        } else {
            callersDb[callerId][endpoint].capacity--;
            return Math.floor(callersDb[callerId][endpoint].capacity);
        }
    }
}

module.exports = TokenBucket;
