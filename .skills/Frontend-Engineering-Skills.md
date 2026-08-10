---
name: Frontend Engineering Skill
description: >
  Frontend engineering skill for production-grade applications. Use this skill
  for EVERY frontend application, component, page, dashboard, or UI task. Triggers on any request
  to build, create, scaffold, or improve a Next.js app, React component, UI screen, or web interface.
  Enforces production-grade standards: Next.js 15 + React 18 (or Next.js 16 + React 19), Tailwind,
  TypeScript, shadcn/ui, Framer Motion, TanStack Query, Zustand, Next Auth, Axios, PWA, SSR/SSG,
  accessibility, and pixel-perfect responsive design. NEVER skip this skill for any frontend task.
author: Rakib Khan — Software Engineer @ ACI PLC
version: 2.0.0
---

# Frontend / UI-UX Engineering Skill

> **Stop token waste:** Read section headers, jump to what's needed. Every rule here is active on every build.

---

## 0 · PRE-BUILD WORKFLOW (MANDATORY — DO THIS FIRST, ALWAYS)

Before writing a single line of code, execute this exact sequence:

### Step 1 — Requirements Analysis
Parse the user's request and extract:
- **App type**: dashboard / landing page / e-commerce / SaaS / mobile-first / etc.
- **Target users**: role (admin, customer, field officer), device preference, locale
- **Key functionality**: list every distinct feature mentioned or implied
- **Data flows**: what APIs/entities will be needed
- **Constraints**: auth, i18n, Bangladesh-specific (BDT, Bangla), third-party integrations

Output a short bullet list: **"I understand you need: …"** — confirm with user before proceeding.

### Step 2 — Frontend Architecture Design
Design the system before building:
```
Architecture snapshot:
- Rendering strategy: SSR / SSG / CSR / Hybrid (per-route)
- State layers: Server state (TanStack Query) | Global UI (Zustand) | Local (useState)
- Auth model: Next Auth v4/v5 + role-based middleware
- API layer: Axios instance + typed service functions
- i18n: needed? (English + Bangla?) → custom i18n hook or next-intl
- Theme: dark mode required? light-only?
```

### Step 3 — Module & Feature List
Enumerate every module as a numbered checklist:
```
Modules:
1. Auth — login, register, forgot password, token refresh
2. Dashboard — KPI cards, charts, recent activity feed
3. Users — list, create, edit, delete, role assignment
4. Settings — profile, notifications, appearance
... (add all modules specific to the app)
```

### Step 4 — Route Plan
Map every URL to its page file:
```
Route Plan:
/ → app/(public)/page.tsx (landing)
/login → app/(auth)/login/page.tsx
/dashboard → app/(dashboard)/page.tsx [protected]
/dashboard/users → app/(dashboard)/users/page.tsx [admin]
/dashboard/users/[id] → app/(dashboard)/users/[id]/page.tsx
/dashboard/settings → app/(dashboard)/settings/page.tsx
/api/auth/[...nextauth] → app/api/auth/[...nextauth]/route.ts
```

### Step 5 — Project Structure with Exact Filenames
Output the FULL directory tree with real filenames — no placeholders:
```
src/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── users/
│   │       ├── page.tsx
│   │       └── [id]/page.tsx
│   └── api/auth/[...nextauth]/route.ts
├── components/
│   ├── ui/               ← shadcn + custom primitives
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── shared/
│   │   ├── PageWrapper.tsx
│   │   ├── DataTable.tsx
│   │   └── EmptyState.tsx
│   └── features/
│       ├── auth/
│       │   └── LoginForm.tsx
│       └── users/
│           ├── UserTable.tsx
│           ├── UserCard.tsx
│           └── UserTableSkeleton.tsx
├── hooks/
│   ├── useUsers.ts
│   └── useTableControls.ts
├── lib/
│   ├── axios.ts
│   ├── auth.ts
│   ├── query-client.ts
│   └── utils.ts
├── store/
│   └── useUIStore.ts
├── types/
│   └── index.ts
└── middleware.ts
```

### Step 6 — Build Order
Always build in this order:
1. `globals.css` + `tailwind.config.ts` (tokens first)
2. `lib/` files (axios, auth, query-client, utils)
3. `middleware.ts`
4. Root `layout.tsx` + providers
5. Auth pages
6. Layout shell (Sidebar, Header)
7. Feature pages — top-down by module list

