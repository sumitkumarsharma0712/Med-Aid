import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { Link as RouterLink, NavLink, useNavigate } from "react-router-dom";

import { useTheme } from "../../hooks/use-theme";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    navigate(`/market?search=${encodeURIComponent(q)}`);
  }

  const { theme, toggleTheme } = useTheme();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${isActive ? "bg-accent text-accent-foreground" : "text-foreground/80 hover:text-foreground hover:bg-secondary"}`;

  function ThemeToggle({ compact }: { compact?: boolean } = {}) {
    return (
      <button
        onClick={toggleTheme}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        className={
          compact
            ? "px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-sm"
            : "px-3 py-2 rounded-md border bg-background text-foreground text-sm"
        }
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex items-center gap-4 py-3">
        <div className="flex items-center gap-4">
          <RouterLink to="/" className="font-extrabold tracking-tight text-2xl text-primary">
            EcoFinds
          </RouterLink>
          <div className="hidden lg:flex items-center bg-primary/5 rounded-md px-3 py-1 text-sm text-muted-foreground">Departments</div>
        </div>

        <form onSubmit={submit} className="flex-1">
          <div className="flex items-center gap-2">
            <select aria-label="category" className="hidden sm:inline rounded-l-md border-r px-3 py-2 bg-background text-sm text-muted-foreground">
              <option value="">All</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Home</option>
              <option>Books</option>
            </select>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for products, brands and more"
              className="w-full rounded-md border px-4 py-2 text-sm"
            />
            <button type="submit" className="ml-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm">Search</button>
          </div>
        </form>

        <div className="hidden md:flex items-center gap-4">
          {/* Theme toggle */}
          <ThemeToggle />

          <NavLink to="/login" className={navLinkClass}>
            Hello, {user ? user.name.split(" ")[0] : "Sign in"}
          </NavLink>
          <NavLink to="/purchases" className={navLinkClass}>
            Orders
          </NavLink>
          <NavLink to="/cart" className={navLinkClass}>
            Cart
          </NavLink>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button onClick={() => navigate('/cart')} className="px-3 py-2 rounded-md bg-secondary text-secondary-foreground">Cart</button>
          <ThemeToggle compact />
        </div>
      </div>

      <nav className="hidden md:block border-t">
        <div className="container mx-auto py-2 flex gap-4 text-sm text-muted-foreground overflow-x-auto">
          <NavLink to="/market" className={navLinkClass}>All</NavLink>
          <NavLink to="/market?category=Electronics" className={navLinkClass}>Electronics</NavLink>
          <NavLink to="/market?category=Fashion" className={navLinkClass}>Fashion</NavLink>
          <NavLink to="/market?category=Books" className={navLinkClass}>Books</NavLink>
          <NavLink to="/market?category=Sports" className={navLinkClass}>Sports</NavLink>
          <NavLink to="/market?category=Pottery%20%26%20Clay" className={navLinkClass}>Pottery & Clay</NavLink>
        </div>
      </nav>
    </header>
  );
}
