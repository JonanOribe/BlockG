var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override");

var cors = require('cors');
app.use(cors());

const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
const QRContractABI = [{"inputs":[{"internalType":"string","name":"_nombre","type":"string"},{"internalType":"string","name":"_email","type":"string"}],"name":"compraEntrada","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"_nombre","type":"string"},{"internalType":"uint256","name":"_fecha","type":"uint256"},{"internalType":"uint256","name":"_cost","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"stateMutability":"payable","type":"receive"},{"inputs":[],"name":"admin","outputs":[{"internalType":"addresspayable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"asistente","outputs":[{"internalType":"string","name":"nombre","type":"string"},{"internalType":"string","name":"email","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"asistentes","outputs":[{"internalType":"addresspayable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"asistentesLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"cost","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fecha","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nombre","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"whoAmI","outputs":[{"internalType":"string","name":"_nombre","type":"string"},{"internalType":"string","name":"_email","type":"string"}],"stateMutability":"view","type":"function"}];
const QRContract = new web3.eth.Contract(QRContractABI, '0x0633cE19AA842769160d4CA31026BB80151e2b53'); //Change in first execution
let platformMainAddr = '0xfC459bA31941E90ef566324275862c439ac170D9'; //Change in first execution

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();

/**
 * Solicita una peticion de compra 
 * 
 * Request Body
 * {
 * "address": "0x5C3c837B9d1E6C5B18E98F51e8E5aa265b37f0DC",
 * "password": "!@superpassword",
 * "eventName": "Champions League",
 * "email": "test66@gmail.com",
 * "price": 230
 * }
 */
router.post("/requestTicket", async function (req, res) {
    //Unlock account
    console.table(req.body);
    web3.eth.personal.unlockAccount(req.body.address, req.body.password, 15000);
    //Send transaction
    var returnedValue = await QRContract.methods.compraEntrada(req.body.eventName, req.body.email).send({ from: req.body.address, value: req.body.price, gas:3000000});

    if (returnedValue.status === true) {
      res.send(JSON.stringify('GREEN'));

    } else {
      res.send(JSON.stringify('YELLOW'));
    }
  });

  /**
   * Genera una nueva cuenta que se le anade 5 ether
   *  
   * RequestBody
   * {
   *  "password" : "!@superpassword"
   * }
   */
  router.post("/requestNewAccount", async function (req, res) {
    (async () => {
      let newAccount = await web3.eth.personal.newAccount(req.body.password);
      web3.eth.sendTransaction({from: platformMainAddr, to:newAccount, value: web3.utils.toWei('5', 'ether'), gasLimit: 21000, gasPrice: 20000000000});

      const response = {"address" : newAccount};
      res.status(200).send(JSON.stringify(response));
    })();
  });


  /**
   * Obtener el precio del evento
   */
router.get("/getEventPrice", async function (req, res) {
  var returnedValue = await QRContract.methods.cost().call();

    res.status(200).send(JSON.stringify(returnedValue));
});

app.use(router);

app.listen(3000, function () {
  console.log("Node server running on http://localhost:3000");
});
