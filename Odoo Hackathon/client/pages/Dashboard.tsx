import { useEffect, useState } from "react";
import Header from "../components/site/Header";
import Footer from "../components/site/Footer";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, refresh } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, [user]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    await api.updateMe({ name, email });
    await refresh();
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto flex-1 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h1 className="text-2xl font-semibold">My Profile</h1>
            <form onSubmit={save} className="mt-6 space-y-4 max-w-md">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input className="mt-1 w-full rounded-md border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input className="mt-1 w-full rounded-md border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground">Save</button>
              {saved && <span className="ml-2 text-sm text-muted-foreground">Saved</span>}
            </form>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Your activity</h2>
            <div className="mt-4 grid gap-2">
              <Link to="/my-listings" className="underline">Manage your listings</Link>
              <Link to="/purchases" className="underline">View purchase history</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
