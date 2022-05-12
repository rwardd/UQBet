pragma solidity ^0.8.0;
//pragma experimental ABIEncoderV2;

import "hardhat/console.sol";

contract BetContract {

    struct Fixture {
        uint fixId;
        string home;
        string away;
        string date;
        bool active;
        bool payedOut;
        bool invalidated;
        uint[] bets;
    }

    struct Bet {
        uint betId;
        uint fixId;
        address punter; // we are going to assume that only EOA wallets can be punters
        string team;
        uint amount;
        bool won;
    }

    address public owner;
    uint fixtureCounter;
    uint betCounter;
    uint uqSportsCut;
    bool locked;
    
    mapping(uint => Fixture) fixtures;
    mapping(uint => Bet) allBets;

    uint[] betIdList;
    uint[] fixtureIdList;

    /**
     * Contract initialization.
     */
    constructor() {
        owner = msg.sender;
        fixtureCounter = 0;
        betCounter = 0;
        uqSportsCut = 1;
        locked = false;
    }

    /**
     * A function that adds a fixture.
     *
     * @param _home the home team
     * @param _away the away team
     * @param _date the date of the match
     */
    function addFixture(string memory _home, string memory _away, string memory _date) public {
        require(msg.sender == owner, "Only UQ Sports Administration can add Fixtures");
        Fixture memory newFixture = fixtures[fixtureCounter++];
        newFixture.fixId = (fixtureCounter - 1);
        newFixture.home = _home;
        newFixture.away = _away;
        newFixture.date = _date;
        newFixture.active = true;
        newFixture.payedOut = false;
        newFixture.invalidated = false;
        
        fixtureIdList.push(fixtureCounter - 1);
        fixtures[fixtureCounter - 1] = newFixture;
    }

    function getFixtures() public view returns (uint[] memory) { 
        return fixtureIdList;
    }

    /**
     * Read only function to retrieve a fixture.
     */
    function getFixture(uint fixtureId) public view returns (Fixture memory) {
        return fixtures[fixtureId];
    }

    function getBet(uint betID) public view returns (Bet memory) { 
        return allBets[betID];
    }

    function getBetCounter() public view returns(uint) {
        return betCounter;
    }

    /**
     * A function to place bets on a particular sport.
     */
    function placeBet(uint fixtureID, string memory team, uint256 amount) public payable {
        require(msg.sender != owner, "UQ Sports Administration cannot place bets");
        require(amount > 0, "Bet amount must be greater than 0");
        require(amount == msg.value, "Amount deposited does not equal message value");
        //TODO:
        //Ensure you cant place a bet on a non-existent fixture
        address a = msg.sender;
        Bet memory newBet;
        newBet.fixId = fixtureID;
        newBet.betId = (betCounter);
        newBet.punter = a;
        newBet.team = team;
        newBet.won = false;
        newBet.amount = amount;

        allBets[betCounter] = newBet;
        betCounter++;

        fixtures[fixtureID].bets.push(betCounter - 1);
        betIdList.push(betCounter - 1);
    }


    /*
     * A function that distributes the losers funds between the winners
     * proportionally based on the winners initial bet amounts 
     */
    function distributeWinnings(Fixture memory fixture) public payable{

        require(fixture.active = false, "Cannot return funds, fixture is still active");
        require(fixture.invalidated = false, "Cannot return funds, fixture is invalid");
        require(fixture.payedOut = false, "Fixture has already been payed out");
        require(!locked, "Re-entrancy detected");
        
        locked = true;       
        uint losersTotal = calculateLosersTotal(fixture) - uqSportsCut;
        uint winnersTotal = calculateWinnersTotal(fixture);
        uint amountBet = 0;
        uint payout = 0;
        
        for (uint i = 0; i < fixture.bets.length; i++) {
            if (allBets[fixture.bets[i]].won == true) {
                amountBet = allBets[fixture.bets[i]].amount;
                payout = amountBet + ((amountBet/ winnersTotal) * losersTotal);
                (bool success, ) = allBets[fixture.bets[i]].punter.call{value: allBets[fixture.bets[i]].amount}("");
                require(success, "Failed to payout punter"); 
            }
        }
        fixtures[fixture.fixId].payedOut = true;
        locked = false; 
    }

    /*
     * Return all funds to players who have bet on this fixture.
     * To be utilised in the event of a draw or match cancellation
     */
    function returnFunds(Fixture memory fixture) public payable {
        require(fixture.active = false, "Cannot return funds, fixture is still active");
        require(fixture.invalidated = true, "Cannot return funds, fixture is not invalid");
        require(fixture.payedOut = false, "Fixture has already been payed out");
        require(!locked, "Re-entrancy detected");

        locked = true;   
        for (uint i = 0; i < fixture.bets.length; i++) {
            (bool success, ) = allBets[fixture.bets[i]].punter.call{value: allBets[fixture.bets[i]].amount}("");
            require(success, "Failed to payout punter"); 
        }
        fixtures[fixture.fixId].payedOut = true;
        locked = false; 
    }

    receive() external payable {
        //do nothing - function to receive ether.
    }

    fallback() external payable {
        //do nothing
    }

    function getFixtureCount() public view returns(uint){
        return fixtureCounter;
    }

    function calculateLosersTotal(Fixture memory fixture) private view returns(uint) {
        uint loserSum = 0;

        for (uint i = 0; i < fixture.bets.length; i++) {
            if (allBets[fixture.bets[i]].won == false) {
                loserSum += allBets[fixture.bets[i]].amount;
            }
        }
        return loserSum;
    }

    function calculateWinnersTotal(Fixture memory fixture) private view returns(uint) {
        uint winnerSum = 0;

        for (uint i = 0; i < fixture.bets.length; i++) {
            if (allBets[fixture.bets[i]].won == true) {
                winnerSum += allBets[fixture.bets[i]].amount;
            }
        }
        return winnerSum;
    }

    function setWinner(Fixture memory fixture, string memory winner, bool invalidated) public {
        require(msg.sender != owner, "Only UQ Sports Administration can set the winner");

        if (invalidated) {
            fixtures[fixture.fixId].invalidated = true;
            fixtures[fixture.fixId].active = false;
        } else {
            fixtures[fixture.fixId].active = false;
            for (uint i = 0; i < fixture.bets.length; i++) {
                if (keccak256(abi.encodePacked((allBets[fixture.bets[i]].team))) == keccak256(abi.encodePacked((winner)))) {
                    allBets[fixture.bets[i]].won = true;
                }
            }
        }
    }
}
