import { Link } from "react-router-dom";
import { formatPrice } from "../../lib/format";
import { useState } from "react";
import { api } from "../../lib/api";

export default function ListingCard({ listing }: { listing: any }) {
  // Map some known listing ids to new image urls (overrides seed placeholder)
  const imageOverrides: Record<string, string> = {
    "promo-coral-tee": "https://cdn.builder.io/api/v1/image/assets%2Fc89b2bcccff34daeac7e499342800fef%2Ffb963d13e69f4fc58b163ced04727850?format=webp&width=800",
    // kitchen mixer listing id may vary, fallback by title
  };
  let src = listing.imageUrl || "/placeholder.svg";
  if (listing.id && imageOverrides[listing.id]) src = imageOverrides[listing.id];
  if (listing.title && /kitchen mixer/i.test(listing.title)) src = "https://cdn.builder.io/api/v1/image/assets%2Fc89b2bcccff34daeac7e499342800fef%2F94e5426abe1b4706a20f392e86f0c476";
  if (listing.title && /guitar/i.test(listing.title)) src = "https://cdn.builder.io/api/v1/image/assets%2Fc89b2bcccff34daeac7e499342800fef%2Fca27ea1504604305a19f60b0097e3f0c";
  if (listing.title && /vintage leather jacket/i.test(listing.title)) src = "https://cdn.builder.io/api/v1/image/assets%2Fc89b2bcccff34daeac7e499342800fef%2Fa3ddf156b7ad4a70a7a21ea47e1ceec0";

  const [adding, setAdding] = useState(false);

  // Allow overriding displayed price labels for specific listings (e.g., show INR values)
  const priceLabelOverrides: Record<string, string> = {
    "Coral Tee - Limited Edition": "₹250.00",
    "Kitchen Mixer": "₹3000.00",
    "Used Acoustic Guitar": "₹4500.00",
    "Vintage Leather Jacket": "₹750.00",
    "Vintage Book Collection": "₹150.00",
  };

  const displayPrice = priceLabelOverrides[listing.title] ?? formatPrice(listing.price);

  async function add() {
    setAdding(true);
    try { await api.addToCart(listing.id); }
    catch(e){}
    finally{ setAdding(false); }
  }

  return (
    <div className="group rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-shadow relative">
      <Link to={`/listing/${listing.id}`}>
        <div className="aspect-square w-full bg-muted/30 overflow-hidden">
          <img src={src} alt={listing.title} className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform" />
        </div>
      </Link>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium line-clamp-2">{listing.title}</h3>
          <div className="shrink-0 font-semibold text-primary">{displayPrice}</div>
        </div>
        <div className="mt-1 text-xs text-muted-foreground flex items-center justify-between">
          <div>{listing.category}</div>
          <div className="text-yellow-500 text-sm">★★★★★</div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button onClick={add} disabled={adding} className="px-3 py-2 rounded-md bg-accent text-accent-foreground text-sm shadow-sm hover:shadow-md">
            {adding ? "Adding..." : "Add to cart"}
          </button>
          <Link to={`/listing/${listing.id}`} className="text-sm text-primary underline">View</Link>
        </div>
      </div>
    </div>
  );
}
