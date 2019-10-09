const { ZERO } = require('./utils');

module.exports = {
    mint_token_uri: async function mint_token_uri(accounts, expect) {

        const TicketForgeArtifact = artifacts.require('TicketForge');
        const TicketForge = await TicketForgeArtifact.deployed();
        await TicketForge.createScope('t721', ZERO, [accounts[1]], []);

        const scope_infos = await TicketForge.getScope('t721');

        await TicketForge.methods['mint(address,uint256,string)'](accounts[0], scope_infos.scope_index.toNumber(), 'hello');

        expect((await TicketForge.balanceOf(accounts[0])).toNumber()).to.equal(1);
        expect((await TicketForge.tokenURI(1))).to.equal('hello');
        expect(TicketForge.tokenURI(2)).to.eventually.be.rejectedWith('ERC721Metadata: URI query for nonexistent token');

    }
}
