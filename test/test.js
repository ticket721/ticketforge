const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const {revert, snapshot} = require('../test_cases/utils');
chai.use(chaiAsPromised);

const { create_scope } = require('../test_cases/create_scope');
const { create_scope_uppercase } = require('../test_cases/create_scope_uppercase');
const { create_scope_empty } = require('../test_cases/create_scope_empty');
const { create_scope_twice } = require('../test_cases/create_scope_twice');

const expect = chai.expect;
contract('ticketforge', (accounts) => {

    before(async () => {
        this.snap_id = await snapshot();
    });

    beforeEach(async () => {
        const status = await revert(this.snap_id);
        expect(status).to.be.true;
        this.snap_id = await snapshot();
    });

    it('create scope', create_scope.bind(null, accounts, expect));
    it('create scope with uppercase letter', create_scope_uppercase.bind(null, accounts, expect));
    it('create scope with empty name', create_scope_empty.bind(null, accounts, expect));
    it('create scope twice', create_scope_twice.bind(null, accounts, expect));

});
