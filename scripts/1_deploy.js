const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy();

  await token.deployed();

  const address = JSON.stringify({ address: token.address });

  fs.writeFile("./artifacts/ContractAddress.json", address, "utf-8", (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Token deployed to:", token.address);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
