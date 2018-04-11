const ETHConference = artifacts.require("ETHConference");
const CompliantToken = artifacts.require("CompliantToken");

const fs = require('fs');

module.exports = function (deployer, network) {
    const deployConfig = JSON.parse(fs.readFileSync('./config/deploy.json'));

    deployer.then(async () => {
        await deployer.deploy(ProteaToken, deployConfig.protea.supply, deployConfig.protea.name, deployConfig.protea.decimals,
            deployConfig.protea.symbol);
        await deployer.deploy(CommunityManager, ProteaToken.address);
    })
};