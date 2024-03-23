const { expect } = require("chai");
const { ethers } = require("hardhat");

const toWei = (value) => {
  // const value = ethers.utils.parseEther("1000000");
  return ethers.utils.parseUnits(value.toString(), "ether");
};

const fromWei = (num) => ethers.utils.formatEther(num);

describe("Token", () => {
  let token, accounts, deployer, receiver;

  const totalSupplyEth = "1000000"; // ether
  const name = "Hiduino";
  const symbol = "HVD";
  const decimals = 18;
  const totalSupply = toWei(totalSupplyEth); // wei

  beforeEach(async () => {
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy(name, symbol, totalSupplyEth);
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    receiver = accounts[1];
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
      expect(await token.totalSupply()).to.equal(totalSupply);
    });

    it("assings total supply to deployer", async () => {
      expect(await token.balanceOf(deployer.address)).to.equal(totalSupply);
    });
  });

  describe("Sending Token", () => {
    let amount, transation, result;

    describe("Success", () => {
      beforeEach(async () => {
        amount = 10;
        transation = await token
          .connect(deployer)
          .transfer(receiver.address, toWei(amount));
        result = await transation.wait();
      });

      it("transfers token balance", async () => {
        expect(await token.balanceOf(deployer.address)).to.equal(
          toWei(Number(totalSupplyEth) - amount)
        );
        expect(await token.balanceOf(receiver.address)).to.equal(toWei(amount));
      });

      it("emits a transfer event", async () => {
        const event = result.events[0];
        const args = event.args;

        expect(result.events).to.have.lengthOf(1);
        expect(event.event).to.equal("Transfer");
        expect(args.from).to.equal(deployer.address);
        expect(args.to).to.equal(receiver.address);
        expect(args.value).to.equal(toWei(amount));
        // expect(args["_from"]).to.equal(deployer.address);
        // expect(args["_to"]).to.equal(receiver.address);
        // expect(args["_value"]).to.equal(toWei(amount));
      });
    });

    describe("Failure", () => {
      it("rejects insufficient balance", async () => {
        const invalidAmount = 10000000; //100 M

        await expect(
          token
            .connect(deployer)
            .transfer(receiver.address, toWei(invalidAmount))
        ).to.be.reverted;

        await expect(
          token
            .connect(deployer)
            .transfer(receiver.address, toWei(invalidAmount))
        ).to.be.revertedWith("Insufficient balance");
      });

      it("rejects invalid recepient", async () => {
        amount = 10;
        const invalidRecepient = "0x0000000000000000000000000000000000000000";

        await expect(
          token.connect(deployer).transfer(invalidRecepient, toWei(amount))
        ).to.be.reverted;

        await expect(
          token.connect(deployer).transfer(invalidRecepient, toWei(amount))
        ).to.be.revertedWith("Invalid address");
      });
    });
  });
});
