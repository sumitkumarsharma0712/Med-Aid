import { useEffect, useState } from "react";
import Header from "../components/site/Header";
import Footer from "../components/site/Footer";
import { api } from "../lib/api";
import { formatPrice } from "../lib/format";

export default function Purchases() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.purchases().then(setItems);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto flex-1 py-8">
        <h1 className="text-2xl font-semibold">Purchase History</h1>
        <div className="mt-6 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <div key={p.id} className="rounded-lg border p-3">
              <div className="font-medium">{p.listing.title}</div>
              <div className="text-sm text-muted-foreground">{formatPrice(p.listing.price)} • {new Date(p.purchasedAt).toLocaleString()}</div>
            </div>
          ))}
          {items.length === 0 && <div className="text-muted-foreground">No purchases yet.</div>}
        </div>
      </main>
      <Footer />
    </div>
  );
}
