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

  console.log(state);

  window.document.getElementById('current-user').value = state['username'];

  return state;
}

// This function observable when transaction will be completed.
function observableTransaction(transactionId) {
  const viewblock = 'https://viewblock.io/zilliqa';
  // Hide this button and show loader.
  window.document.getElementById('btn').style.display = 'none';
  window.document.getElementById('loader').style.display = 'block';

  // Create interval for listing transaction, each 3s.
  var int = setInterval(async () => {
    window.zilPay.blockchain
      .getTransaction(transactionId)
      .then(tx => {
        // window.document.getElementById('code').innerHTML = JSON.stringify(tx, null, 4);
        window.document.getElementById('btn').style.display = 'block';
        window.document.getElementById('loader').style.display = 'none';

        window.document.getElementById('handler').style.display = "block";
        window.document.getElementById('viewblock').href = viewblock + '/tx/' + transactionId + '?network=testnet';
        // If transaction is success then get new state of contract.
        if (tx.receipt.success) {
          return getContractState();
        }

        return null;
      })
      .then(() => clearInterval(int))
      .catch(err => console.log('next', err));
  }, 3000);
}

// This function call the transition method from contract.
async function changeName() {
  // Get this newname value from form.
  var newname = window.document.getElementById('new-user').value;
  // Create utils instance for working with big number data.
  var utils = window.zilPay.utils;
  // Create contract instance by address.
  var contract = window.zilPay.contracts.at(contractAddress)
  // Create some amount via utils.
  var amount = utils.units.toQa(
    0, // This transaction don't send some Zil.
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

// Function will run ZilPay test and will get the state contract.
async function run() {
  if (typeof window.zilPay === 'undefined') {
    // We need testing for if browser does not have ZilPay.
    alert('Please install ZilPay');
    return null;
  } else if (!window.zilPay.wallet.isEnable) {
    // Also we need testing for if ZilPay wallet is block.
    alert('Please unlock ZilPay');
    return null;
  }

  if (!zilPay.wallet.isConnect) {
    // Get grant for working with this domain.
    // When call this function ZilPay is show popup.
    const status = await window.zilPay.wallet.connect();
    console.log('status', status);
  }

  await getContractState();
}

// This function auto run when browser will finish load dApp.
window.addEventListener("load", () => {
  setTimeout(() => run(), 1000);
})
