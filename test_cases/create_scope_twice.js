const { ZERO } = require('./utils');

module.exports = {
    create_scope_twice: async function create_scope_twice(accounts, expect) {

        const TicketForgeArtifact = artifacts.require('TicketForge');
        const TicketForge = await TicketForgeArtifact.deployed();

        await TicketForge.createScope('t721', ZERO, [], []);

        await expect(TicketForge.createScope('t721', ZERO, [], [])).to.eventually.be.rejectedWith('TicketForge::createScope | scope name already in use');

    }
}

