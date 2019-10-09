const { ZERO } = require('./utils');

module.exports = {
    name: async function name(accounts, expect) {

        const TicketForgeArtifact = artifacts.require('TicketForge');
        const TicketForge = await TicketForgeArtifact.deployed();

        expect(TicketForge.name()).to.eventually.equal('Ticket');


    }
}
