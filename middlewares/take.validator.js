function takeRequestValidator(req, res, next) {
    const { callerId, method, route } = req.query;

    // Check required query params are provided
    if (!callerId || typeof callerId !== 'string') {
        return res.status(400).send({
            message: 'Bad Request',
            info: 'Missing callerId on query params',
        });
    }

    if (!method || typeof method !== 'string') {
        return res.status(400).send({
            message: 'Bad Request',
            info: 'Missing method (GET, POST, PATCH, PUT) on query params',
        });
    }

    if (!route || typeof route !== 'string') {
        return res.status(400).send({
            message: 'Bad Request',
            info: 'Missing route on query params',
        });
    }

    next();
}

module.exports = takeRequestValidator;
