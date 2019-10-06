const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const {revert, snapshot} = require('../test_cases/utils');
chai.use(chaiAsPromised);

const expect = chai.expect;
contract('daiplus', (accounts) => {

    before(async () => {
        this.snap_id = await snapshot();
    });

    beforeEach(async () => {
        const status = await revert(this.snap_id);
        expect(status).to.be.true;
        this.snap_id = await snapshot();
    });

    it('holds a place', async () => {
        console.log('test');
    })

});
