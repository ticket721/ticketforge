const { ZERO } = require('./utils');

module.exports = {
    create_scope: async function create_scope(accounts, expect) {

        const TicketForgeArtifact = artifacts.require('TicketForge');
        const TicketForge = await TicketForgeArtifact.deployed();

        await TicketForge.createScope('t721', ZERO, [accounts[1]]);

        await expect(TicketForge.getScope('t721')).to.eventually.deep.equal({
            '0': true,
            '1': '0x0000000000000000000000000000000000000000',
            exists: true,
            tokenuri_provider: '0x0000000000000000000000000000000000000000'
        });

        await expect(TicketForge.isScopeAdmin('t721', accounts[1])).to.eventually.equal(true);
        await expect(TicketForge.isScopeAdmin('t721', accounts[0])).to.eventually.equal(false);
        await expect(TicketForge.isScopeAdmin('t721', ZERO)).to.eventually.equal(false);

    }
}

