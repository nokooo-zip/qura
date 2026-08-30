import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Logo, Spinner } from "../components/Common";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("admin@qura.app");
  const [password, setPassword] = useState("admin123");
  const [mode, setMode] = useState("login"); // login | register
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isLoggedIn) navigate("/admin", { replace: true });
  }, [isLoggedIn, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        const data = await api.login({ email, password });
        login(data.token, data.user);
        navigate("/admin");
      } else {
        await api.register({ email, password, name: "Admin" });
        const data = await api.login({ email, password });
        login(data.token, data.user);
        navigate("/admin");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md flex flex-col items-center">
        <Logo className="mb-10 text-5xl" />

        <h2 className="text-3xl font-black text-slate-800 mb-2">
          {mode === "login" ? "Welcome Back!" : "Create Account"}
        </h2>
        <p className="text-sm text-gray-500 mb-8 text-center">
          QR-driven micro-websites for small businesses
        </p>

        <form className="w-full space-y-5" onSubmit={handleSubmit}>
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-sm text-red-600 text-center bg-red-50 py-2 rounded-lg">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? <Spinner className="w-5 h-5 text-white" /> : null}
            {mode === "login" ? "Login" : "Register"}
          </Button>

          <div className="text-center mt-4">
            <button
              type="button"
              className="text-sm font-semibold text-slate-800 hover:underline"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
            >
              {mode === "login"
                ? "Need an account? Register"
                : "Already have an account? Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
