const ProteaToken = artifacts.require("ProteaToken");
const CommunityManager = artifacts.require("CommunityManager");

const fs = require('fs');

module.exports = function(deployer, network) {
    const deployConfig = JSON.parse(fs.readFileSync('./config/deploy.json'));

    async function setPost() {
        const protea = await ProteaToken.deployed();
        const CommunityManager = await CommunityManager.deployed();
    }

    deployer.then(async () => {
        await deployer.deploy(ProteaToken, deployConfig.protea.supply, deployConfig.protea.name, deployConfig.protea.decimals,
            deployConfig.protea.symbol);
        await deployer.deploy(CommunityManager, ProteaToken.address);
        
        await setPost();
    })
};
