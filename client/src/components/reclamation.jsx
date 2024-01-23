import {ethers} from "ethers"
import "./Buy.css";
const Reclamer=({reclamationContract})=>{

    const ReclamationChai = async(event)=>{
      event.preventDefault();
      const address = document.querySelector("#addressSos").value;
      const amountInput = document.querySelector("#amount").value;
      const amount = {value:ethers.utils.parseEther("0.001")};
      const transaction = await reclamationContract.submitReclamation(ethers.utils.getAddress(address),amount)
      await transaction.wait();
      alert("Reclamation is successul");
      window.location.reload();
    }
    
    return  (
      <div className="center">
       <h1>Reclamation</h1>
        <form onSubmit={ReclamationChai}>
        <input type="text" defaultValue="0x0A83F0056d7c2788aeae4C736fa2a4b667243C16" hidden id="addressSos" />
          <div className="inputbox">
            <input type="text" required="required" id="amount" />
            <span>amount</span>
          </div>
          <div className="inputbox">
            <input type="submit" value="Reclamer"  disabled={!reclamationContract}/>
          </div>
        </form>
          
        </div>
      );
}
export default Reclamer;