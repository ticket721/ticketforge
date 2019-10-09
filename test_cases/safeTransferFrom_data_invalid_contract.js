const { ZERO } = require('./utils');

module.exports = {
    safeTransferFrom_data_invalid_contract: async function safeTransferFrom_data_invalid_contract(accounts, expect) {

        const TicketForgeArtifact = artifacts.require('TicketForge');
        const TicketForge = await TicketForgeArtifact.deployed();
        await TicketForge.createScope('t721', ZERO, [accounts[1]]);

        const InvalidERC721ReceiverArtifact = artifacts.require('InvalidERC721Receiver');
        const InvalidERC721Receiver = await InvalidERC721ReceiverArtifact.new();

        const scope_infos = await TicketForge.getScope('t721');

        await TicketForge.mint(accounts[0], scope_infos.scope_index.toNumber());

        await expect(TicketForge.methods['safeTransferFrom(address,address,uint256,bytes)'](accounts[0], InvalidERC721Receiver.address, 1, '0xabcd')).to.eventually.be.rejectedWith('ERC721: transfer to non ERC721Receiver implementer');


    }
}
