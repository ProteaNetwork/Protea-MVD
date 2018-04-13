import expectThrow from './helpers/expectThrow';
var CompliantToken = artifacts.require('./CompliantToken.sol');

const fs = require('fs');
const deployConfig = JSON.parse(fs.readFileSync('./config/deploy.json'));


const initialSupply = deployConfig.CompliantToken.initialSupply;
const name = deployConfig.CompliantToken.name;
const decimalUnits =  deployConfig.CompliantToken.decimals;
const issuingAmount = deployConfig.CompliantToken.issuingAmount;
const tokenSymbol = deployConfig.CompliantToken.symbol;

// Variable destructuring on input
contract('CompliantToken', (accounts) => {
  let compliantContract;

  beforeEach('setup contract for each test', async () => {
    compliantContract = await CompliantToken.new(initialSupply, name, decimalUnits, issuingAmount, tokenSymbol)
  })

  describe("Compliant Token Functions", () => {
    it("should return a balance", async () => {
      const balance = (await compliantContract.balanceOf(accounts[0])).toNumber();
      assert.isTrue(balance >= 0, "contract has not deployed correctly");
    });

    it("should issue an initial token balance", async () => {
      let balance = (await compliantContract.balanceOf(accounts[1])).toNumber();
      assert.isTrue(balance === 0, "account already has tokens");

      await compliantContract.faucet({
        from: accounts[1]
      });
      balance = (await compliantContract.balanceOf(accounts[1])).toNumber();

      assert.isTrue(balance >= issuingAmount, "faucet has not issued tokens");
    });

    it("should reject the request", async () => {
      await compliantContract.faucet({
        from: accounts[1]
      });
      await expectThrow(compliantContract.faucet({
        from: accounts[1]
      }))
    });

    // it("should transfer tokens with data", async () => {
    //   await compliantContract.transfer(accounts[0], 200, );
    //   let balance = (await compliantContract.balanceOf(accounts[1])).toNumber();
    //   assert.isTrue(balance >= issuingAmount);
    // });
  })


});