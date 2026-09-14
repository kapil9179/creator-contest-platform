import { useState } from "react";
import { updateResidency } from "../api/user.api";
import { useAuth } from "../context/AuthContext.jsx";

const Profile = () => {
  const { token, user, updateUser } = useAuth();
  const [residency, setResidency] = useState(user?.residency || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!residency.trim()) {
      setError("Residency is required");
      return;
    }

    setLoading(true);
    try {
      const response = await updateResidency(token, residency.trim());
      updateUser({
        ...user,
        id: response.data._id || response.data.id || user?.id,
        email: response.data.email || user?.email,
        residency: response.data.residency,
      });
      setMessage(response.message);
    } catch (err) {
      if (err.status === 401) {
        window.dispatchEvent(new Event("auth:unauthorized"));
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page narrow">
      <section className="panel">
        <h1>Profile</h1>
        <p className="muted">{user?.email}</p>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Residency
            <input
              value={residency}
              onChange={(event) => setResidency(event.target.value)}
              placeholder="Example: Chhattisgarh"
            />
          </label>

          <p className="hint">
            Only Chhattisgarh residents are contest-eligible. Eligibility is
            evaluated by the backend.
          </p>

          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          <button type="submit" className="button" disabled={loading}>
            {loading ? "Saving..." : "Save Residency"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Profile;
