import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export default function FloatingCTA() {
  return (
    <Link to="/sell" aria-label="Sell an item" className="cta-floating">
      <div className="flex items-center gap-2 px-4 py-3 rounded-full text-accent-foreground bg-accent shadow-2xl">
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Sell</span>
      </div>
    </Link>
  );
}
