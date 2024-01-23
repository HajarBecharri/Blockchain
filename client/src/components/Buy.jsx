import { useState } from "react";
import { ethers } from "ethers";
import "./Buy.css";

const Buy = ({ insuranceContract }) => {
  const [transactionResult, setTransactionResult] = useState(null);

  const createInsurance = async (event) => {
    event.preventDefault();

    const address = document.querySelector("#address").value;
    const id = document.querySelector("#id").value;
    const amount = { value: ethers.utils.parseEther("0.001") };

    try {
      const transaction = await insuranceContract.createInsurance(
        ethers.utils.getAddress(address),
        4,
        amount
      );

      await transaction.wait();

      const transaction1 = await insuranceContract.transferToSociety();
      await transaction1.wait();

      setTransactionResult("success");
      alert("Transaction is successful");
      window.location.reload();
    } catch (error) {
      setTransactionResult("error");
      alert(`Transaction failed: ${error.message}`);
    }
  };

  return (
    <div className="center">
      <h1>Thanks</h1>
      {transactionResult === "success" && (
        <div className="success-alert">Transaction successful!</div>
      )}
      {transactionResult === "error" && (
        <div className="error-alert">
          Transaction failed. Please try again.
        </div>
      )}
      <form onSubmit={createInsurance}>
        <input
          type="text"
          defaultValue="0x0A83F0056d7c2788aeae4C736fa2a4b667243C16"
          hidden
          id="address"
        />
        <div className="inputbox"></div>
        <div className="inputbox">
          <input type="submit" value="1" id="id" />
        </div>
        <div className="inputbox">
          <input type="submit" value="Pay" disabled={!insuranceContract} />
        </div>
      </form>
    </div>
  );
};

export default Buy;
