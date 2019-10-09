const { ZERO } = require('./utils');

module.exports = {
    safeTransferFrom_unapproved: async function safeTransferFrom_unapproved(accounts, expect) {

        const TicketForgeArtifact = artifacts.require('TicketForge');
        const TicketForge = await TicketForgeArtifact.deployed();
        await TicketForge.createScope('t721', ZERO, [accounts[1]], []);

        const scope_infos = await TicketForge.getScope('t721');

        await TicketForge.methods['mint(address,uint256)'](accounts[0], scope_infos.scope_index.toNumber());

        await expect(TicketForge.methods['safeTransferFrom(address,address,uint256)'](accounts[0], accounts[1], 1, {from: accounts[2]})).to.eventually.be.rejectedWith('ERC721: transfer caller is not owner, approved or scope admin');

    }
}
