const { ZERO } = require('./utils');

module.exports = {
    tokenUriProvider: async function tokenUriProvider(accounts, expect) {

        const TokenUriProviderExampleArtifacts = artifacts.require('TokenUriProviderExample');
        const TokenUriProviderExample = await TokenUriProviderExampleArtifacts.new();

        const TicketForgeArtifact = artifacts.require('TicketForge');
        const TicketForge = await TicketForgeArtifact.deployed();
        await TicketForge.createScope('t721', TokenUriProviderExample.address, [accounts[1]], []);

        const scope_infos = await TicketForge.getScope('t721');

        await TicketForge.methods['mint(address,uint256)'](accounts[0], scope_infos.scope_index.toNumber());

        expect((await TicketForge.balanceOf(accounts[0])).toNumber()).to.equal(1);
        expect((await TicketForge.tokenURI(1))).to.equal('salut');

    }
}
