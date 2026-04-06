// File: test/integration/api.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // Make sure this is the correct path to your Express app
const expect = chai.expect;
chai.use(chaiHttp);

describe('API Integration Tests', function() {
    describe('POST /transaction', function() {
        it('should create a new transaction', function(done) {
            chai.request(app)
                .post('/transaction')
                .send({ amount: 100, desc: 'Groceries' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.message).to.equal('Transaction added successfully');
                    done();
                });
        });

        it('should return an error for invalid amount', function(done) {
            chai.request(app)
                .post('/transaction')
                .send({ amount: '', desc: 'Utilities' })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.error).to.equal('Invalid or empty amount provided.');
                    done();
                });
        });
    });

    describe('GET /transaction', function() {
        it('should return all transactions', function(done) {
            chai.request(app)
                .get('/transaction')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });

        it('should return an empty array when no transactions exist', function(done) {
            chai.request(app)
                .get('/transaction')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.deep.equal([]);
                    done();
                });
        });
    });

    // More tests for other endpoints...
});