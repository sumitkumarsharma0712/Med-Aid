import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/site/Header";
import Footer from "../components/site/Footer";
import { api } from "../lib/api";
import { formatPrice } from "../lib/format";
import { useAuth } from "../context/AuthContext";

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState<any | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) api.getListing(id).then(setListing);
  }, [id]);

  async function addToCart() {
    if (!user) {
      navigate("/login");
      return;
    }
    await api.addToCart(listing.id);
    navigate("/cart");
  }

  if (!listing) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto flex-1 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="rounded-lg border overflow-hidden">
              <img src={listing.imageUrl || "/placeholder.svg"} alt={listing.title} className="w-full h-96 object-cover" />
            </div>
            <div className="mt-4">
              <h1 className="text-2xl md:text-3xl font-bold">{listing.title}</h1>
              <div className="mt-2 text-sm text-muted-foreground">{listing.category}</div>
              <div className="mt-4 text-base whitespace-pre-wrap">{listing.description}</div>
            </div>
          </div>

          <aside className="md:col-span-1">
            <div className="sticky top-24 rounded-lg border p-6 bg-card">
              <div className="text-muted-foreground">Seller</div>
              <div className="font-medium mt-1">{listing.sellerId}</div>
              <div className="mt-4 text-2xl font-extrabold text-primary">{formatPrice(listing.price)}</div>
              <div className="mt-4 flex flex-col gap-3">
                <button onClick={addToCart} className="w-full px-4 py-3 rounded-md bg-accent text-accent-foreground font-medium shadow-lg">Add to cart</button>
                <button onClick={async ()=>{await api.checkout();}} className="w-full px-4 py-3 rounded-md bg-primary text-primary-foreground font-medium">Buy now</button>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">Ships from EcoFinds. Returns accepted.</div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
