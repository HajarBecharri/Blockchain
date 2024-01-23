import { useState, useEffect } from 'react';
import insuranceAbi from "./contractJson/InsuranceContract.json";  
import reclamationAbi from "./contractJson/ReclamationContract.json";  
import { ethers } from "ethers";
import InssMemos from './components/InssuranceMemo';
import Buy from './components/Buy';
import Reclamer from './components/Reclamation';
import RecMemos from './components/RecMemos';

function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    insuranceContract: null,
    reclamationContract: null,
  });
  const [account, setAccount] = useState('Not connected');

  useEffect(() => {
    const template = async () => {
      const insuranceContractAddress = "0xa1589bd8752F84c3f52a734a397197E4642e86ef";
      const reclamationContractAddress = "0x3d18A2720c0Ea3CBb374851b63223b1d82a483AB";
      const insuranceContractABI = insuranceAbi.abi;
      const reclamationContractABI = reclamationAbi.abi;

      try {
        const { ethereum } = window;
        const accounts = await ethereum.request({
          method: "eth_requestAccounts"
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        setAccount(accounts[0]);
        const provider = new ethers.providers.Web3Provider(ethereum);  // Lecture de la Blockchain
        const signer = provider.getSigner();  // Écriture sur la blockchain

        const insuranceContract = new ethers.Contract(
          insuranceContractAddress,
          insuranceContractABI,
          signer
        );

        const reclamationContract = new ethers.Contract(
          reclamationContractAddress,
          reclamationContractABI,
          signer
        );

        setState({
          provider,
          signer,
          insuranceContract,
          reclamationContract,
        });

      } catch (error) {
        console.log(error);
      }
    };

    template();
  }, []);

  return (
    <div>
      <p style={{ marginTop: "10px", marginLeft: "5px" }}>
        <small>Connected Account - {account}</small>
      </p>

      <Buy insuranceContract={state.insuranceContract} />
      <InssMemos insuranceContract={state.insuranceContract} />
      <Reclamer reclamationContract={state.reclamationContract} />
      <RecMemos reclamationContract={state.reclamationContract} />
    </div>
  );
}

export default App;
