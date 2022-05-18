// This is an example test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers, waffle, hardhatArguments } = require("hardhat")

describe("BetContract contract", function () {

    let betContract;
    let owner;
    let addr1;
    let addr2;
    let addr3;
    let addr4;
    let addr5;
    let addr6;
    let addrs;
    let prov = waffle.provider;

    beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        undeployed = await ethers.getContractFactory("BetContract");
        [owner, addr1, addr2, addr3, addr4, addr5, addr6, ...addrs] = await ethers.getSigners();
    
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
        });

        it("Should set the correct owner", async function(){
            expect(await betContract.owner()).to.equal(owner.address);
        });
    });

    describe("Fixture", function () {

        it("Should be able to create multiple new Fixtures", async function() {
            //Ensure Fixture Count is initialised
            expect(await betContract.getFixtureCount()).to.equal(0);
            
            //Test adding of first Fixture
            await betContract.addFixture("Red Sox","White Sox", "14 May 22");
            expect((await betContract.getFixture(0)).fixId).to.equal(0);
            expect((await betContract.getFixture(0)).home).to.equal("Red Sox");
            expect((await betContract.getFixture(0)).away).to.equal("White Sox");
            expect((await betContract.getFixture(0)).date).to.equal("14 May 22");
            expect((await betContract.getFixture(0)).active).to.equal(true);
            expect((await betContract.getFixture(0)).invalidated).to.equal(false);
            
            //Ensure Fixture Count is incremented
            expect(await betContract.getFixtureCount()).to.equal(1);
            
            //Test adding of second Fixture
            await betContract.addFixture("Angels", "Dodgers", "15 May 22");
            expect((await betContract.getFixture(1)).fixId).to.equal(1);
            expect((await betContract.getFixture(1)).home).to.equal("Angels");
            expect((await betContract.getFixture(1)).away).to.equal("Dodgers");
            expect((await betContract.getFixture(1)).date).to.equal("15 May 22");
            expect((await betContract.getFixture(1)).active).to.equal(true);
            expect((await betContract.getFixture(1)).invalidated).to.equal(false);
            
            //Ensure Fixture Count is incremented
            expect(await betContract.getFixtureCount()).to.equal(2);

            //Ensure list of fixture IDs are updated
            expect((await betContract.getFixtures())[0]).to.equal(0);
            expect((await betContract.getFixtures())[1]).to.equal(1);
        });

        it("Should not be able to create a Fixture as a non-owner", async function() {
            await expect(betContract.connect(addr1).addFixture("Red Sox","White Sox", "14 May 22"))
                .to.be.revertedWith("Only UQ Sports Administration can add Fixtures");
        });

        it("Should not be able to create duplicate Fixtures", async function() {
            await betContract.addFixture("Red Sox","White Sox", "14 May 22");
            await expect(betContract.addFixture("Red Sox","White Sox", "14 May 22"))
            .to.be.revertedWith("Duplicate Fixture");
        });
    });

    describe("Bet", function () {
        it("Should not be able to place a bet as owner", async function() {
            await betContract.addFixture("Red Sox","White Sox", "14 May 22");
            await expect(betContract.placeBet(0, "Red Sox", 50)).to.be.revertedWith("UQ Sports Administration cannot place bets");
            
        });
        
        it("Should not be able to place a bet on invalid fixture", async function() {
            await expect(betContract.connect(addr1).placeBet(0, "Galaxy", 50, {value: 50})).to.be.revertedWith("Not a valid Bet");    
        });

        it("Amount bet should be greater than 0", async function() {
            await betContract.addFixture("Red Sox","White Sox", "14 May 22");
            await expect(betContract.connect(addr1).placeBet(0, "Red Sox", 0)).to.be.revertedWith("Bet amount must be greater than 0");
        });

        it("Should be able to place valid bet as punter", async function() {
            //Contract should have no funds
            expect(await prov.getBalance(betContract.address)).to.equal(0);

            //Add a Fixture to bet on
            await betContract.addFixture("Red Sox","White Sox", "14 May 22");

            //Ensure Bet counter is initialised
            expect(await betContract.getBetCounter()).to.equal(0);

            //Place Bet
            await betContract.connect(addr1).placeBet(0, "Red Sox", 50, {value: 50});
            expect((await betContract.getBet((await (await betContract.getFixture(0)).bets)[0])).betId).to.equal(0);
            expect((await betContract.getBet((await (await betContract.getFixture(0)).bets)[0])).fixId).to.equal(0);
            expect((await betContract.getBet((await (await betContract.getFixture(0)).bets)[0])).punter).to.equal(addr1.address);
            expect((await betContract.getBet((await (await betContract.getFixture(0)).bets)[0])).team).to.equal("Red Sox");
            expect((await betContract.getBet((await (await betContract.getFixture(0)).bets)[0])).amount).to.equal(50);

            //Contract should hold bet amount
            expect(await prov.getBalance(betContract.address)).to.equal(50);

            //Ensure Bet Counter has been incremented
            expect(await betContract.getBetCounter()).to.equal(1);
        });
    });

    describe("Set Winner", function () {

        it("Should not be able to set winners as non-owner", async function() {
            await betContract.addFixture("Red Sox","White Sox", "14 May 22");
            await expect(betContract.connect(addr1).setWinner(0, "Red Sox")).to.be.revertedWith("Only UQ Sports Administration can set the winner");
        });

        it("Owner should be able to set winner of valid game, bets should reflect won", async function() {
            await betContract.addFixture("Red Sox","White Sox", "14 May 22");
            await betContract.connect(addr1).placeBet(0, "Red Sox", 50, {value: 50});
            await betContract.connect(addr2).placeBet(0, "White Sox", 50, {value: 50});
            await betContract.setWinner(0, "Red Sox");
            expect(((await betContract.getBet(0)).payOut).gte(0)).to.equal(true);
            expect(((await betContract.getBet(1)).payOut).lt(0)).to.equal(true);
        });

        it("Owner should be able to set invalid game, bets should all reflect won", async function() {
            await betContract.addFixture("Red Sox","White Sox", "14 May 22");
            await betContract.connect(addr1).placeBet(0, "Red Sox", 50, {value: 50});
            await betContract.connect(addr2).placeBet(0, "White Sox", 50, {value: 50});
            await betContract.setInvalidated(0);
            expect(((await betContract.getBet(0)).payOut).gte(0)).to.equal(true);
            expect(((await betContract.getBet(1)).payOut).gte(0)).to.equal(true);
        });

    });

    describe("Payout", function () {

        it("Should allow users to withdraw winnings", async function() {
            await betContract.addFixture("Red Sox","White Sox", "14 May 22");
            await betContract.addFixture("Angels","Dodgers", "15 May 22");
            await betContract.connect(addr5).placeBet(1, "Angels", 1000000000000000000n, {value: 1000000000000000000n});
            console.log("Before Bet: ", await prov.getBalance(betContract.address));
            await betContract.connect(addr1).placeBet(0, "Red Sox", 50, {value: 50});
            await betContract.connect(addr2).placeBet(0, "Red Sox", 100, {value: 100});
            await betContract.connect(addr3).placeBet(0, "White Sox", 500, {value: 500});
            await betContract.connect(addr4).placeBet(0, "White Sox", 500, {value: 500});
            console.log("After Bet: ", await prov.getBalance(betContract.address));
            await betContract.setWinner(0, "Red Sox");
            await betContract.connect(addr1).retrieveFunds(1);
            await betContract.connect(addr2).retrieveFunds(2);
            console.log("After Payout: ", await prov.getBalance(betContract.address));
        });

        it("Should allow users to withdraw bet on invalid match", async function() {
            await betContract.addFixture("Red Sox","White Sox", "14 May 22");
            await betContract.addFixture("Angels","Dodgers", "15 May 22");
            await betContract.connect(addr5).placeBet(1, "Angels", 1000000000000000000n, {value: 1000000000000000000n});
            console.log("Before Bet: ", await prov.getBalance(betContract.address));
            await betContract.connect(addr1).placeBet(0, "Red Sox", 50, {value: 50});
            await betContract.connect(addr2).placeBet(0, "Red Sox", 100, {value: 100});
            await betContract.connect(addr3).placeBet(0, "White Sox", 500, {value: 500});
            await betContract.connect(addr4).placeBet(0, "White Sox", 500, {value: 500});
            console.log("After Bet: ", await prov.getBalance(betContract.address));
            await betContract.setInvalidated(0);
            await betContract.connect(addr1).retrieveFunds(1);
            await betContract.connect(addr2).retrieveFunds(2);
            await betContract.connect(addr3).retrieveFunds(3);
            await betContract.connect(addr4).retrieveFunds(4);
            console.log("After Payout: ", await prov.getBalance(betContract.address));
        });
    });
});