---

## 1 · VERSION MATRIX (pick one, never mix)

| Signal | Next.js | React | Tailwind | Next Auth | Notes |
|---|---|---|---|---|---|
| Default / "Next 15" | **15.x** | **18.x** | **v3** | **v4** | App Router, `src/` |
| "Next 16" explicit | **16.x** | **19.x** | **v4** | **v5** | App Router, `src/` |

Detect version from existing `package.json` if present; otherwise default to Next 15 matrix.

---

## 2 · PROJECT STRUCTURE (`src/` only)

```
src/
├── app/                        # App Router root
│   ├── layout.tsx              # Root layout + ThemeProvider + QueryProvider + AuthProvider
│   ├── globals.css             # All CSS variables, dark mode tokens, Tailwind base
│   ├── (auth)/                 # Group route — login, register, forgot-password
│   │   └── login/page.tsx
│   ├── (dashboard)/            # Group route — protected pages
│   │   ├── layout.tsx          # Dashboard shell (sidebar, header)
│   │   └── [slug]/page.tsx     # Dynamic route example
│   └── api/
│       └── auth/[...nextauth]/ # Next Auth handler
├── components/
│   ├── ui/                     # shadcn generated + custom primitives
│   ├── layout/                 # Header, Sidebar, Footer, Shell
│   ├── shared/                 # Reusable cross-feature components
│   └── features/               # Feature-specific components (co-located)
├── hooks/                      # Custom React hooks (use*.ts)
├── lib/
│   ├── axios.ts                # Axios instance + interceptors
│   ├── auth.ts                 # Next Auth config
│   ├── query-client.ts         # TanStack Query client
│   └── utils.ts                # cn(), formatters, helpers
├── store/                      # Zustand stores
├── types/                      # Global TypeScript types / interfaces
├── middleware.ts               # Next.js middleware (auth guards, redirects)
└── styles/                     # Any extra CSS modules if needed
```

**Rules:**
- Never use `pages/` directory; always App Router.
- Group routes with `(folderName)` for logical separation without URL segments.
- Dynamic routes: `[param]` single, `[...param]` catch-all, `[[...param]]` optional catch-all.
- Co-locate feature hooks/types inside `components/features/<feature>/` when feature-specific.

---

## 3 · GLOBALS.CSS — DESIGN TOKENS

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Brand */
    --brand-50: 239 246 255;
    --brand-500: 59 130 246;
    --brand-600: 37 99 235;
    --brand-900: 30 58 138;

    /* Semantic */
    --background: 255 255 255;
    --foreground: 15 23 42;
    --card: 248 250 252;
    --card-foreground: 15 23 42;
    --popover: 255 255 255;
    --popover-foreground: 15 23 42;
    --primary: 59 130 246;
    --primary-foreground: 255 255 255;
    --secondary: 241 245 249;
    --secondary-foreground: 51 65 85;
    --muted: 241 245 249;
    --muted-foreground: 100 116 139;
    --accent: 241 245 249;
    --accent-foreground: 15 23 42;
    --destructive: 239 68 68;
    --destructive-foreground: 255 255 255;
    --border: 226 232 240;
    --input: 226 232 240;
    --ring: 59 130 246;
    --radius: 0.5rem;

    /* Sidebar */
    --sidebar-bg: 15 23 42;
    --sidebar-fg: 226 232 240;
    --sidebar-accent: 59 130 246;

    /* Shadow scale */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

    /* Typography scale tokens */
    --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
    --font-display: "Cal Sans", "Inter", ui-sans-serif;
    --font-mono: "JetBrains Mono", ui-monospace, monospace;
    --leading-tight: 1.2;
    --leading-snug: 1.375;
    --leading-normal: 1.5;
    --leading-relaxed: 1.625;
    --tracking-tight: -0.025em;
    --tracking-normal: 0em;
    --tracking-wide: 0.025em;
  }

  .dark {
    --background: 9 9 11;
    --foreground: 250 250 250;
    --card: 20 20 23;
    --card-foreground: 250 250 250;
    --popover: 20 20 23;
    --popover-foreground: 250 250 250;
    --primary: 96 165 250;
    --primary-foreground: 9 9 11;
    --secondary: 39 39 42;
    --secondary-foreground: 250 250 250;
    --muted: 39 39 42;
    --muted-foreground: 161 161 170;
    --accent: 39 39 42;
    --accent-foreground: 250 250 250;
    --destructive: 239 68 68;
    --destructive-foreground: 250 250 250;
    --border: 39 39 42;
    --input: 39 39 42;
    --ring: 96 165 250;
    --sidebar-bg: 9 9 11;
    --sidebar-fg: 228 228 231;
  }

  * { @apply border-border; }
  body { @apply bg-background text-foreground antialiased; font-family: var(--font-sans); }
  html { scroll-behavior: smooth; }
}
```

**tailwind.config.ts snippet:**
```ts
import type { Config } from "tailwindcss";
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        // ... mirror all tokens
        border: "rgb(var(--border) / <alpha-value>)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
