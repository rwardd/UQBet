// This is an example test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

const { expect } = require("chai");
const { ethers, waffle } = require("hardhat")

describe("BetContract contract", function () {

    let Token;
    let betContract;
    let owner;
    let addr1;
    let addr2;
    let addrs;
    let prov = waffle.provider;

    beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        undeployed = await ethers.getContractFactory("BetContract");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    
        // To deploy our contract, we just have to call Token.deploy() and await
        // for it to be deployed(), which happens onces its transaction has been
        // mined.
        betContract = await undeployed.deploy();
    
        // We can interact with the contract by calling `poolContract.method()`
        await betContract.deployed();
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

});