const { ZERO } = require('./utils');

module.exports = {
    mint: async function mint(accounts, expect) {

        const TicketForgeArtifact = artifacts.require('TicketForge');
        const TicketForge = await TicketForgeArtifact.deployed();
        await TicketForge.createScope('t721', ZERO, [accounts[1]]);

        const scope_infos = await TicketForge.getScope('t721');

        await TicketForge.mint(accounts[0], scope_infos.scope_index.toNumber());

        expect((await TicketForge.balanceOf(accounts[0])).toNumber()).to.equal(1);

    }
}
