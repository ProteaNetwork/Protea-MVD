// const TokenConference = artifacts.require("TokenConference");
// const ERC223Standard = artifacts.require("ERC223StandardToken");
// const CompliantToken = artifacts.require("CompliantToken");

// const fs = require('fs');

module.exports = function (deployer, network) {
    // const deployConfig = JSON.parse(fs.readFileSync('./config/deploy.json'));

    deployer.then(async () => {
        // await deployer.deploy(ERC223Standard, deployConfig.CompliantToken.name, deployConfig.CompliantToken.symbol,
        //     deployConfig.CompliantToken.decimals, deployConfig.CompliantToken.supply);
        // await deployer.deploy(TokenConference, deployConfig.tokenConference.name, deployConfig.tokenConference.deposit,
        //     deployConfig.tokenConference.limitOfParticipants, deployConfig.tokenConference.coolingPeriod, ERC223Standard.address,
        //     deployConfig.tokenConference.encryption);
    })
};