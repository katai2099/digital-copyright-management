const CopyrightManagement = artifacts.require("CopyrightManagement")

module.exports = function (deployer) {
  deployer.deploy(CopyrightManagement);
};
