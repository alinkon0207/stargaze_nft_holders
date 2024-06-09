// import logo from './logo.svg';
import './App.css';

import React, { useState } from "react";
const { CosmWasmClient } = require("@cosmjs/cosmwasm-stargate");


const rpcEndpoint = "https://rpc.stargaze-apis.com";


function App() {
  const [contractAddr, setContractAddr] = useState('stars1f0qqtkv8pwpevw7r6emc88x87n4krlmmy29lz4dknvvf46v32a6sel64hf');
  const [holdersList, setHoldersList] = useState([]);

  const updateHoldersList = async () => {
    if (contractAddr === "") return;

    const client = await CosmWasmClient.connect(rpcEndpoint);

    let query = { num_tokens: {} };
    const numNfts = (await client.queryContractSmart(contractAddr, query)).count;
    let owners = `Number of NFTs: ${numNfts}\r\n`;

    for (let i = 0; i < numNfts; i++) {
        try {
            query = { owner_of: {token_id: `${i + 1}`} };
            const owner = (await client.queryContractSmart(contractAddr, query)).owner;
            // console.log(`[${i + 1}] ${owner}`);
            owners = owners + `[${i + 1}] ${owner}\r\n`;
            setHoldersList(owners);
        } catch (err) {
            // console.log(`[${i + 1}] null`);
            owners = owners + `[${i + 1}] null\r\n`;
            setHoldersList(owners);
        }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
        <div>
          <span style={{fontSize: '16px'}}>Contract address:&nbsp;</span>
          <input type="text" id="contractAddr" style={{width: '600px', marginBottom: '20px'}} placeholder="Please input your contract address" value={contractAddr} onChange={(e) => setContractAddr(e.target.value)} />
        </div>
        <input type="button" value="Get holders list" style={{width: '200px', marginBottom: '20px'}} onClick={updateHoldersList} />
        <textarea id="holdersList" value={holdersList} readonly style={{width: '600px', height: '800px'}} />
      </header>
    </div>
  );
}

export default App;
