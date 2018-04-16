import expectThrow from './helpers/expectThrow';
var CompliantToken = artifacts.require('./CompliantToken.sol');
var TokenConference = artifacts.require('./TokenConference.sol');

const fs = require('fs');
const deployConfig = JSON.parse(fs.readFileSync('./config/deploy.json'));

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

// Variable destructuring on input
contract('TokenConference', (accounts) => {
    let compliantContract,
        tokenConference,
        tokenOwnerAddress,
        adminAddress,
        userAddress;

    beforeEach('Initial set up', async () => {
        tokenOwnerAddress = accounts[0];
        adminAddress = accounts[1];
        userAddress = accounts[2];

        compliantContract = await CompliantToken.new(initialSupply, name,
            decimalUnits, issuingAmount, tokenSymbol, {
                from: tokenOwnerAddress
            });
        tokenConference = await TokenConference.new(conferenceName, deposit, limitOfParticipants,
            coolingPeriod, compliantContract.address, encryption, {
                from: adminAddress
            })
    })

    describe("Event core testing", () => {
        it("should return the total balance balance", async () => {
            const balance = (await tokenConference.totalBalance()).toNumber();
            assert.isTrue(balance >= 0);
        });

        it("show user is not registered", async () => {
            const registered = await tokenConference.isRegistered(userAddress);
            assert.isFalse(registered, "user is already registered");
        })

        it("should register user when tokens deposited", async () => {
            await compliantContract.faucet({
                from: userAddress
            });
            let balance = (await compliantContract.balanceOf(userAddress)).toNumber();
            console.log(balance);
            const success = await compliantContract.transfer(tokenConference.address, deposit, {
                from: userAddress
            });

            const registered = await tokenConference.isRegistered(userAddress);
            assert.isTrue(registered, "user is not already registered");
        })
    })


});