// File: test/unit/transactionService.test.js
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const mysql = require('mysql2/promise');
const TransactionService = require('../TransactionService');

chai.use(require('chai-as-promised'));

describe('TransactionService', function() {
    let dbStub, queryStub;

    beforeEach(() => {
        queryStub = sinon.stub();
        dbStub = sinon.stub(mysql, 'createConnection').resolves({
            query: queryStub,
            end: () => {}
        });
    });

    afterEach(() => {
        dbStub.restore();
    });

    describe('#addTransaction()', function() {
        it('should throw an error if amount is invalid', async () => {
            await expect(TransactionService.addTransaction('', 'Test description')).to.eventually.be.rejectedWith('Invalid or empty amount provided.');
        });

        it('should add a transaction when valid inputs are provided', async () => {
            queryStub.resolves([{ affectedRows: 1 }]);
            await expect(TransactionService.addTransaction('100', 'Test transaction')).to.eventually.equal(200);
        });

        it('should handle database errors during add operation', async () => {
            queryStub.rejects(new Error('DB error'));
            await expect(TransactionService.addTransaction('100', 'Test transaction')).to.eventually.be.rejectedWith('DB error');
        });
    });

    describe('#getAllTransactions()', function() {
        it('should return an array of transactions', async () => {
            queryStub.resolves([[{ id: 1, amount: 100, description: 'Groceries' }], []]);
            const result = await TransactionService.getAllTransactions();
            expect(result).to.deep.equal([{ id: 1, amount: 100, description: 'Groceries' }]);
        });

        it('should return an empty array when no transactions exist', async () => {
            queryStub.resolves([[], []]);
            const result = await TransactionService.getAllTransactions();
            expect(result).to.deep.equal([]);
        });
    });

    describe('#findTransactionById()', function() {
        it('should retrieve a transaction by ID', async () => {
            queryStub.resolves([[{ id: 1, amount: 100, description: 'Groceries' }], []]);
            const result = await TransactionService.findTransactionById(1);
            expect(result).to.deep.equal({ id: 1, amount: 100, description: 'Groceries' });
        });

        it('should return null if the transaction does not exist', async () => {
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