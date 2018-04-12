import expectThrow from './helpers/expectThrow';
var CompliantToken = artifacts.require('./CompliantToken.sol');



const initialSupply = 20000000;
const name = "Faucet223"
const decimalUnits = 2;
const issuingAmount = 200;
const tokenSymbol = "FTC";

// Variable destructuring on input
contract('CompliantToken', (accounts) => {
  let compliantContract;

  beforeEach('setup contract for each test', async () => {
    compliantContract = await CompliantToken.new(initialSupply, name, decimalUnits, issuingAmount, tokenSymbol)
  })

  describe("Compliant Token Functions", () => {
    it("should return a balance", async () => {
      const balance = (await compliantContract.balanceOf(accounts[0])).toNumber();
      assert.isTrue(balance >= 0);
    });

    it("should issue an initial token balance", async () => {
      let balance = (await compliantContract.balanceOf(accounts[1])).toNumber();
      assert.isTrue(balance === 0);

      await compliantContract.faucet({
        from: accounts[1]
      });
      balance = (await compliantContract.balanceOf(accounts[1])).toNumber();

      assert.isTrue(balance >= issuingAmount);
    });

    it("should reject the request", async () => {
      await compliantContract.faucet({
        from: accounts[1]
      });
      let balance = (await compliantContract.balanceOf(accounts[1])).toNumber();
      await expectThrow(compliantContract.faucet({
        from: accounts[1]
      }))
    });
  })


});