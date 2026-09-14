import { useEffect, useState } from "react";
import {
  failKyc,
  fetchWinners,
  generateWinners,
  passKyc,
  requestKyc,
} from "../api/admin.api";

const labels = {
  GRAND_PRIZE: "Grand Prize",
  CONSISTENCY_FIRST: "Consistency 1st",
  CONSISTENCY_SECOND: "Consistency 2nd",
  TOP_PERFORMER: "Top Performer",
  CATEGORY_FIRST: "Category 1st",
  CATEGORY_SECOND: "Category 2nd",
  NOT_REQUESTED: "Not Requested",
  REQUESTED: "Requested",
  PASSED: "Passed",
  FAILED: "Failed",
};

const label = (value) =>
  labels[value] ||
  String(value || "")
    .toLowerCase()
    .replace(/_/g, " ");

const AdminWinners = () => {
  const [winners, setWinners] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState("");

  const loadWinners = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetchWinners();
      setWinners(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWinners();
  }, []);

  const runAction = async (id, callback) => {
    setActionId(id);
    setError("");
    setMessage("");

    try {
      const response = await callback();
      setMessage(response.message);
      await loadWinners();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId("");
    }
  };

  const handleGenerate = () =>
    runAction("generate", () => generateWinners());

  const renderKycActions = (winner) => {
    if (winner.kycStatus === "NOT_REQUESTED") {
      return (
        <button
          type="button"
          className="button secondary small"
          disabled={actionId === `request-${winner.id}`}
          onClick={() =>
            runAction(`request-${winner.id}`, () => requestKyc(winner.id))
          }
        >
          Request KYC
        </button>
      );
    }

    if (winner.kycStatus === "REQUESTED") {
      return (
        <div className="button-row">
          <button
            type="button"
            className="button secondary small"
            disabled={actionId === `pass-${winner.id}`}
            onClick={() => runAction(`pass-${winner.id}`, () => passKyc(winner.id))}
          >
            Pass
          </button>
          <button
            type="button"
            className="button danger small"
            disabled={actionId === `fail-${winner.id}`}
            onClick={() => runAction(`fail-${winner.id}`, () => failKyc(winner.id))}
          >
            Fail
          </button>
        </div>
      );
    }

    return <span className={`status ${winner.kycStatus?.toLowerCase()}`}>{label(winner.kycStatus)}</span>;
  };

  return (
    <main className="page">
      <div className="page-title">
        <div>
          <h1>Admin Winners</h1>
          <p className="muted">Winner generation and KYC status</p>
        </div>
        <button
          type="button"
          className="button"
          disabled={actionId === "generate"}
          onClick={handleGenerate}
        >
          {actionId === "generate" ? "Generating..." : "Generate Winners"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      {loading && <p className="muted">Loading winners...</p>}

      <section className="table-panel">
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Prize Tier</th>
              <th>Category</th>
              <th>KYC Status</th>
              <th>KYC Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && winners.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-cell">
                  No winners found
                </td>
              </tr>
            ) : (
              winners.map((winner) => (
                <tr key={winner.id}>
                  <td>{winner.userId}</td>
                  <td>{label(winner.tier)}</td>
                  <td>{winner.category || "-"}</td>
                  <td>
                    <span className={`status ${winner.kycStatus?.toLowerCase()}`}>
                      {label(winner.kycStatus)}
                    </span>
                  </td>
                  <td>{renderKycActions(winner)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default AdminWinners;
