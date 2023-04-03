const { chai, server, expect } = require('../testConfig');

describe('Token Bucket Routes', () => {
    describe('GET /take', () => {
        it('should response specific error if required parameters are missing', async () => {
            const response = await chai.request(server).get('/take').query({
                callerId: 1,
                method: 'GET',
            });

            expect(response.status).to.eq(400);
        });

        it('should response specific error if requested route does not exist on config.json', async () => {
            const response = await chai.request(server).get('/take').query({
                callerId: 1,
                method: 'GET',
                route: 'fake/route',
            });

            expect(response.status).to.eq(404);
        });

        it('should response 200 & OK if caller has access to requested route', async () => {
            const response = await chai.request(server).get('/take').query({
                callerId: 1,
                method: 'GET',
                route: '/user/:id',
            });

            expect(response.status).to.eq(200);
            expect(response.body).to.deep.eq({
                message: 'OK',
                reamainingTokens: 1,
            });
        });

        it('should response 200 & KO if caller has no access to requested route', async () => {
            const request = await chai.request(server).get('/take').query({
                callerId: 1,
                method: 'GET',
                route: '/user/:id',
            });

            const requests = await Promise.all([
                request,
                request,
                request,
                request,
            ]);
            expect(requests[3].status).to.equal(200);
            expect(requests[3].body).to.deep.eq({
                message: 'KO',
                reamainingTokens: 0,
            });
        });
    });
});