```

---

## 4 · AXIOS SETUP

```ts
// src/lib/axios.ts
import axios from "axios";
import { getSession } from "next-auth/react";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: unknown) => void; reject: (e: unknown) => void }> = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }
      original._retry = true;
      isRefreshing = true;
      try {
        const session = await getSession();
        const newToken = session?.accessToken;
        failedQueue.forEach((p) => p.resolve(newToken));
        failedQueue = [];
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (e) {
        failedQueue.forEach((p) => p.reject(e));
        failedQueue = [];
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 5 · NEXT AUTH v4 CONFIG (Next 15 matrix)

```ts
// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import api from "./axios";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        const { data } = await api.post("/auth/login", credentials);
        if (data?.user) return { ...data.user, accessToken: data.accessToken, refreshToken: data.refreshToken };
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) return { ...token, ...user };
      if (Date.now() < (token.accessTokenExpiry as number)) return token;
      // Refresh token
      try {
        const { data } = await api.post("/auth/refresh", { refreshToken: token.refreshToken });
        return { ...token, accessToken: data.accessToken, accessTokenExpiry: data.expiresAt };
      } catch {
        return { ...token, error: "RefreshAccessTokenError" };
      }
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.error = token.error as string | undefined;
      return session;
    },
  },
  pages: { signIn: "/login", error: "/login" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
```

```ts
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

---

## 6 · TANSTACK QUERY SETUP

```ts
// src/lib/query-client.ts
import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
  },
});
```

```tsx
// src/components/providers/QueryProvider.tsx
"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { QueryClient } from "@tanstack/react-query";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
  }));
  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Query Hook Pattern
```ts
// src/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { User, PaginatedResponse } from "@/types";

// Paginated list
export function useUsers(page: number, search: string) {
  return useQuery<PaginatedResponse<User>>({
    queryKey: ["users", page, search],
    queryFn: () => api.get("/users", { params: { page, search, limit: 20 } }).then(r => r.data),
    placeholderData: (prev) => prev, // keeps old data while fetching
  });
}

// Infinite scroll
export function useUsersInfinite(search: string) {
  return useInfiniteQuery({
    queryKey: ["users-infinite", search],
    queryFn: ({ pageParam = 1 }) =>
      api.get("/users", { params: { page: pageParam, search, limit: 20 } }).then(r => r.data),
    getNextPageParam: (last) => last.meta.hasNextPage ? last.meta.page + 1 : undefined,
    initialPageParam: 1,
  });
}

// Mutation
export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<User>) => api.post("/users", body).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}
```

---

## 7 · ZUSTAND STORE PATTERN

```ts
// src/store/useUIStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: true,
        toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
      }),
      { name: "ui-store" }
    )
  )
);
```

**Use Zustand for:** global UI state (sidebar, modals, toasts), user preferences, multi-step form state.  
**Do NOT use Zustand for:** server data (use TanStack Query), per-component state (use useState).

---

## 8 · MIDDLEWARE

```ts
// src/middleware.ts  (Next 15 — next-auth v4)
export { default } from "next-auth/middleware";
export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/admin/:path*"],
};
```

```ts
// Extended middleware with role-based redirect
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const isAdmin = req.nextUrl.pathname.startsWith("/admin");
    if (isAdmin && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  { callbacks: { authorized: ({ token }) => !!token } }
);

export const config = { matcher: ["/dashboard/:path*", "/admin/:path*"] };
```

