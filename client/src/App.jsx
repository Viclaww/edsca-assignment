import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";
import { CreateWallet } from "./CreateWallet";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  return (
    <div className="app">
      <CreateWallet privateKey={privateKey} setPrivateKey={setPrivateKey} />
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <Transfer
        setBalance={setBalance}
        privateKey={privateKey}
        address={address}
      />
    </div>
  );
}

export default App;
