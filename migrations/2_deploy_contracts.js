const ETHConference = artifacts.require("ETHConference");
const TokenConference = artifacts.require("TokenConference");
const CompliantToken = artifacts.require("CompliantToken");

const fs = require('fs');

module.exports = function (deployer, network) {
    const deployConfig = JSON.parse(fs.readFileSync('./config/deploy.json'));

    deployer.then(async () => {
        await deployer.deploy(CompliantToken, deployConfig.CompliantToken.supply, deployConfig.CompliantToken.name, 
            deployConfig.CompliantToken.decimals, deployConfig.CompliantToken.deposit, deployConfig.CompliantToken.symbol);
        await deployer.deploy(TokenConference, deployConfig.tokenConference.name, deployConfig.tokenConference.deposit, 
            deployConfig.tokenConference.limitOfParticipants, deployConfig.tokenConference.coolingPeriod, CompliantToken.address, 
            deployConfig.tokenConference.encryption);
    })
};