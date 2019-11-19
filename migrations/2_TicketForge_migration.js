const TicketForge = artifacts.require("TicketForge");
const config = require('../truffle-config');

module.exports = async function(deployer) {

    let name = 'Test Ticket Forge';
    let symbol = 'TTKT';

    if (config.args) {
        const args = config.args;
        if (args !== null) {
            name = args.ERC721.name;
            symbol = args.ERC721.symbol;
        }
    }

    await deployer.deploy(TicketForge, name, symbol);
};
