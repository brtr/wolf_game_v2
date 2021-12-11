import { WoolfAddress, WoolfABI, BarnAddress, BarnABI } from "./data.js";

(function() {
  let loginAddress;
  const SERVER_URL = "";
  const API_KEY = "";
  Moralis.initialize(API_KEY);
  Moralis.serverURL = SERVER_URL;

  const loginButton = document.getElementById('btn-login');
  const logoutButton = document.getElementById('btn-logout');
  const address = document.getElementById('address');
  const mintButton = document.getElementById('btn-mint');
  const stakeButton = document.getElementById('btn-stake');
  const unstakeButton = document.getElementById('btn-unstake');
  const claimButton = document.getElementById('btn-claim');

  const toggleLoader = function() {
    const x = document.getElementById('loader');
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

  const toggleLoginBtns = function() {
    if (loginAddress == null) {
      loginButton.style.display = "block"
      logoutButton.style.display = "none"
      address.style.display = "none"
    } else {
      loginButton.style.display = "none"
      logoutButton.style.display = "block"

      address.textContent = loginAddress;
      address.style.display = "block"
    }
  }

  const login = function() {
    Moralis.authenticate()
    .then(function (user) {
      loginAddress = user.get("ethAddress");
      toggleLoader();
      toggleLoginBtns();
      console.log(loginAddress);
    })
    .catch(function (error) {
      toggleLoader();
      toggleLoginBtns();
      console.log('Error: ', error);
    });
  }

  // Check if user is logged in
  const checkUserLogin = function() {
    Moralis.User.currentAsync()
      .then(function(user) {
        if (!user) {
          alert("You need login first");
          toggleLoader();
          login();
        }
      })
      .catch(function (error) {
        console.log('Error: ', error);
      });
  }

  const writeFunc = function(options) {
    checkUserLogin();
    console.log("options: ", options);
    Moralis.executeFunction(options).then(function() {
      toggleLoader();
      alert('Success')
    }).catch(function (error) {
      toggleLoader();
      console.log('Error: ', error);
    });
  }

  // Check if user change account
  const checkUser = function() {
    Moralis.onAccountsChanged(function(accounts) {
      loginAddress = accounts[0];
      Moralis.enableWeb3();
      toggleLoginBtns()
      console.log("Account changed: ", loginAddress);
    });

    const user = Moralis.User.current();
    Moralis.enableWeb3(); if (user);
    loginAddress = user ? user.get("ethAddress") : null;
    toggleLoginBtns()
    toggleLoader();
    console.log("Account changed: ", loginAddress);
  };

  checkUser();

  loginButton.addEventListener('click', function () {
    toggleLoader();
    login();
  })

  logoutButton.addEventListener('click', function () {
    toggleLoader();
    Moralis.User.logOut()
      .then(function () {
        loginAddress = null;
        toggleLoader();
        toggleLoginBtns();
      })
      .catch(function (error) {
        toggleLoader();
        console.log('Error: ', error);
      });
  })

  mintButton.addEventListener('click', function () {
    toggleLoader();
    const amount = document.getElementById("mintCount").value;
    const totalPrice = 0.001 * amount;
    const options = {
      contractAddress: WoolfAddress,
      functionName: "mint",
      abi: WoolfABI,
      msgValue: Moralis.Units.ETH(totalPrice),
      params: {
        amount: amount,
        stake: "true",
        score: "0",
        sender: loginAddress
      }
    }

    writeFunc(options);
  });

  stakeButton.addEventListener('click', function() {
    toggleLoader();
    const tokenId = document.getElementById("stakeTokenId").value;
    const options = {
      contractAddress: BarnAddress,
      functionName: "addManyToBarnAndPack",
      abi: BarnABI,
      params: {
        account: loginAddress,
        tokenIds: [tokenId]
      }
    }

    writeFunc(options);
  });

  unstakeButton.addEventListener('click', function() {
    toggleLoader();
    const tokenId = document.getElementById("unstakeTokenId").value;
    const options = {
      contractAddress: BarnAddress,
      functionName: "claimManyFromBarnAndPack",
      abi: BarnABI,
      params: {
        unstake: "true",
        tokenIds: [tokenId]
      }
    }

    writeFunc(options);
  })

  claimButton.addEventListener('click', function() {
    toggleLoader();
    const tokenId = document.getElementById("claimTokenId").value;
    const options = {
      contractAddress: BarnAddress,
      functionName: "claimManyFromBarnAndPack",
      abi: BarnABI,
      params: {
        unstake: "false",
        tokenIds: [tokenId]
      }
    }

    writeFunc(options);
  })
})();