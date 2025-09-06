import { useEffect, useMemo, useState } from "react";
import Header from "../components/site/Header";
import Footer from "../components/site/Footer";
import { api } from "../lib/api";
import { formatPrice } from "../lib/format";
import { Link } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState<{ items: { listingId: string; addedAt: number }[] }>({ items: [] });
  const [listings, setListings] = useState<any[]>([]);

  async function load() {
    const c = await api.cart();
    setCart(c);
    const all = await api.listListings();
    setListings(all.listings);
  }

  useEffect(() => {
    load();
  }, []);

  const items = cart.items
    .map((i) => listings.find((l) => l.id === i.listingId))
    .filter(Boolean) as any[];

  const total = useMemo(() => items.reduce((sum, x) => sum + x.price, 0), [items]);

  async function remove(id: string) {
    await api.removeFromCart(id);
    load();
  }

  async function checkout() {
    await api.checkout();
    load();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto flex-1 py-8">
        <h1 className="text-2xl font-semibold">Shopping Cart</h1>
        {items.length === 0 ? (
          <div className="mt-6 text-muted-foreground">
            Your cart is empty. <Link className="underline" to="/market">Browse items</Link>.
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              {items.map((l) => (
                <div key={l.id} className="flex gap-3 rounded-lg border p-3">
                  <div className="h-20 w-20 rounded overflow-hidden bg-muted/30">
                    <img src={l.imageUrl || "/placeholder.svg"} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{l.title}</div>
                    <div className="text-sm text-muted-foreground">{formatPrice(l.price)}</div>
                  </div>
                  <button onClick={() => remove(l.id)} className="px-3 py-1 rounded-md bg-accent text-accent-foreground text-sm h-min">Remove</button>
                </div>
              ))}
            </div>
            <div className="rounded-lg border p-4 h-min">
              <div className="flex items-center justify-between">
                <div>Subtotal</div>
                <div className="font-semibold">{formatPrice(total)}</div>
              </div>
              <button onClick={checkout} className="mt-4 w-full px-4 py-2 rounded-md bg-primary text-primary-foreground">Checkout</button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
