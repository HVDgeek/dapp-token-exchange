const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (value) => {
  // const value = ethers.utils.parseEther("1000000");
  return ethers.utils.parseUnits(value.toString(), "ether");
};

describe("Token", () => {
  let token;

  const name = "Hiduino";
  const symbol = "HVD";
  const decimals = 18;
  const totalSupply = "1000000";

  beforeEach(async () => {
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy(name, symbol, totalSupply);
  });

  describe("Deployment", () => {
    it("has correct name", async () => {
      expect(await token.name()).to.equal(name);
    });

    it("has correct symbol", async () => {
      expect(await token.symbol()).to.equal(symbol);
    });

    it("has correct decimals", async () => {
      expect(await token.decimals()).to.equal(decimals);
    });

    it("has correct total supply", async () => {
      expect(await token.totalSupply()).to.equal(tokens(totalSupply));
    });
  });
});
