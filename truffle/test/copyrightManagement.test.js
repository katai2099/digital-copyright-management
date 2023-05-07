const { assert } = require("chai");
const {
  BN,
  expectRevert, // Assertions for transactions that should fail
} = require("@openzeppelin/test-helpers");
const { web3 } = require("@openzeppelin/test-helpers/src/setup");

const CopyrightManagement = artifacts.require("CopyrightManagement");
const whitelistErrorMsg = "You need to be whitelisted";
//user data
const firstname = "test";
const lastname = "tester";
const email = "test@test.com";
//second user data
const firstname2 = "test2";
const lastname2 = "tester2";
const email2 = "test2@test.com";
//content data
const contentHash = "testHash";
const contentIPFSAddress = "testIPFS";
const contentTitle = "testTitle";
const contentDesc = "testDesc";
const contentFieldOfUse = "testFieldOfUse";
const contentPrice = "0.5";
const contentType = 0;
//updated content data
const updatedContentPrice = "1";
const updatedContentFieldOfUse = "updatedFieldOfUse";
//request agreement data
const purposeOfUse = "testPurpose";
const fieldOfUse = "fieldOfUse";
//reject agreement data
const testRejectReason = "testRejectReason";

contract("Copyright Management", function () {
  beforeEach(async () => {
    this.CopyrightManagement = await CopyrightManagement.deployed();
  });

  //add user
  it("1.add new user function should add user data to smart contract", async () => {
    const accounts = await web3.eth.getAccounts();
    const account1 = accounts[0];
    const expectedUser = {
      walletAddress: account1,
      firstname: firstname,
      lastname: lastname,
      emailAddress: email,
    };
    await this.CopyrightManagement.addUser(firstname, lastname, email, {
      from: account1,
    });
    const user = await this.CopyrightManagement.users(account1);
    const actualUser = {
      walletAddress: user.walletAddress,
      firstname: user.firstname,
      lastname: user.lastname,
      emailAddress: user.emailAddress,
    };
    assert.deepEqual(actualUser, expectedUser);
  });
  it("2.add new user with existing email address should throw an errro", async () => {
    const accounts = await web3.eth.getAccounts();
    const account1 = accounts[0];
    await expectRevert(
      this.CopyrightManagement.addUser(firstname, lastname, email, {
        from: account1,
      }),
      "user with the same email already exists"
    );
  });
  //update user
  it("3.non whitelisted user update data should throw an error", async () => {
    const accounts = await web3.eth.getAccounts();
    const account2 = accounts[1];
    await expectRevert(
      this.CopyrightManagement.updateUser("test2", "tester2", {
        from: account2,
      }),
      whitelistErrorMsg
    );
  });
  it("4.update user should update data on smart contract", async () => {
    const accounts = await web3.eth.getAccounts();
    const account1 = accounts[0];
    const newFirstname = "test2";
    const newLastname = "tester2";
    await this.CopyrightManagement.updateUser(newFirstname, newLastname, {
      from: account1,
    });
    const expectedUser = {
      walletAddress: account1,
      firstname: newFirstname,
      lastname: newLastname,
      emailAddress: email,
    };
    const user = await this.CopyrightManagement.users(account1);
    const actualUser = {
      walletAddress: user.walletAddress,
      firstname: user.firstname,
      lastname: user.lastname,
      emailAddress: user.emailAddress,
    };
    assert.deepEqual(actualUser, expectedUser);
  });

  //add content
  it("5.non whitelisted user should not be able to add new content", async () => {
    const accounts = await web3.eth.getAccounts();
    const account2 = accounts[1];
    await expectRevert(
      this.CopyrightManagement.addContent(
        contentHash,
        contentIPFSAddress,
        contentTitle,
        contentDesc,
        contentFieldOfUse,
        web3.utils.toWei(contentPrice),
        contentType,
        { from: account2 }
      ),
      whitelistErrorMsg
    );
  });
  it("6.add content function should add content data to smart contract", async () => {
    const accounts = await web3.eth.getAccounts();
    const account1 = accounts[0];
    const expectedContent = {
      ownerAddress: account1,
      Id: "0",
      pHash: contentHash,
      IPFSAddress: contentIPFSAddress,
      title: contentTitle,
      desc: contentDesc,
      fieldOfUse: contentFieldOfUse,
      price: web3.utils.toWei(contentPrice),
      contentType: contentType.toString(),
    };
    await this.CopyrightManagement.addContent(
      contentHash,
      contentIPFSAddress,
      contentTitle,
      contentDesc,
      contentFieldOfUse,
      web3.utils.toWei(contentPrice),
      contentType,
      { from: account1 }
    );
    const content = await this.CopyrightManagement.contents(0);
    const actualContent = {
      ownerAddress: content.ownerAddress,
      Id: content.Id.toString(),
      pHash: content.pHash,
      IPFSAddress: content.IPFSAddress,
      title: content.title,
      desc: content.desc,
      fieldOfUse: content.fieldOfUse,
      price: content.price.toString(),
      contentType: content.contentType.toString(),
    };
    assert.deepEqual(actualContent, expectedContent);
  });
  it("7.add content with the same hash should throw an error", async () => {
    const accounts = await web3.eth.getAccounts();
    const account1 = accounts[0];
    await expectRevert(
      this.CopyrightManagement.addContent(
        contentHash,
        "test",
        "test",
        "test",
        "test",
        web3.utils.toWei(contentPrice),
        1,
        { from: account1 }
      ),
      "Content with same hash already exist"
    );
  });
  //update content
  it("8.non whitelisted user update content should throw an error", async () => {
    const accounts = await web3.eth.getAccounts();
    const account2 = accounts[1];
    await expectRevert(
      this.CopyrightManagement.updateContentData(
        0,
        web3.utils.toWei(updatedContentPrice),
        updatedContentFieldOfUse,
        { from: account2 }
      ),
      whitelistErrorMsg
    );
  });
  it("9.an attempt to update content other's content should throw an error", async () => {
    const accounts = await web3.eth.getAccounts();
    const account3 = accounts[2];
    await this.CopyrightManagement.addUser(firstname2, lastname2, email2, {
      from: account3,
    });
    await expectRevert(
      this.CopyrightManagement.updateContentData(
        0,
        web3.utils.toWei(updatedContentPrice),
        updatedContentFieldOfUse,
        { from: account3 }
      ),
      "You are not the owner of the content"
    );
  });
  it("10.update non existing content should throw an error", async () => {
    const accounts = await web3.eth.getAccounts();
    const account1 = accounts[0];
    await expectRevert(
      this.CopyrightManagement.updateContentData(
        10,
        web3.utils.toWei(updatedContentPrice),
        updatedContentFieldOfUse,
        { from: account1 }
      ),
      "content does not exists"
    );
  });
  it("11.update content function should update data on smart contract", async () => {
    const accounts = await web3.eth.getAccounts();
    const account1 = accounts[0];
    await this.CopyrightManagement.updateContentData(
      0,
      web3.utils.toWei(updatedContentPrice),
      updatedContentFieldOfUse,
      { from: account1 }
    );
    const expectedContent = {
      ownerAddress: account1,
      Id: "0",
      pHash: contentHash,
      IPFSAddress: contentIPFSAddress,
      title: contentTitle,
      desc: contentDesc,
      fieldOfUse: updatedContentFieldOfUse,
      price: web3.utils.toWei(updatedContentPrice),
      contentType: contentType.toString(),
    };
    const content = await this.CopyrightManagement.contents(0);
    const actualContent = {
      ownerAddress: content.ownerAddress,
      Id: content.Id.toString(),
      pHash: content.pHash,
      IPFSAddress: content.IPFSAddress,
      title: content.title,
      desc: content.desc,
      fieldOfUse: content.fieldOfUse,
      price: content.price.toString(),
      contentType: content.contentType.toString(),
    };
    assert.deepEqual(actualContent, expectedContent);
  });
  //request agreement
  it("12.non whitelisted user request permission should throw an error", async () => {
    const accounts = await web3.eth.getAccounts();
    const account2 = accounts[1];
    await expectRevert(
      this.CopyrightManagement.requestAgreement(0, purposeOfUse, fieldOfUse, {
        from: account2,
        value: web3.utils.toWei(updatedContentPrice),
      }),
      whitelistErrorMsg
    );
  });
  it("13.owner should not be able to request their own content", async () => {
    const accounts = await web3.eth.getAccounts();
    const account1 = accounts[0];
    await expectRevert(
      this.CopyrightManagement.requestAgreement(0, purposeOfUse, fieldOfUse, {
        from: account1,
        value: web3.utils.toWei(updatedContentPrice),
      }),
      "You are the owner.You are free to use your own content"
    );
  });
  it("14.error should thrown if amount of ether sent along with the function is less than content price", async () => {
    const accounts = await web3.eth.getAccounts();
    const account3 = accounts[2];
    await expectRevert(
      this.CopyrightManagement.requestAgreement(0, purposeOfUse, fieldOfUse, {
        from: account3,
        value: "2000",
      }),
      "Amount of Ether provided is less than content price"
    );
  });
  it("15.request permission for non existing content should throw an error", async () => {
    const accounts = await web3.eth.getAccounts();
    const account1 = accounts[0];
    await expectRevert(
      this.CopyrightManagement.requestAgreement(10, purposeOfUse, fieldOfUse, {
        from: account1,
        value: web3.utils.toWei(updatedContentPrice),
      }),
      "content does not exists"
    );
  });
  it("16.request agreement function should add pending request data to smart contract", async () => {
    const accounts = await web3.eth.getAccounts();
    const account3 = accounts[2];
    await this.CopyrightManagement.requestAgreement(
      0,
      purposeOfUse,
      fieldOfUse,
      {
        from: account3,
        value: web3.utils.toWei(updatedContentPrice),
      }
    );
    const expectedRequest = {
      id: "0",
      licensee: account3,
      contentId: "0",
      purposeOfUse: purposeOfUse,
      fieldOfUse: fieldOfUse,
      price: web3.utils.toWei(updatedContentPrice),
      requestType: "0",
      rejectReason: "",
    };
    const request = await this.CopyrightManagement.requests(0);
    const actualRequest = {
      id: request.id.toString(),
      licensee: request.licensee,
      contentId: request.contentId.toString(),
      purposeOfUse: request.purposeOfUse,
      fieldOfUse: request.fieldOfUse,
      price: request.price.toString(),
      requestType: request.requestType.toString(),
      rejectReason: request.rejectReason,
    };
    assert.deepEqual(actualRequest, expectedRequest);
  });
  it("17.request agreement should add Ether to owner's balance in smart contract", async () => {
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];
    const account4 = accounts[3];
    await this.CopyrightManagement.addUser(
      firstname2,
      lastname2,
      "test3@test.com",
      {
        from: account4,
      }
    );

    await this.CopyrightManagement.requestAgreement(
      0,
      purposeOfUse,
      fieldOfUse,
      {
        from: account4,
        value: web3.utils.toWei(updatedContentPrice),
      }
    );
    const expectedBalance = web3.utils.toWei("2");
    const actualBalance = await this.CopyrightManagement.balances(owner);
    assert.equal(actualBalance.toString(), expectedBalance);
  });
  it("18.resending a request while request is still in pending state should throw an error", async () => {
    const accounts = await web3.eth.getAccounts();
    const account4 = accounts[3];
    await expectRevert(
      this.CopyrightManagement.requestAgreement(0, purposeOfUse, fieldOfUse, {
        from: account4,
        value: web3.utils.toWei(updatedContentPrice),
      }),
      "There exist a pending request"
    );
  });
  it("19.resending a request when request has already been accepted should throw an error", async () => {
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];
    const account4 = accounts[3];
    await this.CopyrightManagement.approveAgreement(1, { from: owner });
    await expectRevert(
      this.CopyrightManagement.requestAgreement(0, purposeOfUse, fieldOfUse, {
        from: account4,
        value: web3.utils.toWei(updatedContentPrice),
      }),
      "Your request to use this content has been approved"
    );
  });
  //reject agreement
  it("20.non whitelisted user reject agreement should throw an error", async () => {
    const accounts = await web3.eth.getAccounts();
    const account2 = accounts[1];
    await expectRevert(
      this.CopyrightManagement.rejectAgreement(1, testRejectReason, {
        from: account2,
      }),
      whitelistErrorMsg
    );
  });
  it("21.reject request when you are not the owner of the content should throw an error", async () => {
    const accounts = await web3.eth.getAccounts();
    const account3 = accounts[2];
    await expectRevert(
      this.CopyrightManagement.rejectAgreement(1, testRejectReason, {
        from: account3,
      }),
      "You are not the owner of the content"
    );
  });
  it("22.reject an approved request should throw an error", async () => {
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];
    await expectRevert(
      this.CopyrightManagement.rejectAgreement(1, testRejectReason, {
        from: owner,
      }),
      "The request has already been approved"
    );
  });
  it("23.reject agreement function should update request data to rejected state", async () => {
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];
    const account3 = accounts[2];
    const expectedRequest = {
      id: "0",
      licensee: account3,
      contentId: "0",
      purposeOfUse: purposeOfUse,
      fieldOfUse: fieldOfUse,
      price: web3.utils.toWei(updatedContentPrice),
      requestType: "1",
      rejectReason: testRejectReason,
    };
    await this.CopyrightManagement.rejectAgreement(0, testRejectReason, {
      from: owner,
    });
    const request = await this.CopyrightManagement.requests(0);
    const actualRequest = {
      id: request.id.toString(),
      licensee: request.licensee,
      contentId: request.contentId.toString(),
      purposeOfUse: request.purposeOfUse,
      fieldOfUse: request.fieldOfUse,
      price: request.price.toString(),
      requestType: request.requestType.toString(),
      rejectReason: request.rejectReason,
    };
    assert.deepEqual(actualRequest, expectedRequest);
  });
  it("24.reject request should return Ether from owner's balance amount of content price to original licensee", async () => {
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];
    const account3 = accounts[2];
    await this.CopyrightManagement.requestAgreement(
      0,
      purposeOfUse,
      fieldOfUse,
      { from: account3, value: web3.utils.toWei(updatedContentPrice) }
    );
    const oldBalance = await web3.eth.getBalance(account3);
    await this.CopyrightManagement.rejectAgreement(2, testRejectReason, {
      from: owner,
    });
    const newBalance = await web3.eth.getBalance(account3);
    assert.isAbove(Number(newBalance), Number(oldBalance));
  });
  it("25.reject a rejected request should throw an error", async () => {
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];
    await expectRevert(
      this.CopyrightManagement.rejectAgreement(2, testRejectReason, {
        from: owner,
      }),
      "You cannot reject a rejected request"
    );
  });
  it("26.reject non-exising request should throw an error", async () => {
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];
    await expectRevert(
      this.CopyrightManagement.rejectAgreement(12, testRejectReason, {
        from: owner,
      }),
      "Request does not exist"
    );
  });
  //approve agreement
  it("27.non whitelisted user approve agreement should throw an error", async () => {
    const accounts = await web3.eth.getAccounts();
    const account2 = accounts[1];
    await expectRevert(
      this.CopyrightManagement.approveAgreement(1, { from: account2 }),
      whitelistErrorMsg
    );
  });
  it("28.approve non existing request should should throw an error", async () => {
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];
    await expectRevert(
      this.CopyrightManagement.approveAgreement(22, { from: owner }),
      "Request does not exist"
    );
  });
  it("29.approve request when you are not the owner of the content should throw an error ", async () => {
    const accounts = await web3.eth.getAccounts();
    const account6 = accounts[5];
    await this.CopyrightManagement.addUser("test", "test", "test5@test.com", {
      from: account6,
    });
    await this.CopyrightManagement.requestAgreement(
      0,
      purposeOfUse,
      fieldOfUse,
      { from: account6, value: web3.utils.toWei(updatedContentPrice) }
    );
    await expectRevert(
      this.CopyrightManagement.approveAgreement(2, { from: account6 }),
      "You are not the owner of the content"
    );
  });
  it("30.approve rejected request should throw an error", async () => {
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];
    await expectRevert(
      this.CopyrightManagement.approveAgreement(0, { from: owner }),
      "You cannot approve rejected request"
    );
  });
  it("31.approve approved content should throw an error", async () => {
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];
    await expectRevert(
      this.CopyrightManagement.approveAgreement(1, { from: owner }),
      "The request has already been approved"
    );
  });
  it("32.approve request should update request data on smart contract", async () => {
    const accounts = await web3.eth.getAccounts();
    const account6 = accounts[5];
    const owner = accounts[0];
    await this.CopyrightManagement.approveAgreement(3, { from: owner });
    const expectedRequest = {
      id: "3",
      licensee: account6,
      contentId: "0",
      purposeOfUse: purposeOfUse,
      fieldOfUse: fieldOfUse,
      price: web3.utils.toWei(updatedContentPrice),
      requestType: "2",
      rejectReason: "",
    };
    const request = await this.CopyrightManagement.requests(3);
    const actualRequest = {
      id: request.id.toString(),
      licensee: request.licensee,
      contentId: request.contentId.toString(),
      purposeOfUse: request.purposeOfUse,
      fieldOfUse: request.fieldOfUse,
      price: request.price.toString(),
      requestType: request.requestType.toString(),
      rejectReason: request.rejectReason,
    };
    assert.deepEqual(actualRequest, expectedRequest);
  });
  it("33.approve request should create new licensing agreement data on smart contract", async () => {
    const accounts = await web3.eth.getAccounts();
    const account7 = accounts[6];
    const owner = accounts[0];
    await this.CopyrightManagement.addUser("test", "test", "test6@test.com", {
      from: account7,
    });
    await this.CopyrightManagement.requestAgreement(
      0,
      purposeOfUse,
      fieldOfUse,
      { from: account7, value: web3.utils.toWei(updatedContentPrice) }
    );
    await this.CopyrightManagement.approveAgreement(4, { from: owner });
    const expectedAgreement = {
      id: "2",
      licensee: account7,
      licenser: owner,
      contentId: "0",
      purposeOfUse: purposeOfUse,
      fieldOfUse: fieldOfUse,
      price: web3.utils.toWei(updatedContentPrice),
    };
    const agreement = await this.CopyrightManagement.agreements(2);
    const actualAgreement = {
      id: agreement.id.toString(),
      licensee: agreement.licensee,
      licenser: agreement.licenser,
      contentId: agreement.contentId.toString(),
      purposeOfUse: agreement.purposeOfUse,
      fieldOfUse: agreement.fieldOfUse,
      price: agreement.price.toString(),
    };
    assert.deepEqual(actualAgreement, expectedAgreement);
  });
  it("34.approve agreement should transfer Ether amount of content price to the owner", async () => {
    const accounts = await web3.eth.getAccounts();
    const account8 = accounts[7];
    const owner = accounts[0];
    await this.CopyrightManagement.addUser("test", "test", "test7@test.com", {
      from: account8,
    });
    await this.CopyrightManagement.requestAgreement(
      0,
      purposeOfUse,
      fieldOfUse,
      { from: account8, value: web3.utils.toWei(updatedContentPrice) }
    );
    const oldBalance = await web3.eth.getBalance(owner);
    await this.CopyrightManagement.approveAgreement(5, { from: owner });
    const newBalance = await web3.eth.getBalance(owner);
    assert.isAbove(Number(newBalance), Number(oldBalance));
  });
});
