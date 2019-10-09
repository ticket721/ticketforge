const { ZERO } = require('./utils');

module.exports = {
    safeTransferFrom_data_approved: async function safeTransferFrom_data_approved(accounts, expect) {

        const TicketForgeArtifact = artifacts.require('TicketForge');
        const TicketForge = await TicketForgeArtifact.deployed();
        await TicketForge.createScope('t721', ZERO, [accounts[1]], []);

        const ValidERC721ReceiverArtifact = artifacts.require('ValidERC721Receiver');
        const ValidERC721Receiver = await ValidERC721ReceiverArtifact.new();

        const scope_infos = await TicketForge.getScope('t721');

        await TicketForge.methods['mint(address,uint256)'](accounts[0], scope_infos.scope_index.toNumber());

        await TicketForge.approve(accounts[1], 1);
        await TicketForge.methods['safeTransferFrom(address,address,uint256,bytes)'](accounts[0], ValidERC721Receiver.address, 1, '0xabcd', {from: accounts[1]});

        expect((await TicketForge.balanceOf(ValidERC721Receiver.address)).toNumber()).to.equal(1);
        expect((await TicketForge.balanceOf(accounts[0])).toNumber()).to.equal(0);


    }
}
