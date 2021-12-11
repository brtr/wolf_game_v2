const { ethers, upgrades } = require("hardhat");
const { WOOL_ADDRESS, WOOLF_ADDRESS, BARN_ADDRESS, LINK_ADDRESS, VRF_ADDRESS } = process.env;

async function main() {
  const WoolPouch = await ethers.getContractFactory("WoolPouch");
  const wool_pouch = await upgrades.deployProxy(WoolPouch, [WOOL_ADDRESS, WOOLF_ADDRESS]);
  await wool_pouch.deployed();
  console.log("wool_pouch deployed to:", wool_pouch.address);

  const WOOL = await ethers.getContractFactory("WOOL");
  const wool = WOOL.attach(WOOL_ADDRESS);
  await wool.addController(wool_pouch.address);
  console.log("set wool pouch to wool success");

  const WoolfReborn = await ethers.getContractFactory("WoolfReborn");
  const reborn = await upgrades.deployProxy(WoolfReborn, [WOOLF_ADDRESS, BARN_ADDRESS]);
  await reborn.deployed();
  console.log("reborn deployed to:", reborn.address);

  const RiskyGame = await ethers.getContractFactory("RiskyGame");
  const risky_game = await upgrades.deployProxy(RiskyGame, [reborn.address, WOOLF_ADDRESS, BARN_ADDRESS, wool_pouch.address, LINK_ADDRESS, VRF_ADDRESS]);
  await risky_game.deployed();
  console.log("risky_game deployed to:", risky_game.address);

  await woolpouch.addController(risky_game.address);
  console.log("set risky game to wool pouch success");
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});