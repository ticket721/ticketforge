const DevDai = artifacts.require("DevDai");

module.exports = async function(deployer) {
    let dai_contract_address = null;

    await deployer.deploy(DevDai);
};
