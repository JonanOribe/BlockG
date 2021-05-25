var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override");

/*const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
const NameContractABI = [{"constant": false,"inputs": [{"name": "newName","type": "string"}],"name": "setName","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "getName","outputs": [{"name": "","type": "string"}],"payable": false,"stateMutability": "view","type": "function"}]
const NameContract = new web3.eth.Contract(NameContractABI, '0x5eAFFf78dDe83A065a3bfC52Ca2fB98Bda5b645a');*/

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();

router.post("/requestTicket", async function (req, res) {
    console.log(req.body);
    
    //var returnedValue = await NameContract.methods.getName().call();
    var returnedValue = 'NOT_IMPLEMENTED';

    res.send("Request arrived, responde from S.C. --> " + returnedValue);
  });

app.use(router);

app.listen(3000, function () {
  console.log("Node server running on http://localhost:3000");
});
