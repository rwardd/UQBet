// This is an example test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");
const { ethers, waffle } = require("hardhat")

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("Token contract", function () {
  // Mocha has four functions that let you hook into the the test runner's
  // lifecycle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  let Token;
  let poolContract;
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let prov = waffle.provider;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    undeployed = await ethers.getContractFactory("BettingPool");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    poolContract = await undeployed.deploy();

    // We can interact with the contract by calling `poolContract.method()`
    await poolContract.deployed();
  });

  // You can nest describe calls to create subsections.
  describe("Deployment",  function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    it("Should test for account balances", async function() {
      let balance = await prov.getBalance(owner.address)
      console.log("Balance", balance);
    });

  });

  describe("Transactions", function () {
    it("Should test pool A deposit", async function () {
      // Transfer 50 tokens from owner to addr1
      await poolContract.connect(addr1).depositToA(ethers.utils.parseEther("5"), {value: ethers.utils.parseEther("5")});
      let poolABalance = await poolContract.getPoolA();

      console.log(poolABalance)
      let aval = await prov.getBalance(addr1.address);
      console.log(aval);
    });

    it("Should test withdrawal", async function () {
      await poolContract.connect(addr1).depositToA(ethers.utils.parseEther("5"), {value: ethers.utils.parseEther("5")});

      let contractBalance = await prov.getBalance(poolContract.address);
      console.log("Contract Bal:", contractBalance);
      contractBalance = await poolContract.getBalance();
      console.log(contractBalance)
      await poolContract.withdrawToOwner(ethers.utils.parseEther("4"));
      let poolABalance = await poolContract.getPoolA();
      console.log(poolABalance);
      let ownerVal = await prov.getBalance(owner.address);
      console.log(ownerVal);
    });

    xit("Should update balances after transfers", async function () {
      const initialOwnerBalance = await poolContract.balanceOf(
        owner.address
      );

      // Transfer 100 tokens from owner to addr1.
      await poolContract.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await poolContract.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await poolContract.balanceOf(
        owner.address
      );
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150);

      const addr1Balance = await poolContract.balanceOf(
        addr1.address
      );
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await poolContract.balanceOf(
        addr2.address
      );
      expect(addr2Balance).to.equal(50);
    });
  });
});
