const web3Abi = require('web3-eth-abi');
import expectThrow from './helpers/expectThrow';
var ERC223StandardToken = artifacts.require('./ERC223StandardToken.sol');
var TokenConference = artifacts.require('./TokenConference.sol');

const web3 = TokenConference.web3;

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
    let erc223Contract,
        tokenConference,
        tokenOwnerAddress,
        adminAddress,
        userAddress;

    tokenOwnerAddress = accounts[0];
    adminAddress = accounts[1];
    userAddress = accounts[2];

    beforeEach('Initial set up', async () => {
        erc223Contract = await ERC223StandardToken.new(name, tokenSymbol, decimalUnits, initialSupply, issuingAmount, {
            from: tokenOwnerAddress
        });
        tokenConference = await TokenConference.new(conferenceName, deposit, limitOfParticipants,
            coolingPeriod, erc223Contract.address, encryption, {
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
            // https://beresnev.pro/test-overloaded-solidity-functions-via-truffle/
            // Truffle unable to use overloaded functions, assuming target overload is last entry to the contract
            // Possible upgrade, include lodash to dynamically load abi function
            let targetAbi = erc223Contract.contract.abi[erc223Contract.contract.abi.length - 1];
            // 
            // Giving user some tokens, replace with Faucet
            await erc223Contract.faucet({
                from: userAddress
            });

            // Confirm send
            let balance = (await erc223Contract.balanceOf(userAddress)).toNumber();
            assert.isTrue(balance === issuingAmount, "faucet has not issued tokens");


            // Begin creating custom transaction call
            const transferMethodTransactionData = web3Abi.encodeFunctionCall(
                targetAbi, [
                    tokenConference.address,
                    issuingAmount,
                    web3.toHex("0x00aaff")
                ]
            );

            await web3.eth.sendTransaction({
                from: userAddress,
                gas: 170000,
                to: erc223Contract.address,
                data: transferMethodTransactionData,
                value: 0
            });

            let conferenceBalance = (await erc223Contract.balanceOf(tokenConference.address)).toNumber();
            assert.isTrue(conferenceBalance === issuingAmount, "Transfer to contract failed");

            const registered = await tokenConference.isRegistered(userAddress);

            assert.isTrue(registered, "deposit failed to RSVP");
        });

        it("should end event and pay out 1 attendee", async () => {
            // https://beresnev.pro/test-overloaded-solidity-functions-via-truffle/
            // Truffle unable to use overloaded functions, assuming target overload is last entry to the contract
            // Possible upgrade, include lodash to dynamically load abi function
            let targetAbi = erc223Contract.contract.abi[erc223Contract.contract.abi.length - 1];
            // 
            // Giving user some tokens, replace with Faucet
            await erc223Contract.faucet({
                from: userAddress
            });

            // Confirm send
            let balance = (await erc223Contract.balanceOf(userAddress)).toNumber();
            assert.isTrue(balance === issuingAmount, "faucet has not issued tokens");


            // Begin creating custom transaction call
            const transferMethodTransactionData = web3Abi.encodeFunctionCall(
                targetAbi, [
                    tokenConference.address,
                    issuingAmount,
                    web3.toHex("0x00aaff")
                ]
            );

            await web3.eth.sendTransaction({
                from: userAddress,
                gas: 170000,
                to: erc223Contract.address,
                data: transferMethodTransactionData,
                value: 0
            });

            let conferenceBalance = (await erc223Contract.balanceOf(tokenConference.address)).toNumber();
            assert.isTrue(conferenceBalance === issuingAmount, "Transfer to contract failed");

            const registered = await tokenConference.isRegistered(userAddress);

            assert.isTrue(registered, "deposit failed to RSVP");

            await tokenConference.attend([userAddress], {
                from: adminAddress
            });
            await tokenConference.payback({
                from: adminAddress
            });
            await tokenConference.withdraw({
                from: userAddress
            });
        })
    })


});