---

## 9 · ROOT LAYOUT

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { template: "%s | AppName", default: "AppName" },
  description: "...",
  manifest: "/manifest.json",
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#fff" }, { media: "(prefers-color-scheme: dark)", color: "#09090b" }],
  appleWebApp: { capable: true, statusBarStyle: "default", title: "AppName" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SessionProvider>
            <QueryProvider>
              {children}
              <Toaster richColors position="top-right" />
            </QueryProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## 10 · DARK MODE

- Always use `next-themes` with `attribute="class"`.
- Use Tailwind `dark:` variants everywhere. Never use inline style for theme.
- Toggle component:

```tsx
"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

---

## 11 · SSR / SSG / DATA FETCHING RULES

| Need | Pattern |
|---|---|
| Public, SEO page | `generateStaticParams` + `fetch` with `{ cache: "force-cache" }` |
| Authenticated data | `async` Server Component + `getServerSession` |
| Real-time / user-specific | Client Component + TanStack Query |
| Large list with filters | Server Component shell + Client Component for filters/pagination |
| Search params on server | `searchParams` prop (Server Component) |
| Search params + client state | `useSearchParams()` + `useRouter()` in Client Component |

```tsx
// Server Component with auth + SSR data
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const data = await fetch(`${process.env.API_URL}/dashboard`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
    next: { revalidate: 60 },
  }).then(r => r.json());
  return <DashboardClient initialData={data} />;
}
```

---

## 12 · PAGINATION, SEARCH, FILTERS, INFINITE SCROLL

### URL-driven pagination + search
```tsx
"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

export function useTableControls() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const push = useCallback((params: Record<string, string | number>) => {
    const p = new URLSearchParams(sp.toString());
    Object.entries(params).forEach(([k, v]) => p.set(k, String(v)));
    router.push(`${pathname}?${p.toString()}`);
  }, [router, pathname, sp]);

  const search = useDebouncedCallback((q: string) => push({ search: q, page: 1 }), 400);
  const setPage = (page: number) => push({ page });
  const setFilter = (key: string, val: string) => push({ [key]: val, page: 1 });

  return {
    page: Number(sp.get("page") ?? 1),
    search: sp.get("search") ?? "",
    onSearch: search,
    onPageChange: setPage,
    onFilterChange: setFilter,
  };
}
```

### Infinite scroll
```tsx
"use client";
import { useIntersection } from "@/hooks/useIntersection";
import { useEffect, useRef } from "react";
import { useUsersInfinite } from "@/hooks/useUsers";

export function InfiniteList({ search }: { search: string }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useUsersInfinite(search);
  const loaderRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersection(loaderRef);

  useEffect(() => {
    if (isVisible && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [isVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const items = data?.pages.flatMap(p => p.data) ?? [];

  return (
    <div className="space-y-2">
      {items.map(item => <ItemCard key={item.id} item={item} />)}
      <div ref={loaderRef} className="h-8">
        {isFetchingNextPage && <Spinner />}
      </div>
    </div>
  );
}
```

---

## 13 · PERFORMANCE — MEMOIZATION & DEBOUNCE

```tsx
// useMemo — expensive derivation
const sorted = useMemo(() => [...items].sort((a, b) => a.name.localeCompare(b.name)), [items]);

// useCallback — stable reference for child props
const handleDelete = useCallback((id: string) => {
  deleteMutation.mutate(id);
}, [deleteMutation]);

// React.memo — prevent re-render of pure child
export const ItemCard = React.memo(function ItemCard({ item }: { item: Item }) { ... });

// Debounce — search input
import { useDebouncedCallback } from "use-debounce";
const handleSearch = useDebouncedCallback((val: string) => setSearch(val), 400);
```

**Rules:**
- Memoize only when the computation is measurably expensive or causes re-render cascades.
- Always `useCallback` for functions passed as props to `React.memo` children.
- Debounce: search/filter inputs ≥ 300ms; API-triggered inputs ≥ 500ms.

---

## 14 · NEXT DYNAMIC IMPORT

```tsx
// Heavy chart — no SSR
const RevenueChart = dynamic(() => import("@/components/features/dashboard/RevenueChart"), {
  ssr: false,
  loading: () => <Skeleton className="h-64 w-full rounded-xl" />,
});

// Modal — load on demand
const CreateUserModal = dynamic(() => import("@/components/features/users/CreateUserModal"), {
  loading: () => null,
});
```

Use `dynamic()` for: chart libraries, rich text editors, map components, large modals, anything > 50 KB that is not above-the-fold.

---

## 15 · SUSPENSE & SKELETON

```tsx
// app/(dashboard)/users/page.tsx
import { Suspense } from "react";
import { UserTableSkeleton } from "@/components/features/users/UserTableSkeleton";

export default function UsersPage() {
  return (
    <Suspense fallback={<UserTableSkeleton />}>
      <UserTable />
    </Suspense>
  );
}
```

```tsx
// UserTableSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
export function UserTableSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full rounded-lg" />
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-lg" />
      ))}
    </div>
  );
}
```

**When to use Suspense:**
- Any async Server Component
- Pages that use `searchParams` (wrap inner component)
- Dynamic imports with `loading` fallback

---

## 16 · IMAGE — ALWAYS NEXT/IMAGE

```tsx
import Image from "next/image";

