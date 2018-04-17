const web3Abi = require('web3-eth-abi');


// import expectThrow from './helpers/expectThrow';
var ERC223Contract = artifacts.require('./ERC223StandardToken.sol');
var ERC223Receiver = artifacts.require('./TokenConference.sol');
const web3 = ERC223Receiver.web3;

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
contract('ERC223Standard', (accounts) => {
    let erc223Contract,
        tokenOwnerAddress,
        adminAddress,
        userAddress;

    tokenOwnerAddress = accounts[0];
    adminAddress = accounts[1];
    userAddress = accounts[2];
    beforeEach('setup contract for each test', async () => {
        erc223Contract = await ERC223Contract.new(name, tokenSymbol, decimalUnits, initialSupply, {
            from: tokenOwnerAddress
        })
    })

    describe("Compliant Token Functions", () => {
        it("should return a balance", async () => {
            const balance = (await erc223Contract.balanceOf(tokenOwnerAddress)).toNumber();
            assert.isTrue(balance >= 0, "contract has not deployed correctly");
        });

        // it("should issue an initial token balance", async () => {
        //   let balance = (await erc223Contract.balanceOf(accounts[1])).toNumber();
        //   assert.isTrue(balance === 0, "account already has tokens");

        //   await compliantContract.faucet({
        //     from: accounts[1]
        //   });
        //   balance = (await compliantContract.balanceOf(accounts[1])).toNumber();

        //   assert.isTrue(balance >= issuingAmount, "faucet has not issued tokens");
        // });


        it("should transfer tokens with data", async () => {
            let receiverContract = await ERC223Receiver.new(conferenceName, deposit, limitOfParticipants,
                coolingPeriod, erc223Contract.address, encryption, {
                from: adminAddress
            });

            // https://beresnev.pro/test-overloaded-solidity-functions-via-truffle/
            // Truffle unable to use overloaded functions, assuming target overload is last entry to the contract
            // Possible upgrade, include lodash to dynamically load abi function
            let targetAbi = erc223Contract.contract.abi[erc223Contract.contract.abi.length - 1];

            // Giving user some tokens, replace with Faucet
            await erc223Contract.transfer(userAddress, issuingAmount, {
                from: tokenOwnerAddress
            });

            // Confirm send
            let balance = (await erc223Contract.balanceOf(userAddress)).toNumber();
            assert.isTrue(balance >= issuingAmount);

            // Begin creating custom transaction call
            const transferMethodTransactionData = web3Abi.encodeFunctionCall(
                targetAbi,
                [
                    receiverContract.address,
                    issuingAmount,
                    web3.toHex("0x00aaff")
                ]
            );
            await web3.eth.sendTransaction({from: userAddress, to: erc223Contract.address, data: transferMethodTransactionData, value: 0});

            let conferenceBalance = (await erc223Contract.balanceOf(receiverContract.address)).toNumber();
            assert.isTrue(conferenceBalance >= issuingAmount);
        });
    })


});