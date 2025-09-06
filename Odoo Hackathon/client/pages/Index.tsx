import { useEffect, useState } from "react";
import Header from "../components/site/Header";
import Footer from "../components/site/Footer";
import { Link, useNavigate } from "react-router-dom";
import ListingCard from "../components/site/ListingCard";
import FloatingCTA from "../components/site/FloatingCTA";
import { api } from "../lib/api";

export default function Index() {
  const navigate = useNavigate();
  const [data, setData] = useState<{ listings: any[]; categories: string[] }>({ listings: [], categories: [] });

  useEffect(() => {
    api.listListings().then(setData).catch(() => setData({ listings: [], categories: [] }));
  }, []);

  const featured = data.listings.slice(0, 8);

  async function addPromoToCart() {
    try {
      await api.addToCart("promo-coral-tee");
      navigate("/cart");
    } catch (e) {
      console.warn("promo add failed", e);
      navigate("/market?promo=coral-tee");
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative">
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right bottom, rgb(229, 219, 209), rgb(247, 245, 243))' }} />
          <div className="relative container mx-auto py-16 md:py-24 grid gap-8 md:grid-cols-2 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm text-accent">
                Sustainable marketplace
              </div>
              <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
                Give items a second life with EcoFinds
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-prose">
                Buy and sell quality pre-owned goods. Save money, reduce waste, and join a community that cares about our planet.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/market" className="px-5 py-3 rounded-md bg-primary text-primary-foreground font-medium">
                  Browse listings
                </Link>
                <Link to="/sell" className="px-5 py-3 rounded-md bg-accent text-accent-foreground font-medium">
                  Sell an item
                </Link>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">Ivory • Sage • Terracotta • Evergreen</div>
            </div>
            <div className="rounded-xl border bg-card p-4 grid grid-cols-2 gap-4">
              {featured.length === 0 ? (
                <div className="col-span-2 text-center text-muted-foreground py-10">No listings yet — be the first to list!</div>
              ) : (
                <>
                  {featured.map((l) => (
                    <ListingCard key={l.id} listing={l} />
                  ))}
                </>
              )}
            </div>
          </div>
        </section>

        <section className="container mx-auto py-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Latest listings</h2>
            <Link to="/market" className="text-sm text-primary underline">
              View all
            </Link>
          </div>
          <div className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {(data.listings || []).slice(0, 12).map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      </main>
      <FloatingCTA />
      <Footer />
    </div>
  );
}