// Known dimensions
<Image src="/hero.png" alt="Hero" width={1200} height={600} priority className="rounded-xl object-cover" />

// Fill container
<div className="relative h-48 w-full">
  <Image src={user.avatar} alt={user.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover rounded-full" />
</div>
```

**Never use `<img>` tag. Always set `sizes` for responsive fill images.**

---

## 17 · SHADCN/UI — GENERATION RULES

Before building any app, list all required shadcn components and install them:

```bash
npx shadcn@latest add button input label card dialog sheet table
npx shadcn@latest add select dropdown-menu popover calendar date-picker
npx shadcn@latest add form toast sonner skeleton badge avatar
npx shadcn@latest add navigation-menu tabs breadcrumb separator
npx shadcn@latest add alert alert-dialog progress command
```

Always use `cn()` from `@/lib/utils` for conditional classes:
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
```

---

## 18 · CUSTOM COMPONENTS (Code Templates)

### Custom Button
```tsx
// src/components/ui/CustomButton.tsx
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
}

const variants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
};
const sizes = {
  sm: "h-8 px-3 text-xs rounded-md",
  md: "h-10 px-4 text-sm rounded-lg",
  lg: "h-12 px-6 text-base rounded-xl",
  icon: "h-10 w-10 rounded-lg",
};

export const CustomButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        variants[variant], sizes[size], className
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
);
CustomButton.displayName = "CustomButton";
```

### Custom Dropdown
```tsx
// src/components/ui/CustomDropdown.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option { label: string; value: string; icon?: React.ReactNode }
interface DropdownProps {
  options: Option[];
  value?: string;
  placeholder?: string;
  onChange: (val: string) => void;
  className?: string;
}

export function CustomDropdown({ options, value, placeholder = "Select...", onChange, className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={cn("relative w-full", className)}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className={cn(!selected && "text-muted-foreground")}>
          {selected ? <span className="flex items-center gap-2">{selected.icon}{selected.label}</span> : placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95">
          <ul className="max-h-60 overflow-auto p-1">
            {options.map(opt => (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                    opt.value === value && "bg-primary/10 text-primary font-medium"
                  )}
                >
                  {opt.icon}
                  {opt.label}
                  {opt.value === value && <Check className="ml-auto h-4 w-4" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### Custom Calendar
```tsx
// src/components/ui/CustomCalendar.tsx
"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  disabledBefore?: Date;
  disabledAfter?: Date;
  className?: string;
}

