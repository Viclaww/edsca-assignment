import React, { useState } from "react";
import { words } from "./word";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { sha256 } from "ethereum-cryptography/sha256.js";
import { toHex } from "ethereum-cryptography/utils";
import { utf8ToBytes } from "ethereum-cryptography/utils.js";
export const CreateWallet = () => {
  const [seedWords, setSeedWords] = useState([]);
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");

  const create = () => {
    const randomWord = () => {
      return words[Math.floor(Math.random() * words.length)];
    };

    let newSeedWords = [];
    for (let i = 0; i < 10; i++) {
      newSeedWords.push(randomWord());
    }
    const mnemonic = newSeedWords.join(",");
    const newPrivateKey = sha256(utf8ToBytes(mnemonic));

    setSeedWords(newSeedWords);
    setPrivateKey(newPrivateKey);

    const publicKeyBuffer = secp256k1.getPublicKey(newPrivateKey);
    const publicKeyHex = toHex(publicKeyBuffer);
    setPublicKey(publicKeyHex);
  };
  return (
    <div className="transfer container">
      <h1>Create wallet</h1>
      {privateKey ? (
        <div>
          <div>
            <h3>This are your Seed words</h3>
            <div className="phrase">
              {seedWords.map((word, index) => (
                <p key={index}>{word}</p>
              ))}
            </div>
            <p>Your address is: {publicKey}</p>
            <input className="button" type="button" value="Transfer" />
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
