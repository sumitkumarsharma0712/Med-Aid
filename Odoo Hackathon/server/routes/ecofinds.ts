import { Request, Response, NextFunction, Router } from "express";
import { z } from "zod";
import crypto from "crypto";
import {
  AuthLoginRequest,
  AuthRegisterRequest,
  AuthResponse,
  Category,
  CreateListingRequest,
  Listing,
  PurchaseItem,
  UpdateListingRequest,
  User,
} from "@shared/api";

// In-memory stores (prototype only)
const users: (User & { passwordHash: string })[] = [];
const sessions = new Map<string, string>(); // token -> userId
const listings: Listing[] = [];
const carts = new Map<string, { items: { listingId: string; addedAt: number }[] }>();
const purchases = new Map<string, PurchaseItem[]>();

const categories: Category[] = [
  "Electronics",
  "Fashion",
  "Home",
  "Books",
  "Toys",
  "Sports",
  "Pottery & Clay",
  "Other",
];

const router = Router();

// Helpers
function newId() {
  return crypto.randomUUID();
}

function hash(pw: string) {
  return crypto.createHash("sha256").update(pw).digest("hex");
}

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token || !sessions.has(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  // @ts-ignore augment
  req.userId = sessions.get(token)!;
  next();
}

// Seed sample data (run once on module load)
(function seed() {
  if (users.length > 0 || listings.length > 0) return;

  const adminId = newId();
  users.push({ id: adminId, name: "Admin", email: "admin@ecofinds.test", passwordHash: hash("password") });

  const aliceId = newId();
  users.push({ id: aliceId, name: "Alice", email: "alice@example.com", passwordHash: hash("password") });

  const bobId = newId();
  users.push({ id: bobId, name: "Bob", email: "bob@example.com", passwordHash: hash("password") });

  const now = Date.now();
  listings.push(
    // New book listing
    {
      id: newId(),
      sellerId: bobId,
      title: "Vintage Book Collection",
      description: "A curated stack of classic and contemporary reads in good condition.",
      category: "Books",
      price: 1500,
      imageUrl: "https://cdn.builder.io/api/v1/image/assets%2Fc89b2bcccff34daeac7e499342800fef%2F9caeed9df61a464ab8112238e4e68124?format=webp&width=800",
      createdAt: now - 1000 * 60 * 60 * 6,
    },
    // Promo listing (searchable and addable)
    {
      id: "promo-coral-tee",
      sellerId: aliceId,
      title: "Coral Tee - Limited Edition",
      description: "Soft cotton tee in coral color. Limited edition.",
      category: "Fashion",
      price: 2500,
      imageUrl: "https://cdn.builder.io/api/v1/image/assets%2Fc89b2bcccff34daeac7e499342800fef%2Ffb963d13e69f4fc58b163ced04727850?format=webp&width=800",
      createdAt: now - 1000 * 60 * 60 * 12,
    },
    {
      id: newId(),
      sellerId: aliceId,
      title: "Vintage Leather Jacket",
      description: "Well-maintained leather jacket, size M. Classic style.",
      category: "Fashion",
      price: 7500,
      imageUrl: "https://cdn.builder.io/api/v1/image/assets%2Fc89b2bcccff34daeac7e499342800fef%2F543fe1447be84a2db3fae427d049d413?format=webp&width=800",
      createdAt: now - 1000 * 60 * 60 * 24 * 3,
    },
    {
      id: newId(),
      sellerId: bobId,
      title: "Used Acoustic Guitar",
      description: "6-string acoustic guitar with a warm tone. Minor scratches.",
      category: "Music" as Category,
      price: 4500,
      imageUrl: "https://cdn.builder.io/api/v1/image/assets%2Fc89b2bcccff34daeac7e499342800fef%2F993a33601a114e11bd7fdcab66445fad?format=webp&width=800",
      createdAt: now - 1000 * 60 * 60 * 24 * 2,
    } as unknown as Listing,
    {
      id: newId(),
      sellerId: aliceId,
      title: "Kitchen Mixer",
      description: "Lightly used mixer in great condition.",
      category: "Electronics",
      price: 3000,
      imageUrl: "/placeholder.svg",
      createdAt: now - 1000 * 60 * 60 * 24,
    },
    // Pottery listing added for Pottery & Clay category
    {
      id: newId(),
      sellerId: bobId,
      title: "Handmade Pottery Set",
      description: "Assorted handmade pottery pieces — bowls and mugs.",
      category: "Pottery & Clay" as Category,
      price: 4000,
      imageUrl: "https://cdn.builder.io/api/v1/image/assets%2Fc89b2bcccff34daeac7e499342800fef%2Fb80b349cae0942978fa1132e34291900?format=webp&width=800",
      createdAt: now - 1000 * 60 * 60 * 24 * 2,
    },
  );

  // initial purchase for demo
  purchases.set(aliceId, [
    {
      id: newId(),
      listing: listings[1],
      purchasedAt: now - 1000 * 60 * 60,
    },
  ]);
})();

