import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/auth.api";
import { useAuth } from "../context/AuthContext.jsx";

const Signup = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { saveAuth } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.email.trim() || !form.password) {
      setError("Email and password are required");
      return;
    }

    if (form.password.length < 6) {
      setError("Use at least 6 characters for the password");
      return;
    }

    setLoading(true);
    try {
      const response = await signup({
        email: form.email.trim(),
        password: form.password,
      });
      saveAuth(response.data);
      setSuccess("Account created successfully");
      navigate("/feed", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page narrow">
      <section className="panel">
        <h1>Signup</h1>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </label>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit" className="button" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="muted">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
};

export default Signup;
