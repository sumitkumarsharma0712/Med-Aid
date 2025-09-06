export default function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="container mx-auto py-10 grid gap-6 md:grid-cols-3">
        <div>
          <div className="text-2xl font-extrabold text-primary">EcoFinds</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Buy and sell pre-owned items to give them a second life.
          </p>
        </div>
        <div className="text-sm">
          <div className="font-semibold mb-2">Company</div>
          <ul className="space-y-1 text-muted-foreground">
            <li>About</li>
            <li>Contact</li>
            <li>Privacy</li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="font-semibold mb-2">Get the latest</div>
          <p className="text-muted-foreground">Sustainable deals and tips in your inbox.</p>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} EcoFinds. All rights reserved.
      </div>
    </footer>
  );
}