// Schemas
const registerSchema = z.object<z.ZodTypeDef, any, AuthRegisterRequest>({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
} as any);

const loginSchema = z.object<z.ZodTypeDef, any, AuthLoginRequest>({
  email: z.string().email(),
  password: z.string().min(6),
} as any);

const createListingSchema = z.object<z.ZodTypeDef, any, CreateListingRequest>({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(categories as [Category, ...Category[]]),
  price: z.number().min(0),
  imageUrl: z.string().url().or(z.literal("")).default(""),
} as any);

const updateListingSchema = z.object<z.ZodTypeDef, any, UpdateListingRequest>({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  category: z.enum(categories as [Category, ...Category[]]).optional(),
  price: z.number().min(0).optional(),
  imageUrl: z.string().url().or(z.literal("")),
} as any);

// Auth
router.post("/auth/register", (req, res) => {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: "Invalid payload" });
  const { name, email, password } = parse.data;
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: "Email already registered" });
  }
  const user: User & { passwordHash: string } = {
    id: newId(),
    name,
    email,
    passwordHash: hash(password),
  };
  users.push(user);
  const token = newId();
  sessions.set(token, user.id);
  const resp: AuthResponse = { token, user: { id: user.id, name, email } };
  res.json(resp);
});

router.post("/auth/login", (req, res) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: "Invalid payload" });
  const { email, password } = parse.data;
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.passwordHash !== hash(password))
    return res.status(401).json({ error: "Invalid credentials" });
  const token = newId();
  sessions.set(token, user.id);
  const resp: AuthResponse = {
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
  res.json(resp);
});

router.get("/auth/me", authMiddleware, (req, res) => {
  const uid = (req as any).userId as string;
  const user = users.find((u) => u.id === uid)!;
  res.json({ id: user.id, name: user.name, email: user.email } satisfies User);
});

router.put("/users/me", authMiddleware, (req, res) => {
  const uid = (req as any).userId as string;
  const u = users.find((x) => x.id === uid)!;
  const name = typeof req.body.name === "string" && req.body.name.trim() ? req.body.name.trim() : u.name;
  const email = typeof req.body.email === "string" && req.body.email.includes("@") ? req.body.email : u.email;
  u.name = name;
  u.email = email;
  res.json({ id: u.id, name: u.name, email: u.email } satisfies User);
});

// Listings
router.get("/listings", (req, res) => {
  const search = String(req.query.search || "").toLowerCase();
  const category = String(req.query.category || "");
  let data = listings.slice().sort((a, b) => b.createdAt - a.createdAt);
  if (search) data = data.filter((l) => l.title.toLowerCase().includes(search));
  if (category) data = data.filter((l) => l.category === category);
  res.json({ listings: data, categories });
});

router.get("/listings/:id", (req, res) => {
  const l = listings.find((x) => x.id === req.params.id);
  if (!l) return res.status(404).json({ error: "Not found" });
  res.json(l);
});

