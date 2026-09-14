import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth.api";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { saveAuth } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const response = await login({
        email: form.email.trim(),
        password: form.password,
      });
      saveAuth(response.data);
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
        <h1>Login</h1>
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
              autoComplete="current-password"
            />
          </label>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="muted">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
