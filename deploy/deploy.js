 const { ethers } = require("hardhat");


async function main() {
    const [deployer] = await ethers.getSigners()  
    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const BettingPool = await ethers.getContractFactory("BettingPool");
    const bettingPool = await BettingPool.deploy();
    await bettingPool.deployed();
    console.log("Token address:", bettingPool.address);

    //verify the contract on deployment

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 

/*
   
module.exports = async (hre) => {
    const { ethers } = hre
    const { deploy } = deployments
    const accounts = await ethers.getSigners()

    let pool = await deploy("BettingPool", {
      logs: true,
      from: accounts[0].address,
    })

    //verify the contract on deployment
    await hre.run("verify:verify", {
      address: pool.address,
    });
}

module.exports.tags = ["DeployLive"] */