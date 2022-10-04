const {ethers} = require("hardhat");


const main = async()=>{
    const contractFactory = await ethers.getContractFactory("TaskContract");
    const contract = await contractFactory.deploy();
    await contract.deployed();
    console.log("Contract deployed to :",contract.address);
}


const runMain = async ()=>{
    try{
        await main();
        process.exit(0);
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}

runMain();

//contract
//0xFe2E68f42cE43E910736Fc606Ea6774513412ac5