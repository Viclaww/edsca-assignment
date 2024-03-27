const express = require("express");
const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");
const { sha256 } = require("ethereum-cryptography/sha256.js");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils.js");
const { bytesToHex } = require("ethereum-cryptography/utils.js");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
};
const seedphrases = {
  "0x1": [],
};
app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});
app.post("/create", (req, res) => {
  const { seedPhrase, address } = req.body;
  const hexAddress = address;
  seedphrases[hexAddress] = seedPhrase;
  setInitialBalance(hexAddress);
  res.send({ balance: balances[hexAddress] });
});
app.get("/balance", (req, res) => {
  res.send({ balances: balances });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, seed10, privateKey, message } = req.body;
  const messageHash = sha256(utf8ToBytes(message));
  setInitialBalance(recipient);

  if (seedphrases[sender] && seedphrases[sender][9] === seed10) {
    const senderPublicKey = toHex(secp256k1.getPublicKey(privateKey));
    const isPrivkeyCorrect = sender === senderPublicKey;
    if (isPrivkeyCorrect) {
      const signature = secp256k1.sign(messageHash, privateKey);
      const isSigned = secp256k1.verify(signature, messageHash, publicKey);
      if (isSigned) {
        if (balances[sender] < amount) {
          res.status(400).send({ message: "Not enough funds!" });
        } else {
          balances[sender] -= amount;
          balances[recipient] += amount;
          res.send({ balance: balances[sender] });
        }
      }
    } else {
      res.send({ message: "Wrong or no Private Key" });
    }
  } else {
    res.send({ message: "wrong seed Phrase" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 100;
  }
}
