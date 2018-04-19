const TokenConference = artifacts.require("TokenConference");
const ERC223Standard = artifacts.require("ERC223StandardToken");

const fs = require('fs');
const deployConfig = JSON.parse(fs.readFileSync('../config/deploy.json'));


const initialSupply = deployConfig.CompliantToken.initialSupply;
const name = deployConfig.CompliantToken.name;
const decimalUnits = deployConfig.CompliantToken.decimals;
const issuingAmount = deployConfig.CompliantToken.issuingAmount;
const tokenSymbol = deployConfig.CompliantToken.symbol;

const conferenceName = deployConfig.tokenConference.name;
const deposit = deployConfig.tokenConference.deposit;
const limitOfParticipants = deployConfig.tokenConference.limitOfParticipants;
const coolingPeriod = deployConfig.tokenConference.coolingPeriod;
const encryption = deployConfig.tokenConference.encryption;


module.exports = function (deployer, network, accounts) {
    deployer.deploy(ERC223Standard,name, tokenSymbol, decimalUnits, initialSupply, issuingAmount,{from: accounts[0]}).then(() => {
        return deployer.deploy(TokenConference, conferenceName, deposit, limitOfParticipants,
            coolingPeriod, ERC223Standard.address, encryption, {from: accounts[1]}) 
    })
};