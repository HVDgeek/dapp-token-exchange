const { ethers } = require("hardhat");
const config = require("../src/config.json");

const toWei = (num) => ethers.utils.parseUnits(num.toString(), "ether");

const wait = (seconds) => {
  const milliseconds = seconds * 1000;

  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

async function main() {
  // Fetch accounts from wallet
  const accounts = await ethers.getSigners();

  // Fetch network
  const { chainId } = await ethers.provider.getNetwork();
  console.log("Using chainId: ", chainId);

  const DApp = await ethers.getContractAt(
    "Token",
    config[chainId].DApp.address
  );
  console.log(`DApp Token Fetched: ${DApp.address}`);

  const mETH = await ethers.getContractAt(
    "Token",
    config[chainId].mETH.address
  );
  console.log(`mETH Token Fetched: ${mETH.address}`);

  const mDAI = await ethers.getContractAt(
    "Token",
    config[chainId].mDAI.address
  );
  console.log(`mDAI Token Fetched: ${mDAI.address}`);

  const exchange = await ethers.getContractAt(
    "Exchange",
    config[chainId].exchange.address
  );
  console.log(`Exchange Fetched: ${mDAI.address}`);

  // Give Tokens to Account[1]
  const sender = accounts[0];
  const receiver = accounts[1];
  let amount = toWei(10000);

  // User 1 Transfer 10,000 mETH...
  let transaction, result;
  transaction = await mETH.connect(sender).transfer(receiver.address, amount);
  await transaction.wait();
  console.log(
    `Transfered ${amount} tokens from ${sender.address} to ${receiver.address}\n`
  );

  // Set up users nexchange users
  const user1 = accounts[0];
  const user2 = accounts[1];
  amount = toWei(10000);

  // user1 approves 10,000 Dapp...
  transaction = await DApp.connect(user1).approve(exchange.address, amount);
  await transaction.wait();
  console.log(`Approved ${amount} tokens from ${user1.address}`);

  // user1 deposits 10,000 Dapp...
  transaction = await exchange
    .connect(user1)
    .depositToken(DApp.address, amount);
  await transaction.wait();
  console.log(`Deposited ${amount} DApp from ${user1.address}\n`);

  // user2 approves 10,000 mETH...
  transaction = await mETH.connect(user2).approve(exchange.address, amount);
  await transaction.wait();
  console.log(`Approved ${amount} tokens from ${user2.address}`);

  // user2 deposits 10,000 mETH...
  transaction = await exchange
    .connect(user2)
    .depositToken(mETH.address, amount);
  await transaction.wait();
  console.log(`Deposited ${amount} Ether from ${user2.address}\n`);

  /*
   ***  Seed a Canceled Order ***
   */

  // user 1 makes order to get tokens
  let orderId;
  transaction = await exchange
    .connect(user1)
    .makeOrder(mETH.address, toWei(100), DApp.address, toWei(5));
  result = await transaction.wait();
  console.log(`Made order from ${user1.address}`);

  // user 1 cancels order
  orderId = result.events[0].args.id;
  transaction = await exchange.connect(user1).cancelOrder(orderId);
  result = await transaction.wait();
  console.log(`Cancelled order from ${user1.address}\n`);

  // Wait 1 second
  await wait(1);

  /*
   ***  Seed a Filled Order ***
   */

  // user 1 makes order
  transaction = await exchange
    .connect(user1)
    .makeOrder(mETH.address, toWei(100), DApp.address, toWei(10));
  result = await transaction.wait();
  console.log(`Made order from ${user1.address}`);

  // user 2 fills order
  orderId = result.events[0].args.id;
  transaction = await exchange.connect(user2).fillOrder(orderId);
  result = await transaction.wait();
  console.log(`Filled order from ${user2.address}\n`);

  // Wait 1 second
  await wait(1);

  // user 1 makes another order
  transaction = await exchange
    .connect(user1)
    .makeOrder(mETH.address, toWei(50), DApp.address, toWei(15));
  result = await transaction.wait();
  console.log(`Made order from ${user1.address}`);

  // user 2 fills another order
  orderId = result.events[0].args.id;
  transaction = await exchange.connect(user2).fillOrder(orderId);
  result = await transaction.wait();
  console.log(`Filled order from ${user2.address}\n`);

  // Wait 1 second
  await wait(1);

  // user 1 makes final order
  transaction = await exchange
    .connect(user1)
    .makeOrder(mETH.address, toWei(200), DApp.address, toWei(20));
  result = await transaction.wait();
  console.log(`Made order from ${user1.address}`);

  // user 2 fills final order
  orderId = result.events[0].args.id;
  transaction = await exchange.connect(user2).fillOrder(orderId);
  result = await transaction.wait();
  console.log(`Filled order from ${user2.address}\n`);

  await wait(1);

  /*
   ***  Seed Open orders ***
   */

  // User 1 makes 10 orders
  for (let i = 1; i <= 10; i++) {
    transaction = await exchange
      .connect(user1)
      .makeOrder(mETH.address, toWei(10 * i), DApp.address, toWei(10));
    result = await transaction.wait();
    console.log(`Made order from ${user1.address}`);

    await wait(1);
  }

  // User 2 makes 10 orders
  for (let i = 1; i <= 10; i++) {
    transaction = await exchange
      .connect(user2)
      .makeOrder(DApp.address, toWei(10), mETH.address, toWei(10 * i));
    result = await transaction.wait();
    console.log(`Made order from ${user2.address}`);

    await wait(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