export function CustomCalendar({ selected, onSelect, disabledBefore, disabledAfter, className }: CalendarProps) {
  const today = new Date();
  const [month, setMonth] = useState(selected ?? today);

  const year = month.getFullYear();
  const mon = month.getMonth();
  const firstDay = new Date(year, mon, 1).getDay();
  const daysInMonth = new Date(year, mon + 1, 0).getDate();
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : new Date(year, mon, i - firstDay + 1)
  );

  const isDisabled = (d: Date) =>
    (disabledBefore && d < disabledBefore) || (disabledAfter && d > disabledAfter);

  return (
    <div className={cn("w-72 rounded-xl border border-border bg-card p-4 shadow-md", className)}>
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => setMonth(new Date(year, mon - 1))} className="rounded-lg p-1 hover:bg-accent transition-colors">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold">
          {month.toLocaleString("default", { month: "long", year: "numeric" })}
        </span>
        <button onClick={() => setMonth(new Date(year, mon + 1))} className="rounded-lg p-1 hover:bg-accent transition-colors">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <span key={d}>{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => (
          <button
            key={i}
            disabled={!d || !!isDisabled(d!)}
            onClick={() => d && onSelect?.(d)}
            className={cn(
              "h-8 w-8 rounded-lg text-xs transition-colors",
              !d && "invisible",
              d && !isDisabled(d) && "hover:bg-accent cursor-pointer",
              d && isDisabled(d) && "text-muted-foreground opacity-40 cursor-not-allowed",
              d && selected && d.toDateString() === selected.toDateString() && "bg-primary text-primary-foreground hover:bg-primary/90",
              d && d.toDateString() === today.toDateString() && selected?.toDateString() !== today.toDateString() && "font-bold text-primary"
            )}
          >
            {d?.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## 19 · FRAMER MOTION PATTERNS

```tsx
// Fade-in page wrapper
import { motion } from "framer-motion";
export const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
    {children}
  </motion.div>
);

// Staggered list
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map(i => <motion.li key={i.id} variants={item}>{...}</motion.li>)}
</motion.ul>
```

---

## 20 · PWA SETUP (Next.js 15)

**Install:** `npm i next-pwa`

```js
// next.config.js
const withPWA = require("next-pwa")({ dest: "public", disable: process.env.NODE_ENV === "development" });
module.exports = withPWA({ reactStrictMode: true });
```

**`public/manifest.json`:**
```json
{
  "name": "AppName",
  "short_name": "App",
  "description": "...",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ],
  "screenshots": [],
  "categories": ["productivity"]
}
```

**Install Prompt Button:**
```tsx
"use client";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PWAInstallButton() {
  const [prompt, setPrompt] = useState<Event & { prompt?: () => void } | null>(null);
  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setPrompt(e as any); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);
  if (!prompt) return null;
  return (
    <Button variant="outline" size="sm" onClick={() => (prompt as any).prompt()} className="gap-2">
      <Download className="h-4 w-4" /> Install App
    </Button>
  );
}
```

---

## 21 · RESPONSIVE DESIGN RULES

- **Mobile-first** Tailwind: base = mobile, `sm:` = 640px, `md:` = 768px, `lg:` = 1024px, `xl:` = 1280px.
- Grid patterns: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- Sidebar: hidden on mobile (`hidden lg:flex`), slide-in Sheet on mobile.
- Typography: `text-sm md:text-base`, headings `text-xl md:text-2xl lg:text-3xl`.
- Touch targets: min `h-10 w-10` (40px) for all interactive elements.
- Never use fixed pixel widths on containers — use `max-w-*` with `w-full`.

---

## 22 · TYPOGRAPHY SYSTEM (SENIOR UI/UX STANDARD)

Typography is **the foundation of visual hierarchy**. Apply these rules on every screen.

### Type Scale — Use these exact classes, never arbitrary sizes
```
Display:  text-5xl lg:text-7xl  font-bold   tracking-tight  leading-none     → Hero titles only
H1:       text-4xl lg:text-5xl  font-bold   tracking-tight  leading-tight     → Page titles
H2:       text-2xl lg:text-3xl  font-bold   tracking-tight  leading-snug      → Section headings
H3:       text-xl  lg:text-2xl  font-semibold tracking-tight leading-snug     → Card/widget titles
H4:       text-lg               font-semibold                leading-snug      → Sub-section labels
Body-LG:  text-base lg:text-lg  font-normal                  leading-relaxed  → Primary body copy
Body:     text-sm  lg:text-base font-normal                  leading-relaxed  → Default body
Body-SM:  text-xs  lg:text-sm   font-normal                  leading-normal   → Captions, metadata
Label:    text-xs               font-medium  tracking-wide   uppercase        → Form labels, badges
Mono:     text-sm               font-mono                                     → Code, IDs, numbers
```

### Large Text / Display Rules
- **Display text must breathe** — add `mb-4 lg:mb-6` below every hero heading.
- **Gradient headings** for marketing/landing: `bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent`
- **Negative letter-spacing is mandatory** for H1+ (`tracking-tight` or `tracking-tighter`). Loose tracking on large text looks amateur.
- **Never center-align body text** — center only headings and short hero subtext (max 2 lines). Left-align paragraphs always.
- **Max line length** (`max-w-prose` = 65ch) on all body copy. Long lines destroy readability.
- **Rich text / article content**: always wrap in `prose prose-slate dark:prose-invert max-w-prose` (requires `@tailwindcss/typography`).

### Font Weight Discipline
```
Black (900)  → Brand wordmarks only
Bold (700)   → H1, H2, display, CTAs
Semibold (600) → H3, H4, nav items, button labels
Medium (500) → Sub-labels, form labels, badge text
Regular (400) → All body copy
Light (300)  → Large decorative text only (never body)
```

### Hierarchy Check — Every screen must have exactly:
1. **One** dominant element (H1 or display) — the eye anchor.
2. **One or two** secondary elements (H2/H3).
3. **Body text** that never competes visually with headings.
4. **Muted text** (`text-muted-foreground`) for metadata/timestamps/captions.

### Typography Anti-Patterns — Never Do These
- ❌ Two different font weights on the same visual level
- ❌ `text-lg font-bold` for body paragraphs (looks like shouting)
- ❌ `font-light` on small text (< 14px) — unreadable on low-DPI screens
- ❌ All-caps on body text longer than 3 words
- ❌ More than 2 typefaces in one app (`font-sans` + `font-mono` maximum)
- ❌ `leading-tight` on body copy — causes line collision

---

## 23 · COLOR SYSTEM (SENIOR UI/UX STANDARD)

Color is communication. Every color choice must have intent.

### Color Role Definitions
```
Primary      → Brand actions: CTAs, links, active states, progress indicators
Secondary    → Supporting actions: secondary buttons, chips, tags
Accent       → Highlights: hover states, selected backgrounds, subtle fills
Muted        → Structural: disabled text, placeholders, dividers, captions
Destructive  → Errors, deletions, warnings (red family only)
Success      → Confirmations, completed states (green: #22c55e / emerald-500)
Warning      → Caution states (amber: #f59e0b / amber-500)
Info         → Informational callouts (blue: #3b82f6 or use primary)
```

### Color Usage Rules
1. **60-30-10 rule** — 60% neutral (background/surface), 30% secondary tones, 10% primary/accent.
2. **Never use raw hex in className** — always use design tokens (`bg-primary`, `text-muted-foreground`).
3. **Contrast minimum** — body text must pass WCAG AA (4.5:1 contrast ratio). Use `text-foreground` on `bg-background` only.
4. **Muted foreground** (`text-muted-foreground`) is for supporting info, never for important actions.
5. **Opacity variants** — use `bg-primary/10` for tinted backgrounds, `bg-destructive/15` for error zones.
6. **Status colors in dark mode** — always verify green/red/amber are not washed out. Add `dark:` overrides if token isn't sufficient.
7. **No rainbow UIs** — max 3 hue families per screen (primary + success/error + neutral).

### Choosing a Brand Color — Decision Guide
```
Finance / Enterprise / Healthcare → Deep blue (#1e40af) or slate — trust, stability
Agriculture / Eco / Sustainability → Green (#16a34a) or emerald — growth, nature
E-commerce / Consumer → Vibrant blue, indigo, or teal — energy, conversion
SaaS / Tech / AI → Blue-violet (#6366f1 indigo) or cool gray — modern, smart
Food / Hospitality → Warm orange (#ea580c) or amber — appetite, warmth
Education → Violet (#7c3aed) or cobalt blue — knowledge, creativity
```

### Status Color Component Pattern
```tsx
const statusStyles = {
  active:   "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  inactive: "bg-slate-500/10  text-slate-600  dark:text-slate-400  border-slate-500/20",
  pending:  "bg-amber-500/10  text-amber-600  dark:text-amber-400  border-amber-500/20",
  error:    "bg-red-500/10    text-red-600    dark:text-red-400    border-red-500/20",
};

<span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", statusStyles[status])}>
  {label}
</span>
```

### Dark Mode Color Rules
- **Never use pure black** (`#000`) as dark background — use `zinc-950` or `#09090b`.
- **Surface elevation in dark mode**: background → `zinc-950`, card → `zinc-900`, popover → `zinc-800`.
- **Borders in dark mode**: use `zinc-800` (`--border`) — never `zinc-700` (too strong).
- **Text in dark mode**: primary → `zinc-50`, secondary → `zinc-300`, muted → `zinc-500`.
- **Shadows don't work in dark mode** — replace with `border border-border` or `ring-1 ring-white/5`.

---

## 24 · UI/UX QUALITY RULES (NON-NEGOTIABLE)

1. **Pixel-perfect** — match Figma/mockup exactly if provided; no approximation.
2. **Enterprise-grade, not generic** — no cookie-cutter AI templates. Rich, purposeful UI.
3. **Zero raw `<img>`** — always `<Image>` from `next/image`.
4. **Zero `any` TypeScript** — type everything. Use `unknown` + type guards instead.
5. **No inline styles** — all styling via Tailwind or CSS variables.
6. **Proper alignment** — always use flex/grid for alignment, never manual spacing hacks.
7. **Icon consistency** — use `lucide-react` OR `@heroicons/react` exclusively, never mix.
8. **Loading states** — every async action must show Skeleton or Spinner.
9. **Error states** — every query must handle `isError` with a retry UI.
10. **Empty states** — every list must handle zero-items with illustration + CTA.
11. **Component splitting** — no file > 200 lines; extract to sub-components or hooks.
12. **Accessibility** — `aria-label`, `role`, keyboard nav on all custom interactive elements.
13. **Dark mode** — every component must work correctly in both modes.
14. **Spacing rhythm** — use multiples of 4px (Tailwind's default scale). Never mix arbitrary spacing values.
15. **Visual breathing room** — sections need `py-16 lg:py-24`, cards need `p-6`, form fields need `space-y-4`.

---

## 25 · COMPONENT SPLIT & HOOKS RULE

```
Page (Server Component)
  └── <PageClient /> (Client Component — "use client")
        ├── useTableControls()     ← hook: URL-driven pagination/search
        ├── useUsers()             ← hook: data fetching
        ├── <DataTable />          ← pure presentational component
        ├── <Filters />            ← filter bar component
        └── <Pagination />         ← pagination component
```

Extract logic into hooks when:
- Logic is reused across ≥ 2 components.
- Hook would exceed 30 lines of state/effect logic inside a component.
- Data fetching logic needs to be shared.

---

## 26 · PAUSE & RESUME PROTOCOL

If context limit approaches or generation is interrupted, output this block:

```
⏸ PAUSED — Frontend Skill Checkpoint
Completed: [list what was built]
Next: [exact next step]
Resume: "Continue from [ComponentName / section]"
```

---

## 27 · QUICK-START CHECKLIST (per new app)

```
□ STEP 0: Requirements → Architecture → Module list → Route plan → File tree (Section 0)
□ Detect version matrix (Next 15 or 16)
□ Scaffold src/ directory structure with real filenames
□ Setup globals.css with all CSS tokens + typography tokens
□ Install and configure: next-themes, next-auth, axios, @tanstack/react-query, zustand, next-auth.d.ts
□ Install @tailwindcss/typography for prose/rich-text content
□ Install shadcn/ui components needed for this app (run npx shadcn@latest add ...)
□ Setup middleware.ts for route protection
□ Create root layout with all providers
□ Setup Axios instance with interceptors
□ Create TanStack Query client
□ Apply typography scale (Section 22) — verify H1/H2/body hierarchy on first page
□ Verify color roles (Section 23) — confirm 60-30-10 balance
□ Setup native PWA (manifest.ts, sw.js), icons, install button
□ Create PWA components, swregister.tsx, splashscreen.tsx, pwa-install-prompt.tsx
□ Setup Recharts and use it for charts and graphs if needed
□ Build feature components with: Skeleton, Error, Empty states
□ Add Framer Motion page transitions
□ Verify dark mode on all components + check shadow → border fallback
□ Verify responsive on: 375px, 768px, 1280px
□ Verify typography: max-w-prose on body, tracking-tight on headings, no centered paragraphs
□ Remove all <img> tags (replace with next/image)
□ Remove all `any` TypeScript types
```

---

*Built by **Rakib Khan** — Software Engineer @ ACI PLC · v2.0.0*
