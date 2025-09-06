import { useEffect, useState } from "react";
import Header from "../components/site/Header";
import Footer from "../components/site/Footer";
import { api } from "../lib/api";

export default function Admin() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const d = await api.adminData();
        setData(d);
      } catch (e) {
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="min-h-screen"><Header /><main className="container mx-auto py-8">Loading...</main><Footer /></div>;

  if (!data) return <div className="min-h-screen"><Header /><main className="container mx-auto py-8">Unauthorized or no data</main><Footer /></div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto flex-1 py-8">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <section className="mt-6">
          <h2 className="font-semibold">Users</h2>
          <div className="mt-2 grid gap-2">
            {data.users.map((u: any) => (
              <div key={u.id} className="rounded-md border p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{u.name}</div>
                  <div className="text-sm text-muted-foreground">{u.email}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="font-semibold">Listings</h2>
          <div className="mt-2 grid gap-2">
            {data.listings.map((l: any) => (
              <div key={l.id} className="rounded-md border p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{l.title}</div>
                  <div className="text-sm text-muted-foreground">{l.category} • ${((l.price||0)/100).toFixed(2)}</div>
                </div>
                <div className="flex gap-2">
                  <a href={`/listing/${l.id}`} className="underline">View</a>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
