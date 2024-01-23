import { useState, useEffect } from "react";
import "./InssuranceMemo.css";

const InssMemos = ({ insuranceContract }) => {
  const [Inssmemos, setInssMemos] = useState([]);

  const reactivateInsurance = async (id) => {
    try {
      const tx = await insuranceContract.restartInsurance(id);
      await tx.wait();
      const transaction1 = await insuranceContract.Insurancetransferfunds(id);
      await transaction1.wait();
      alert(`done successfully`);
      window.location.reload();
    } catch (error) {
      console.error("Error processing reactivation:", error);
    }
  };

  useEffect(() => {
    const fetchInssmemos = async () => {
      if (insuranceContract) {
        const insurances = await insuranceContract.getInsurances();
        setInssMemos(insurances);
      }
    };

    fetchInssmemos();
  }, [insuranceContract]);

  return (
    <div className="container-fluid">
      <h3 style={{ textAlign: "center", marginTop: "20px" }}>Messages</h3>
      <table>
        <tbody>
          {Inssmemos.map((memo) => (
            <tr key={memo.id.toString()}>
              <td
                style={{
                  backgroundColor: "dodgerblue",
                  border: "1px solid white",
                  borderCollapse: "collapse",
                  padding: "7px",
                  width: "100px",
                  color: "white",
                }}
              >
                {memo.id.toString()}
              </td>
              <td
                style={{
                  backgroundColor: "dodgerblue",
                  border: "1px solid white",
                  borderCollapse: "collapse",
                  padding: "7px",
                  width: "800px",
                  color: "white",
                }}
              >
                {new Date(memo.timestamp * 1000).toLocaleString()}
              </td>
              <td
                style={{
                  backgroundColor: "dodgerblue",
                  border: "1px solid white",
                  borderCollapse: "collapse",
                  padding: "7px",
                  width: "300px",
                  color: "white",
                }}
              >
                {memo.etudiant}
              </td>
              <td
                className="container-fluid"
                style={{
                  backgroundColor: "dodgerblue",
                  border: "1px solid white",
                  borderCollapse: "collapse",
                  padding: "7px",
                  width: "400px",
                  color: "white",
                }}
              >
                {memo.amount.toString()}
              </td>
              <td>
                {!memo.active && (
                  <button onClick={() => reactivateInsurance(memo.id)}>
                    Reactivate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InssMemos;
