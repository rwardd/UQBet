pragma solidity ^0.7.0;

import "hardhat/console.sol";

contract BetContract {

    struct Fixture {
        string home;
        string away;
        string date;
    }

    struct Bet {
        address payable punter;
        string team;
        uint amount;
        bool won;
    }

    address public owner;
    mapping(Fixture => Bet[]) fixtures;   

    /**
     * Contract initialization.
     */
    constructor() public{
        owner = msg.sender;
    }

    /**
     * A function that adds a fixture.
     *
     * @param home the home team
     * @param away the away team
     * @param date the date of the match
     */
    function addFixture(string home, string away, string date) public{
        require(msg.sender == owner, "Ony UQ Sports Administration can add Fixtures");
        fixtures[Fixture(home, away, date)] = new Bet[];
    }

    function getFixtures() public { 
        return fixtures;
    }

    function getSingleFixture(string home, string away, string date) public {
        return Fixture(home, away, date);
    }

    /**
     * A function to place bets on a particular sport.
     */
    function placeBet(Fixture fixture, string team, uint amount) public payable {
        require(msg.sender != owner, "UQ Sports Administration cannot place bets");
        require(amount > 0, "Bet amount must be greater than 0");

        (bool success,) = owner.call{value : amount}("");
        require(success, "Failed to payout punter");

        fixtures[fixture].push(Bet(msg.sender, team, amount, false));
    }

    /*
     * A function that distributes the losers funds between the winners
     * proportionally based on the winners initial bet amounts 
     */
    function distributeWinnings(Fixture fixture, string winner) public payable{
        setWinner(fixture, winner);
        
        uint losersTotal = calculateLosersTotal(fixture);
        uint winnersTotal = calculateWinnersTotal(fixture);
        uint amountBet = 0;
        uint payout = 0;

        for (uint i = 0; i < fixtures[fixture].length; i++) {
            if (fixtures[fixture][i].won == true) {
                amountBet = fixtures[fixture][i].amount;
                payout = amountBet + ((amountBet/ winnersTotal) * losersTotal);
                (bool success,) = fixtures[fixture][i].punter.call{value : payout}("");
                require(success, "Failed to payout punter");
            }

        } 
    }

    /*
     * Return all funds to players who have bet on this fixture.
     * To be utilised in the event of a draw or match cancellation
     */
    function returnFunds(Fixture fixture) public payable {
        require(msg.sender == owner, "Ony UQ Sports Administration can facilitate payouts");

        for (uint i = 0; i < fixtures[fixture].length; i++) {
            (bool success,) = fixtures[fixture][i].punter.call{value : fixtures[fixture][i].amount}("");
            require(success, "Failed to reimburse funds");
        }
    }

    function calculateLosersTotal(Fixture fixture) private {
        uint loserSum = 0;

        for (uint i = 0; i < fixtures[fixture].length; i++) {
            if(fixtures[fixture][i].won == false) {
                loserSum += fixtures[fixture][i].amount;
            }
        }
        return loserSum;
    }

    function calculateWinnersTotal(Fixture fixture) private {
        uint winnerSum = 0;

        for (uint i = 0; i < fixtures[fixture].length; i++) {
            if(fixtures[fixture][i].won == true) {
                winnerSum += fixtures[fixture][i].amount;
            }
        }
        return winnerSum;
    }

    function setWinner(Fixture fixture, string winner) {
        for (uint i = 0; i < fixtures[fixture].length; i++) {
            if (keccak256(abi.encodePacked((fixtures[fixture][i].team))) == keccak256(abi.encodePacked((winner)))) {
                fixtures[fixture][i].won = true;
            }
        }
    }
}
