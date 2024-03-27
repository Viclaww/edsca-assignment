import React, { useState } from "react";
import { words } from "./word";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { sha256 } from "ethereum-cryptography/sha256.js";
import { bytesToHex as toHex } from "ethereum-cryptography/utils.js";
import { utf8ToBytes } from "ethereum-cryptography/utils.js";
import server from "./server";
export const CreateWallet = ({ privateKey, setPrivateKey }) => {
  const [seedWords, setSeedWords] = useState([]);
  const [publicKey, setPublicKey] = useState("");
  const [show, setShow] = useState(false); //  to toggle phrase Visibility

  const create = async () => {
    const randomWord = () => {
      return words[Math.floor(Math.random() * words.length)]; // creating random mnemonics
    };

    let newSeedWords = [];
    for (let i = 0; i < 10; i++) {
      newSeedWords.push(randomWord());
    }
    const mnemonic = newSeedWords.join(","); // changing mnemonic to string
    const newPrivateKey = sha256(utf8ToBytes(mnemonic)); // privatekey from mnemonic
    const privateKeyHex = toHex(newPrivateKey);
    setSeedWords(() => [...newSeedWords]);
    setPrivateKey(() => privateKeyHex);

    const publicKeyBuffer = secp256k1.getPublicKey(newPrivateKey);
    const publicKeyHex = toHex(publicKeyBuffer);
    setPublicKey(() => publicKeyHex);
    try {
      // creating the wallet
      await server.post("/create", {
        seedPhrase: newSeedWords,
        address: publicKeyHex,
      });
    } catch (error) {}
  };

  return (
    <div className="transfer container">
      <h1>Create wallet</h1>

      {/* Check for private key */}
      {privateKey ? (
        <div>
          <div>
            <h3>This are your Seed words</h3>
            <div className="phrase">
              {seedWords.map((word, index) => (
                <p className={show ? "seedphraseblur" : ""} key={index}>
                  {word}
                </p>
              ))}
              <input
                onClick={() => setShow(!show)}
                className="button"
                type="button"
                value={show ? "hide phrase" : "show phrase"}
              />
            </div>
            <p className="wrap">Your address is: {publicKey}</p>
          </div>
        </div>
      ) : (
        <input
          onClick={create}
          className="button"
          type="button"
          value="Create Wallet"
        />
      )}
    </div>
  );
};
