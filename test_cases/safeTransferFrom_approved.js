const { ZERO } = require('./utils');

module.exports = {
    safeTransferFrom_approved: async function safeTransferFrom_approved(accounts, expect) {

        const TicketForgeArtifact = artifacts.require('TicketForge');
        const TicketForge = await TicketForgeArtifact.deployed();
        await TicketForge.createScope('t721', ZERO, [accounts[1]], []);

        const scope_infos = await TicketForge.getScope('t721');

        await TicketForge.mint(accounts[0], scope_infos.scope_index.toNumber());

        await TicketForge.approve(accounts[1], 1);
        await TicketForge.safeTransferFrom(accounts[0], accounts[1], 1, {from: accounts[1]});

        expect((await TicketForge.balanceOf(accounts[1])).toNumber()).to.equal(1);
        expect((await TicketForge.balanceOf(accounts[0])).toNumber()).to.equal(0);


    }
}
