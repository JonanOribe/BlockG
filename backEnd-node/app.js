var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override");

var cors = require('cors');
app.use(cors());

const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
const QRContractABI = [{"inputs":[{"internalType":"string","name":"_nombre","type":"string"},{"internalType":"string","name":"_email","type":"string"}],"name":"compraEntrada","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_nombre","type":"string"},{"internalType":"uint256","name":"_fecha","type":"uint256"}],"name":"creaEvento","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_nombre","type":"string"},{"internalType":"uint256","name":"_fecha","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"stateMutability":"payable","type":"receive"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"asistente","outputs":[{"internalType":"string","name":"nombre","type":"string"},{"internalType":"string","name":"email","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"asistentes","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"asistentesLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"eventos","outputs":[{"internalType":"string","name":"nombre","type":"string"},{"internalType":"uint256","name":"fecha","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fecha","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nombre","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"whoAmI","outputs":[{"internalType":"string","name":"_nombre","type":"string"},{"internalType":"string","name":"_email","type":"string"}],"stateMutability":"view","type":"function"}]
const QRContract = new web3.eth.Contract(QRContractABI, '0xe3A376D67011739894Fe944B716DDa91E57E2C89');

var accountsCounter = 0;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();

router.post("/requestTicket", async function (req, res) {
    console.log(req.body);

    const accounts = await web3.eth.getAccounts();
    let platformMainAddr = accounts[accountsCounter];
    var returnedValue = await QRContract.methods.compraEntrada("Chelsea-Manchester City", "test@gmail.com").send({ from: platformMainAddr, gas:3000000});

    const SCResponse = JSON.stringify(returnedValue);

    if (SCResponse.status === true) {
      res.send("GREEN");
    } else {
      res.send("RED");
    }

    accountsCounter++;
  });

app.use(router);

app.listen(3000, function () {
  console.log("Node server running on http://localhost:3000");
});
