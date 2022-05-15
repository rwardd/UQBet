pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract BetContract {
    struct Fixture {
        uint256 fixId;
        string home;
        string away;
        string date;
        bool active;
        bool invalidated;
        uint256[] bets;
    }

    struct Bet {
        uint256 betId;
        uint256 fixId;
        address punter; // we are going to assume that only EOA wallets can be punters
        string team;
        uint256 amount;
        bool won;
        bool payedOut;
    }

    address public owner;
    uint256 fixtureCounter;
    uint256 betCounter;
    uint256 uqSportsCut;
    bool locked;

    mapping(uint256 => Fixture) fixtures;
    mapping(uint256 => Bet) allBets;
    mapping(address => uint256[]) userBets;

    uint256[] betIdList;
    uint256[] fixtureIdList;

    /**
     * Contract initialization.
     */
    constructor() {
        owner = msg.sender;
        fixtureCounter = 0;
        betCounter = 0;
        uqSportsCut = 10;
        locked = false;
    }

    /**
     * A function that adds a fixture.
     *
     * @param _home the home team
     * @param _away the away team
     * @param _date the date of the match
     */
    function addFixture(
        string memory _home,
        string memory _away,
        string memory _date
    ) public {
        require(
            msg.sender == owner,
            "Only UQ Sports Administration can add Fixtures"
        );
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

    function getFixtures() public view returns (uint256[] memory) {
        return fixtureIdList;
    }

    /**
     * Read only function to retrieve a fixture.
     */
    function getFixture(uint256 fixtureId)
        public
        view
        returns (Fixture memory)
    {
        return fixtures[fixtureId];
    }

    function getFixtureCount() public view returns (uint256) {
        return fixtureCounter;
    }

    function getBet(uint256 betID) public view returns (Bet memory) {
        return allBets[betID];
    }

    function getBetCounter() public view returns (uint256) {
        return betCounter;
    }

    function getUserBets() public view returns (uint256[] memory) {
        return userBets[msg.sender];
    }

    /**
     * A function to place bets on a particular sport.
     */
    function placeBet(
        uint256 fixtureID,
        string memory team,
        uint256 amount
    ) public payable {
        require(
            msg.sender != owner,
            "UQ Sports Administration cannot place bets"
        );
        require(amount > 0, "Bet amount must be greater than 0");
        require(
            amount == msg.value,
            "Amount deposited does not equal message value"
        );
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

    function retrieveFunds(uint256 betId) public payable {
        require(!locked, "Re-entrancy detected");
        require(
            fixtures[allBets[betId].fixId].active == false,
            "Cannot withdraw winnings, fixture is still active"
        );
        require(
            allBets[betId].payedOut == false,
            "Bet has already been payed out"
        );
        require(allBets[betId].won == true, "This bet has not been won");
        require(
            allBets[betId].punter == msg.sender,
            "Not the owner of this bet"
        );

        locked = true;
        if (fixtures[allBets[betId].fixId].invalidated == true) {
            console.log("in here", 1);
            (bool success, ) = allBets[betId].punter.call{
                value: allBets[betId].amount
            }("");
            require(success, "Failed to withdraw winnings");
            allBets[betId].payedOut = true;
        } else {
            uint256 losersTotal = calculateLosersTotal(allBets[betId].fixId);
            losersTotal = losersTotal - ((losersTotal / 100) * uqSportsCut); //10% stays for uq
            uint256 winnersTotal = calculateWinnersTotal(allBets[betId].fixId);
            uint256 amountBet = allBets[betId].amount;
            uint256 payout = amountBet +
                ((((amountBet * 100) / winnersTotal) * losersTotal) / 100);

            (bool success, ) = allBets[betId].punter.call{value: payout}("");
            require(success, "Failed to withdraw winnings");
            allBets[betId].payedOut = true;
        }
        locked = false;
    }

    function calculateLosersTotal(uint256 fixtureId)
        private
        view
        returns (uint256)
    {
        uint256 loserSum = 0;

        for (uint256 i = 0; i < fixtures[fixtureId].bets.length; i++) {
            if (allBets[fixtures[fixtureId].bets[i]].won == false) {
                loserSum += allBets[fixtures[fixtureId].bets[i]].amount;
            }
        }
        return loserSum;
    }

    function calculateWinnersTotal(uint256 fixtureId)
        private
        view
        returns (uint256)
    {
        uint256 winnerSum = 0;

        for (uint256 i = 0; i < fixtures[fixtureId].bets.length; i++) {
            if (allBets[fixtures[fixtureId].bets[i]].won == true) {
                winnerSum += allBets[fixtures[fixtureId].bets[i]].amount;
            }
        }
        return winnerSum;
    }

    function setWinner(uint256 fixtureId, string memory winner) public {
        require(
            msg.sender == owner,
            "Only UQ Sports Administration can set the winner"
        );

        fixtures[fixtureId].active = false;
        for (uint256 i = 0; i < fixtures[fixtureId].bets.length; i++) {
            if (
                keccak256(
                    abi.encodePacked(
                        (allBets[fixtures[fixtureId].bets[i]].team)
                    )
                ) == keccak256(abi.encodePacked((winner)))
            ) {
                allBets[fixtures[fixtureId].bets[i]].won = true;
            } else {
                allBets[fixtures[fixtureId].bets[i]].payedOut = true;
            }
        }
    }

    function setInvalidated(uint256 fixtureId) public {
        require(
            msg.sender == owner,
            "Only UQ Sports Administration can set the winner"
        );

        fixtures[fixtureId].invalidated = true;
        fixtures[fixtureId].active = false;
        for (uint256 i = 0; i < fixtures[fixtureId].bets.length; i++) {
            allBets[fixtures[fixtureId].bets[i]].won = true;
        }
    }

    receive() external payable {
        //do nothing - function to receive ether.
    }

    fallback() external payable {
        //do nothing
    }

    function takeEarnings() public onlyOwner {
        uint256 amount = address(this).balance;
        bool fixturesActive = false;
        for (uint256 i = 0; i < fixtureCounter; i++) {
            if (fixtures[i].active == true) {
                fixturesActive = true;
            }
        }
        require(
            fixturesActive == false,
            "There is still a fixture in play, cannot withdraw funds"
        );
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Fail in transferring funds to UQ admin");
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only UQ admin can call this function");
        _;
    }
}
