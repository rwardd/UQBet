pragma solidity ^0.7.0;

import "hardhat/console.sol";

contract BetContract {

    struct Fixture {
        uint id;
        string home;
        string away;
        string date;
        bool active;
        bool payedOut;
        bool invalidated;
        Bet[] bets;
    }

    struct Bet {
        uint id;
        address payable punter;
        string team;
        uint amount;
        bool won;
    }

    address public owner;
    uint fixtureCounter;
    uint betCounter;
    uint uqSportsCut;
    mapping(uint => Fixture) fixtures;
    mapping(address => Bet[]) userBets;


    /**
     * Contract initialization.
     */
    constructor() public{
        owner = msg.sender;
        fixtureCounter = 0;
        betCounter = 0;
        uqSportsCut = 1;
    }

    /**
     * A function that adds a fixture.
     *
     * @param home the home team
     * @param away the away team
     * @param date the date of the match
     */
    function addFixture(string home, string away, string date) public {
        require(msg.sender == owner, "Only UQ Sports Administration can add Fixtures");
        fixtures[fixtureCounter] = Fixture(fixtureCounter, home, away, date, true, false, false, new Bet[]);
        fixtureCounter += 1;
    }

    function getFixtures() public { 
        return fixtures;
    }

    function getUsersBets() public {
        return userBets[msg.sender];
    }

    /**
     * A function to place bets on a particular sport.
     */
    function placeBet(Fixture fixture, string team, uint256 amount) public payable {
        require(msg.sender != owner, "UQ Sports Administration cannot place bets");
        require(amount > 0, "Bet amount must be greater than 0");
        require(amount == msg.value, "Amount deposited does not equal message value");

        fixtures[fixture.id].bets.push(Bet(betCounter, msg.sender, team, amount, false)); //Add bet to the given fixture
        userBets[msg.sender] = Bet(betCounter, msg.sender, team, amount, false); //Add bet to the users list of bets
        betCounter += 1;
    }


    /*
     * A function that distributes the losers funds between the winners
     * proportionally based on the winners initial bet amounts 
     */
    function distributeWinnings(Fixture fixture, string winner) public payable{

        require(fixtures[fixture.id].active = false, "Cannot return funds, fixture is still active");
        require(fixtures[fixture.id].invalidated = false, "Cannot return funds, fixture is invalid");
        require(fixtures[fixture.id].payedOut = false, "Fixture has already been payed out");
        
        uint losersTotal = calculateLosersTotal(fixture) - uqSportsCut;
        uint winnersTotal = calculateWinnersTotal(fixture);
        uint amountBet = 0;
        uint payout = 0;
        Bet[] betsPlaced = fixtures[fixture.id].bets;
        
        for (uint i = 0; i < betsPlaced.length; i++) {
            if (betsPlaced[i].won == true) {
                amountBet = betsPlaced.amount;
                payout = amountBet + ((amountBet/ winnersTotal) * losersTotal);
                betsPlaced[i].punter.transfer(betsPlaced[i].amount);
                require(success, "Failed to payout punter"); 
            }
        }
        fixtures[fixture.id].payedOut = true; 
    }

    /*
     * Return all funds to players who have bet on this fixture.
     * To be utilised in the event of a draw or match cancellation
     */
    function returnFunds(Fixture fixture) public payable {
        require(fixtures[fixture.id].active = false, "Cannot return funds, fixture is still active");
        require(fixtures[fixture.id].invalidated = true, "Cannot return funds, fixture is not invalid");
        require(fixtures[fixture.id].payedOut = false, "Fixture has already been payed out");

        Bet[] betsPlaced = fixtures[fixture.id].bets;
        for (uint i = 0; i < betsPlaced.length; i++) {
            betsPlaced[i].punter.transfer(betsPlaced[i].amount);
        }
        fixtures[fixture.id].payedOut = true; 
    }

    function calculateLosersTotal(Fixture fixture) private {
        uint loserSum = 0;
        Bet[] betsPlaced = fixtures[fixture.id].bets;

        for (uint i = 0; i < betsPlaced.length; i++) {
            if (betsPlaced[i].won == false) {
                loserSum += betsPlaced[i].amount;
            }
        }
        return loserSum;
    }

    function calculateWinnersTotal(Fixture fixture) private {
        uint winnerSum = 0;
        Bet[] betsPlaced = fixtures[fixture.id].bets;

        for (uint i = 0; i < betsPlaced.length; i++) {
            if(betsPlaced[i].won == true) {
                winnerSum += betsPlaced[i].amount;
            }
        }
        return winnerSum;
    }

    function setWinner(Fixture fixture, string winner, bool invalidated) public {
        require(msg.sender != owner, "Only UQ Sports Administration can set the winner");
        Bet[] betsPlaced = fixtures[fixture.id].bets;
        if (invalidated) {
            fixtures[fixture.id].invalidated = true;
            fixtures[fixture.id].active = false;
        } else {
            fixtures[fixture.id].active = false;
            for (uint i = 0; i < betsPlaced.length; i++) {
                if (keccak256(abi.encodePacked((betsPlaced[i].team))) == keccak256(abi.encodePacked((winner)))) {
                    betsPlaced[i].won = true;
                }
            }
        }
    }
}
