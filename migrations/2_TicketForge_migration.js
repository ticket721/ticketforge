const TicketForge = artifacts.require("TicketForge");
const config = require('../truffle-config');

module.exports = async function(deployer) {

    let name = 'Test Ticket Forge';
    let symbol = 'TTKT';

    if (config.extra_config && config.extra_config.external_modules && config.extra_config.external_modules.ticketforge) {
        const arguments = config.extra_config.external_modules.ticketforge.arguments;
        if (arguments !== null) {
            name = arguments[0];
            symbol = arguments[1];
        }
    }

    console.log(name, symbol);
    await deployer.deploy(TicketForge, name, symbol);
};
