pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract BetContract {

    struct Fixture {
        uint fixId;
        string home;
        string away;
        string date;
        bool active;
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
        bool payedOut;
    }

    address public owner;
    uint fixtureCounter;
    uint betCounter;
    uint uqSportsCut;
    bool locked;
    
    mapping(uint => Fixture) fixtures;
    mapping(uint => Bet) allBets;
    mapping(address => uint[]) userBets;

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
        //TODO:
        //Ensure you cant duplicate fixtures
        Fixture memory newFixture = fixtures[fixtureCounter++];
        newFixture.fixId = (fixtureCounter - 1);
        newFixture.home = _home;
        newFixture.away = _away;
        newFixture.date = _date;
        newFixture.active = true;
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

    function getFixtureCount() public view returns(uint){
        return fixtureCounter;
    }

    function getBet(uint betID) public view returns (Bet memory) { 
        return allBets[betID];
    }

    function getBetCounter() public view returns(uint) {
        return betCounter;
    }

    function getUserBets() public view returns(uint[] memory) {
        return userBets[msg.sender];
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

        // Add to user bets
        userBets[msg.sender].push(betCounter);

        fixtures[fixtureID].bets.push(betCounter);
        betIdList.push(betCounter);
        allBets[betCounter] = newBet;

        betCounter++;
    }

    function retrieveFunds(uint betId) public payable {
        require(!locked, "Re-entrancy detected");
        require(fixtures[allBets[betId].fixId].active == false, "Cannot withdraw winnings, fixture is still active");
        require(allBets[betId].payedOut == false, "Bet has already been payed out");
        require(allBets[betId].won == true, "This bet has not been won");
        require(allBets[betId].punter == msg.sender, "Not the owner of this bet");

        locked = true;
        if(fixtures[allBets[betId].fixId].invalidated == true) {
            console.log("in here", 1);
            (bool success, ) = allBets[betId].punter.call{value: allBets[betId].amount}("");
            require(success, "Failed to withdraw winnings"); 
            allBets[betId].payedOut = true;           
        } else {
            uint losersTotal = calculateLosersTotal(allBets[betId].fixId) - uqSportsCut;
            uint winnersTotal = calculateWinnersTotal(allBets[betId].fixId);
            uint amountBet = allBets[betId].amount;
            uint payout = amountBet + (((amountBet * 100/ winnersTotal) * losersTotal)/100);

            (bool success, ) = allBets[betId].punter.call{value: payout}("");
            require(success, "Failed to withdraw winnings");
            allBets[betId].payedOut = true;
        }
        locked = false;
    }

    function calculateLosersTotal(uint fixtureId) private view returns(uint) {
        uint loserSum = 0;

        for (uint i = 0; i < fixtures[fixtureId].bets.length; i++) {
            if (allBets[fixtures[fixtureId].bets[i]].won == false) {
                loserSum += allBets[fixtures[fixtureId].bets[i]].amount;
            }
        }
        return loserSum;
    }

    function calculateWinnersTotal(uint fixtureId) private view returns(uint) {
        uint winnerSum = 0;

        for (uint i = 0; i < fixtures[fixtureId].bets.length; i++) {
            if (allBets[fixtures[fixtureId].bets[i]].won == true) {
                winnerSum += allBets[fixtures[fixtureId].bets[i]].amount;
            }
        }
        return winnerSum;
    }

    function setWinner(uint fixtureId, string memory winner, bool invalidated) public {
        require(msg.sender == owner, "Only UQ Sports Administration can set the winner");

        if (invalidated) {
            fixtures[fixtureId].invalidated = true;
            fixtures[fixtureId].active = false;
            for (uint i = 0; i < fixtures[fixtureId].bets.length; i++) {
                    allBets[fixtures[fixtureId].bets[i]].won = true;
            }
        } else {
            fixtures[fixtureId].active = false;
            for (uint i = 0; i < fixtures[fixtureId].bets.length; i++) {
                if (keccak256(abi.encodePacked((allBets[fixtures[fixtureId].bets[i]].team))) == keccak256(abi.encodePacked((winner)))) {
                    allBets[fixtures[fixtureId].bets[i]].won = true;
                }
            }
        }
    }

    receive() external payable {
        //do nothing - function to receive ether.
    }

    fallback() external payable {
        //do nothing
    }
}