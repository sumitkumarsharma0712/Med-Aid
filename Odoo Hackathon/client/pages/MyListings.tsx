import { useEffect, useState } from "react";
import Header from "../components/site/Header";
import Footer from "../components/site/Footer";
import { api } from "../lib/api";
import { formatPrice } from "../lib/format";

export default function MyListings() {
  const [items, setItems] = useState<any[]>([]);

  async function load() {
    const d = await api.myListings();
    setItems(d as any);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    await api.deleteListing(id);
    load();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto flex-1 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">My Listings</h1>
        </div>
        <div className="mt-6 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {items.map((l) => (
            <div key={l.id} className="rounded-lg border p-3">
              <div className="flex gap-3">
                <div className="h-20 w-20 bg-muted/30 rounded overflow-hidden">
                  <img src={l.imageUrl || "/placeholder.svg"} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{l.title}</div>
                  <div className="text-sm text-muted-foreground">{formatPrice(l.price)}</div>
                  <div className="mt-2 flex gap-2">
                    <a href={`/listing/${l.id}`} className="px-3 py-1 rounded-md bg-secondary text-sm">
                      View
                    </a>
                    <button onClick={() => remove(l.id)} className="px-3 py-1 rounded-md bg-accent text-accent-foreground text-sm">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
