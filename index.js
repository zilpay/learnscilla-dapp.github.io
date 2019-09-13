/**
 * `window` is global object.
 * `window.zilPay` is injected object by ZilPay wallet.
 */

// Contract address SocialMediaPayment in blockchain Zilliqa.
var contractAddress = '';

async function getContractState() {
  // Asynchronous function which make requests to Zilliqa node
  // Zilliqa node response contract state in json format.

  // Create contract instance by address.
  var contract = window.zilPay.contracts.at(contractAddress)

  // Make reqeusts to jsonRPC.
  var state = await contract.getState();

  return state
}

async function changeName() {
  // Get this newname value from form.
  var newname = window.document.getElementById('new -user').value;
  var ZilAmount = window.document.getElementById('zil-amount').value;
  // Create utils instance for working with big number data.
  var utils = window.zilPay.utils;
  // Create contract instance by address.
  var contract = window.zilPay.contracts.at(contractAddress)
  // Create some amount via utils.
  var amount = utils.units.toQa(
    ZilAmount,
    utils.units.Units.Zil
  );
  // Create some gas price via utils.
  var gasPrice = utils.units.toQa(
    '1000', utils.units.Units.Li
  );
  // When you call any sign method, ZilPay show popup.
  var tx = await contract.call(
    'changeName', [{ // transition params.
      vname: "newname",
      type: "String",
      value: newname
    }],
    {
      amount: amount,
      gasPrice: gasPrice,
      gasLimit: utils.Long.fromNumber(9000)
    }
  );
  console.log(tx);
}

// This function auto run when browser will finish load dApp.
window.addEventListener("load", async () => {
  if (typeof window.zilPay === 'undefined') {
    // We need testing for if browser does not have ZilPay.
    alert('Please install ZilPay');
    return null
  } else if (!window.zilPay.isEnable) {
    // Also we need testing for if ZilPay wallet is block.
    alert('Please unlock ZilPay');
    return null
  }

  if (!zilPay.wallet.isConnect) {
    // Get grant for working with this domain.
    // When call this function ZilPay is show popup.
    const status = await connect();
    console.log('status', status);
  }
})
