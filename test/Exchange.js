const { expect } = require("chai");
const { ethers } = require("hardhat");

const toWei = (value) => {
  return ethers.utils.parseUnits(value.toString(), "ether");
};

describe("Exchange", () => {
  let exchange, token1, accounts, deployer, feeAccount, user1;
  const feePercent = 10;

  beforeEach(async () => {
    const Exchange = await ethers.getContractFactory("Exchange");
    const Token = await ethers.getContractFactory("Token");

    token1 = await Token.deploy("My Token", "MTK", "1000000");

    accounts = await ethers.getSigners();
    deployer = accounts[0];
    feeAccount = accounts[1];
    user1 = accounts[2];

    // Transfer token from Deployer to User1
    let transation = await token1
      .connect(deployer)
      .transfer(user1.address, toWei(1000));
    await transation.wait();

    exchange = await Exchange.deploy(feeAccount.address, feePercent);
  });

  describe("Deployment", () => {
    it("tracks the fee account", async () => {
      expect(await exchange.feeAccount()).to.equal(feeAccount.address);
    });
    it("tracks the fee percent", async () => {
      expect(await exchange.feeAccount()).to.equal(feeAccount.address);
    });
  });

  describe("Depositing Tokens", () => {
    let transation, result;
    let amount = 10;

    describe("Success", () => {
      beforeEach(async () => {
        // Approve token
        transation = await token1
          .connect(user1)
          .approve(exchange.address, toWei(amount));
        result = await transation.wait();

        // Depposit token
        transation = await exchange
          .connect(user1)
          .depositToken(token1.address, toWei(amount));
        result = await transation.wait();
      });

      it("track the token deposit", async () => {
        expect(await token1.balanceOf(exchange.address)).to.equal(
          toWei(amount)
        );

        expect(await exchange.tokens(token1.address, user1.address)).to.equal(
          toWei(amount)
        );

        expect(
          await exchange.balanceOf(token1.address, user1.address)
        ).to.equal(toWei(amount));
      });

      it("emits a Deposit event", async () => {
        const event = result.events[1];
        const args = event.args;

        expect(result.events).to.have.lengthOf(2); // Two events: Transfer and Deposit
        expect(event.event).to.equal("Deposit");
        expect(args.token).to.equal(token1.address);
        expect(args.user).to.equal(user1.address);
        expect(args.amount).to.equal(toWei(amount));
        expect(args.balance).to.equal(toWei(amount));
      });
    });

    describe("Failure", () => {
      it("fails when no tokens are approved", async () => {
        await expect(
          exchange.connect(user1).depositToken(token1.address, toWei(amount))
        ).to.be.reverted;

        await expect(
          exchange.connect(user1).depositToken(token1.address, toWei(amount))
        ).to.be.revertedWith("Transfer amount exceeds allowance");
      });
    });
  });
});
