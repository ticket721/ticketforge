const { ZERO } = require('./utils');

module.exports = {
    safeTransferFrom_data_unapproved: async function safeTransferFrom_data_unapproved(accounts, expect) {

        const TicketForgeArtifact = artifacts.require('TicketForge');
        const TicketForge = await TicketForgeArtifact.deployed();
        await TicketForge.createScope('t721', ZERO, [accounts[1]]);

        const ValidERC721ReceiverArtifact = artifacts.require('ValidERC721Receiver');
        const ValidERC721Receiver = await ValidERC721ReceiverArtifact.new();

        const scope_infos = await TicketForge.getScope('t721');

        await TicketForge.mint(accounts[0], scope_infos.scope_index.toNumber());

        await expect(TicketForge.methods['safeTransferFrom(address,address,uint256,bytes)'](accounts[0], ValidERC721Receiver.address, 1, '0xabcd', {from: accounts[2]})).to.eventually.be.rejectedWith('ERC721: transfer caller is not owner, approved or scope admin');

    }
}
