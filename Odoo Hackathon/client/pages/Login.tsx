import Header from "../components/site/Header";
import Footer from "../components/site/Footer";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/market");
    } catch (e: any) {
      setError(e.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto flex-1 py-8 max-w-md">
        <h1 className="text-2xl font-semibold">Login</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {error && <div className="rounded-md bg-accent/10 text-accent px-3 py-2 text-sm">{error}</div>}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input type="password" className="mt-1 w-full rounded-md border px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground">Login</button>
          <p className="text-sm text-muted-foreground">
            No account? <Link to="/register" className="underline">Register</Link>
          </p>
        </form>
      </main>
      <Footer />
    </div>
  );
}
