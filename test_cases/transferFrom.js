const { ZERO } = require('./utils');

module.exports = {
    transferFrom: async function transferFrom(accounts, expect) {

        const TicketForgeArtifact = artifacts.require('TicketForge');
        const TicketForge = await TicketForgeArtifact.deployed();
        await TicketForge.createScope('t721', ZERO, [accounts[1]], []);

        const scope_infos = await TicketForge.getScope('t721');

        await TicketForge.mint(accounts[0], scope_infos.scope_index.toNumber());

        await TicketForge.transferFrom(accounts[0], accounts[1], 1);

        expect((await TicketForge.balanceOf(accounts[1])).toNumber()).to.equal(1);
        expect((await TicketForge.balanceOf(accounts[0])).toNumber()).to.equal(0);


    }
}
