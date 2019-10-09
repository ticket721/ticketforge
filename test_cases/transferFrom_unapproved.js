const { ZERO } = require('./utils');

module.exports = {
    transferFrom_unapproved: async function transferFrom_unapproved(accounts, expect) {

        const TicketForgeArtifact = artifacts.require('TicketForge');
        const TicketForge = await TicketForgeArtifact.deployed();
        await TicketForge.createScope('t721', ZERO, [accounts[1]]);

        const scope_infos = await TicketForge.getScope('t721');

        await TicketForge.mint(accounts[0], scope_infos.scope_index.toNumber());

        await expect(TicketForge.transferFrom(accounts[0], accounts[1], 1, {from: accounts[2]})).to.eventually.be.rejectedWith('ERC721: transfer caller is not owner, approved or scope admin');

    }
}
