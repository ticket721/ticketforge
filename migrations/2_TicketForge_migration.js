const TicketForge = artifacts.require("TicketForge");

module.exports = async function(deployer) {
    await deployer.deploy(TicketForge, 'Ticket', 'TICKET');
};