router.get("/me/listings", authMiddleware, (req, res) => {
  const uid = (req as any).userId as string;
  res.json(listings.filter((l) => l.sellerId === uid));
});

router.post("/listings", authMiddleware, (req, res) => {
  const parse = createListingSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: "Invalid payload" });
  const uid = (req as any).userId as string;
  const payload = parse.data;
  const listing: Listing = {
    id: newId(),
    sellerId: uid,
    title: payload.title,
    description: payload.description,
    category: payload.category,
    price: payload.price,
    imageUrl: payload.imageUrl || "",
    createdAt: Date.now(),
  };
  listings.push(listing);
  res.json(listing);
});

router.put("/listings/:id", authMiddleware, (req, res) => {
  const parse = updateListingSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: "Invalid payload" });
  const uid = (req as any).userId as string;
  const l = listings.find((x) => x.id === req.params.id);
  if (!l) return res.status(404).json({ error: "Not found" });
  if (l.sellerId !== uid) return res.status(403).json({ error: "Forbidden" });
  Object.assign(l, parse.data);
  res.json(l);
});

router.delete("/listings/:id", authMiddleware, (req, res) => {
  const uid = (req as any).userId as string;
  const idx = listings.findIndex((x) => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  if (listings[idx].sellerId !== uid && users.find((u) => u.id === uid)?.email !== "admin@ecofinds.test") return res.status(403).json({ error: "Forbidden" });
  const [removed] = listings.splice(idx, 1);
  res.json(removed);
});

// Cart and purchases
router.get("/cart", authMiddleware, (req, res) => {
  const uid = (req as any).userId as string;
  const cart = carts.get(uid) || { items: [] };
  carts.set(uid, cart);
  res.json(cart);
});

router.post("/cart/add", authMiddleware, (req, res) => {
  const uid = (req as any).userId as string;
  const listingId = String(req.body.listingId || "");
  const l = listings.find((x) => x.id === listingId);
  if (!l) return res.status(404).json({ error: "Listing not found" });
  const cart = carts.get(uid) || { items: [] };
  if (!cart.items.some((i) => i.listingId === listingId)) {
    cart.items.push({ listingId, addedAt: Date.now() });
  }
  carts.set(uid, cart);
  res.json(cart);
});

router.post("/cart/remove", authMiddleware, (req, res) => {
  const uid = (req as any).userId as string;
  const listingId = String(req.body.listingId || "");
  const cart = carts.get(uid) || { items: [] };
  cart.items = cart.items.filter((i) => i.listingId !== listingId);
  carts.set(uid, cart);
  res.json(cart);
});

router.post("/checkout", authMiddleware, (req, res) => {
  const uid = (req as any).userId as string;
  const cart = carts.get(uid) || { items: [] };
  const items: PurchaseItem[] = cart.items
    .map((i) => {
      const l = listings.find((x) => x.id === i.listingId);
      return l
        ? {
            id: newId(),
            listing: l,
            purchasedAt: Date.now(),
          }
        : null;
    })
    .filter(Boolean) as PurchaseItem[];
  const prev = purchases.get(uid) || [];
  purchases.set(uid, prev.concat(items));
  carts.set(uid, { items: [] });
  res.json({ purchases: items });
});

router.get("/purchases", authMiddleware, (req, res) => {
  const uid = (req as any).userId as string;
  res.json(purchases.get(uid) || []);
});

// Admin data (requires admin user)
router.get("/admin/data", authMiddleware, (req, res) => {
  const uid = (req as any).userId as string;
  const user = users.find((u) => u.id === uid)!;
  if (user.email !== "admin@ecofinds.test") return res.status(403).json({ error: "Forbidden" });
  const safeUsers = users.map((u) => ({ id: u.id, name: u.name, email: u.email }));
  const allPurchases: Record<string, PurchaseItem[]> = {};
  for (const [k, v] of purchases.entries()) allPurchases[k] = v;
  res.json({ users: safeUsers, listings, purchases: allPurchases, categories });
});

export function ecofindsRouter() {
  return router;
}
