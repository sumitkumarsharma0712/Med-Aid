import Header from "../components/site/Header";
import Footer from "../components/site/Footer";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sell() {
  const [categories, setCategories] = useState<string[]>([]);
  const [form, setForm] = useState({ title: "", description: "", category: "Other", price: 0, imageUrl: "" });
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    api.listListings().then((d) => setCategories(d.categories));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    const payload = { ...form, price: Math.round(Number(form.price) * 100) };
    const l = await api.createListing(payload);
    navigate(`/listing/${l.id}`);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto flex-1 py-8">
        <h1 className="text-2xl font-semibold">Sell an item</h1>
        <form onSubmit={submit} className="mt-6 grid gap-4 max-w-2xl">
          <div>
            <label className="text-sm font-medium">Title</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea className="mt-1 w-full rounded-md border px-3 py-2" rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Category</label>
              <select className="mt-1 w-full rounded-md border px-3 py-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Price (USD)</label>
              <input type="number" min="0" step="0.01" className="mt-1 w-full rounded-md border px-3 py-2" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </div>
            <div>
              <label className="text-sm font-medium">Image URL</label>
              <input placeholder="https://..." className="mt-1 w-full rounded-md border px-3 py-2" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
            </div>
          </div>
          <button className="mt-2 w-full md:w-auto px-5 py-3 rounded-md bg-primary text-primary-foreground">Publish listing</button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
