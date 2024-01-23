import { useState, useEffect } from "react";


const RecMemos = ({ reclamationContract }) => {
  const [Recmemos, setRecMemos] = useState([]);

  const handleAction = async (memo, accept) => {
    try {
      const tx = await reclamationContract.processReclamation(memo.id, accept);
      await tx.wait();
      if (accept) {
        const txx = await reclamationContract.Reclamationtransferfunds(memo.id);
        await txx.wait();
      }
      alert(`Reclamation ${accept ? 'approved' : 'rejected'} successfully`);
      window.location.reload();
    } catch (error) {
      console.error("Error processing reclamation:", error);
    }
  };

  useEffect(() => {
    const fetchRecmemos = async () => {
      if (reclamationContract) {
        const reclamations = await reclamationContract.getReclamationsByUser();
        setRecMemos(reclamations);
      }
    };

    fetchRecmemos();
  }, [reclamationContract]);

  return (
    <div className="container-fluid">
      <h3 style={{ textAlign: "center", marginTop: "20px" }}>Messages</h3>
      <table>
        <tbody>
          {Recmemos.map((memo) => (
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
                {memo.status}
              </td>
              <td>
                {/* Action buttons */}
                {memo.status === "Pending" && (
                  <>
                    <button onClick={() => handleAction(memo, true)}>Accept</button>
                    <button onClick={() => handleAction(memo, false)}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecMemos;
