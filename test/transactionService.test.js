const chai = require('chai');
const sinon = require('sinon');
const mysql = require('mysql2/promise');
const chaiAsPromised = require('chai-as-promised');

const TransactionService = require('../../TransactionService');

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('TransactionService', function() {
    let dbStub, queryStub;

    beforeEach(() => {
        queryStub = sinon.stub();
        dbStub = sinon.stub(mysql, 'createConnection').resolves({
            query: queryStub,
            end: async () => {}
        });
    });

    afterEach(() => {
        dbStub.restore();
    });

    describe('#addTransaction()', function() {

        it('should throw error if amount invalid', async () => {
            await expect(
                TransactionService.addTransaction('', 'Test')
            ).to.be.rejectedWith('Invalid or empty amount provided.');
        });

        it('should add transaction when valid', async () => {
            queryStub.resolves([{ affectedRows: 1 }]);

            const result = await TransactionService.addTransaction('100', 'Test');

            expect(result).to.equal(200);
        });

        it('should handle DB error', async () => {
            queryStub.rejects(new Error('DB error'));

            await expect(
                TransactionService.addTransaction('100', 'Test')
            ).to.be.rejectedWith('DB error');
        });
    });

    describe('#getAllTransactions()', function() {

        it('should return transactions', async () => {
            queryStub.resolves([[{ id: 1, amount: 100, description: 'Groceries' }], []]);

            const result = await TransactionService.getAllTransactions();

            expect(result).to.deep.equal([
                { id: 1, amount: 100, description: 'Groceries' }
            ]);
        });

        it('should return empty array', async () => {
            queryStub.resolves([[], []]);

            const result = await TransactionService.getAllTransactions();

            expect(result).to.deep.equal([]);
        });
    });

    describe('#findTransactionById()', function() {

        it('should return transaction by id', async () => {
            queryStub.resolves([[{ id: 1, amount: 100, description: 'Groceries' }], []]);

            const result = await TransactionService.findTransactionById(1);

            expect(result).to.deep.equal({
                id: 1,
                amount: 100,
                description: 'Groceries'
            });
        });

        it('should return null if not found', async () => {
            queryStub.resolves([[], []]);

            const result = await TransactionService.findTransactionById(999);

            expect(result).to.be.null;
        });
    });

    describe('#deleteAllTransactions()', function() {

        it('should delete all transactions', async () => {
            queryStub.resolves([{ affectedRows: 2 }]);

            const result = await TransactionService.deleteAllTransactions();

            expect(result).to.equal(2);
        });
    });

});