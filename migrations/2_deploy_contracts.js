const MaoriArt = artifacts.require("../src/contracts/MaoriArt.sol");

module.exports = function(deployer) {
  deployer.deploy(MaoriArt);
};
