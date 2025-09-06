import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/site/Header";
import Footer from "../components/site/Footer";
import ListingCard from "../components/site/ListingCard";
import { api } from "../lib/api";

export default function Marketplace() {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("relevance");
  const [data, setData] = useState<{ listings: any[]; categories: string[] }>({ listings: [], categories: [] });

  // Sync category with URL query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const c = params.get("category") || "";
    if (c && c !== category) setCategory(c);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  async function load() {
    const d = await api.listListings({ search: query, category });
    let listings = d.listings;
    if (sort === "price_asc") listings = listings.slice().sort((a, b) => a.price - b.price);
    if (sort === "price_desc") listings = listings.slice().sort((a, b) => b.price - a.price);
    setData({ listings, categories: d.categories });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, category, sort]);

  const total = useMemo(() => data.listings.length, [data.listings]);

  const showPotteryBanner = (category || "").toLowerCase().includes("pottery");
  const potteryImage = "https://cdn.builder.io/api/v1/image/assets%2Fc89b2bcccff34daeac7e499342800fef%2F70d6738648ab4566b3ce7f72f6fd9d1a?format=webp&width=800";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto flex-1 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-md border p-4">
                <h3 className="font-semibold mb-2">Refine by</h3>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-2 w-full rounded-md border px-3 py-2">
                    <option value="">All</option>
                    {data.categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium">Price</label>
                  <div className="mt-2 flex gap-2">
                    <input placeholder="Min" className="w-1/2 rounded-md border px-2 py-1 text-sm" />
                    <input placeholder="Max" className="w-1/2 rounded-md border px-2 py-1 text-sm" />
                  </div>
                </div>
              </div>
              <div className="rounded-md border p-4">
                <h3 className="font-semibold mb-2">Delivery</h3>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" /> Prime eligible
                </label>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-3">
            {showPotteryBanner && (
              <div className="rounded-md overflow-hidden mb-6">
                <div className="relative h-44 md:h-64 w-full">
                  <img src={potteryImage} alt="Pottery banner" className="w-full h-full object-cover" />
                  <div className="absolute left-6 bottom-6 text-white">
                    <h2 className="text-2xl font-extrabold">Pottery & Clay</h2>
                    <p className="mt-1">Handmade pieces and artisan ceramics</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">{total} results</div>
                <h1 className="text-2xl font-semibold mt-1">All results</h1>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-muted-foreground">Sort</label>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-md border px-3 py-2">
                  <option value="relevance">Relevance</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="mt-4 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">

              {data.listings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
