const { ZERO } = require('./utils');

module.exports = {
    symbol: async function symbol(accounts, expect) {

        const TicketForgeArtifact = artifacts.require('TicketForge');
        const TicketForge = await TicketForgeArtifact.deployed();

        expect(await TicketForge.symbol()).to.equal('TICKET');

    }
}
