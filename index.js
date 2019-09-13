/**
 * `window` is global object.
 * `window.zilPay` is injected object by ZilPay wallet.
 */

// Contract address SocialMediaPayment in blockchain Zilliqa.
var contractAddress = 'zil1833t7pwvtx0h8mrcd2mwq32ends7dnna5t369f';

// Asynchronous function which make requests to Zilliqa node
// Zilliqa node response contract state in json format.
async function getContractState() {
  // Create contract instance by address.
  var contract = window.zilPay.contracts.at(contractAddress);

  // Make reqeusts to jsonRPC.
  var state = await contract.getState();

  return state;
}

// This function observable when transaction will be completed.
function observableTransaction(transactionId) {
  // Hide this button and show loader.
  window.document.getElementById('btn').style.display = 'none';
  window.document.getElementById('loader').style.display = 'block';

  // Create interval for listing transaction, each 3s.
  var int = setInterval(async () => {
    window.zilPay.blockchain
      .getTransaction(transactionId)
      .then(tx => {
        console.log(tx);
        window.document.getElementById('code').innerHTML = JSON.stringify(tx, null, 4);
        window.document.getElementById('btn').style.display = 'block';
        window.document.getElementById('loader').style.display = 'none';
        clearInterval(int);
      })
      .catch(err => console.log('next', err));
  }, 3000);
}

// This function call the transition method from contract.
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
  observableTransaction(tx.TranID);
}

// This function auto run when browser will finish load dApp.
window.addEventListener("load", async () => {
  if (typeof window.zilPay === 'undefined') {
    // We need testing for if browser does not have ZilPay.
    alert('Please install ZilPay');
    return null;
  } else if (!window.zilPay.isEnable) {
    // Also we need testing for if ZilPay wallet is block.
    alert('Please unlock ZilPay');
    return null;
  }

  if (!zilPay.wallet.isConnect) {
    // Get grant for working with this domain.
    // When call this function ZilPay is show popup.
    const status = await connect();
    console.log('status', status);
  }
})
