import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Gamepad2, Sparkles, Star, Flame, Trophy, X, Play, Filter, Zap, User, ChevronRight, Home, Grid3X3, Clock, Settings, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// --- Dummy catalog ---
const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "arcade", label: "Arcade" },
  { key: "puzzle", label: "Puzzle" },
  { key: "strategy", label: "Strategy" },
  { key: "racing", label: "Racing" },
  { key: "sports", label: "Sports" },
  { key: "retro", label: "Retro" },
];

const GAMES = [
  {
    id: "g1",
    title: "Neon Runner",
    category: "racing",
    rating: 4.7,
    plays: 12840,
    difficulty: "Easy",
    badges: ["New", "Hot"],
    description:
      "Dash through cyber-streets, drift neon corners, and chase milliseconds in a skill-first time-attack racer.",
  },
  {
    id: "g2",
    title: "Quantum Blocks",
    category: "puzzle",
    rating: 4.5,
    plays: 9021,
    difficulty: "Medium",
    badges: ["Editor Pick"],
    description:
      "A mind-bending grid puzzler where blocks entangle, collapse, and cascade. Think ahead or blink and lose.",
  },
  {
    id: "g3",
    title: "Starforge Tactics",
    category: "strategy",
    rating: 4.8,
    plays: 23105,
    difficulty: "Hard",
    badges: ["Ranked"],
    description:
      "Build, conquer, and outwit across a glittering sector. Multiplayer ladders, seasons, and replays.",
  },
  {
    id: "g4",
    title: "Street Striker 2D",
    category: "arcade",
    rating: 4.2,
    plays: 5012,
    difficulty: "Easy",
    badges: ["Retro"],
    description:
      "Pick-up-and-play brawler with crunchy hits, pixel art swagger, and couch co-op.",
  },
  {
    id: "g5",
    title: "Goalverse '25",
    category: "sports",
    rating: 4.1,
    plays: 7633,
    difficulty: "Medium",
    badges: ["Seasonal"],
    description:
      "Arcade football distilled: fast matches, skill shots, and squad chemistry.",
  },
  {
    id: "g6",
    title: "Retro Rocket",
    category: "retro",
    rating: 4.9,
    plays: 11002,
    difficulty: "Hard",
    badges: ["8‑bit"],
    description:
      "Vertical shmup love letter. Tight hitboxes, perfect patterns, pure flow.",
  },
];

const isDesktop = () => typeof window !== "undefined" && window.innerWidth >= 1024;

// --- Theme toggle (light/dark) ---
function useTheme() {
  const [theme, setTheme] = React.useState("dark");
  React.useEffect(() => {
    const stored = localStorage.getItem("gc_theme");
    if (stored) setTheme(stored);
  }, []);
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("gc_theme", theme);
  }, [theme]);
  return { theme, setTheme };
}

// --- Main App ---
export default function GameCenterApp() {
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [active, setActive] = useState(null as null | (typeof GAMES)[number]);
  const [tab, setTab] = useState("featured");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GAMES.filter((g) =>
      (category === "all" || g.category === category) &&
      (!q || g.title.toLowerCase().includes(q))
    );
  }, [query, category]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-zinc-100 dark:text-zinc-100">
      <Header theme={theme} setTheme={setTheme} />
      <main className="mx-auto max-w-7xl px-4 lg:px-8">
        <Hero />

        <section className="mt-6 flex flex-col gap-3 lg:mt-8 lg:flex-row lg:items-center lg:justify-between">
          <SearchBar query={query} setQuery={setQuery} />
          <CategoryStrip value={category} onChange={setCategory} />
        </section>

        <Tabs value={tab} onValueChange={setTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="featured" className="gap-2"><Sparkles className="h-4 w-4"/>Featured</TabsTrigger>
            <TabsTrigger value="trending" className="gap-2"><Flame className="h-4 w-4"/>Trending</TabsTrigger>
            <TabsTrigger value="new" className="gap-2"><Star className="h-4 w-4"/>New</TabsTrigger>
          </TabsList>
          <TabsContent value="featured" className="mt-4">
            <FeaturedRail games={filtered.slice(0,4)} onOpen={setActive} />
          </TabsContent>
          <TabsContent value="trending" className="mt-4">
            <FeaturedRail games={[...filtered].sort((a,b)=>b.plays-a.plays).slice(0,4)} onOpen={setActive} />
          </TabsContent>
          <TabsContent value="new" className="mt-4">
            <FeaturedRail games={[...filtered].reverse().slice(0,4)} onOpen={setActive} />
          </TabsContent>
        </Tabs>

        <section className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-100">All Games</h2>
            <div className="text-xs text-zinc-400">{filtered.length} result{filtered.length!==1 && "s"}</div>
          </div>
          <GamesGrid games={filtered} onOpen={setActive} />
        </section>
      </main>

      <MobileTabBar />

      <GameDrawer game={active} onOpenChange={(v)=>!v && setActive(null)} />
    </div>
  );
}

function Header({ theme, setTheme }: { theme: string; setTheme: (t: string)=>void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-black/60 backdrop-blur supports-[backdrop-filter]:bg-black/50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="relative grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-tr from-fuchsia-500 via-indigo-500 to-cyan-400 shadow-[0_0_40px_-10px] shadow-fuchsia-500/30">
            <Gamepad2 className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="font-semibold tracking-tight text-white">Orbit Arcade</div>
            <div className="text-[10px] uppercase tracking-widest text-zinc-400">Play • Compete • Repeat</div>
          </div>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          <Button variant="ghost" className="text-sm">Home</Button>
          <Button variant="ghost" className="text-sm">Catalog</Button>
          <Button variant="ghost" className="text-sm">Tournaments</Button>
          <Button variant="ghost" className="text-sm">Leaderboards</Button>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}
          </Button>
          <Button size="sm" className="gap-2">
            <User className="h-4 w-4"/> Sign in
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/20 via-fuchsia-500/15 to-cyan-500/10 p-6 shadow-2xl lg:p-10">
      <div className="relative z-10 max-w-2xl">
        <motion.h1
          initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.5}}
          className="text-3xl font-extrabold tracking-tight text-white lg:text-5xl"
        >
          One hub. Many worlds.
        </motion.h1>
        <p className="mt-3 max-w-xl text-sm text-zinc-300 lg:text-base">
          A sleek game centre for web titles: instant play, rich profiles, tournaments, and seasonal events. Mobile-first, desktop‑smart.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button className="gap-2"><Zap className="h-4 w-4"/> Quick Play</Button>
          <Button variant="outline" className="gap-2 border-white/20 text-white hover:bg-white/5">
            <Trophy className="h-4 w-4"/> View Leaderboards
          </Button>
        </div>
      </div>

      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-3xl"/>
      <div className="pointer-events-none absolute -bottom-10 right-10 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl"/>
    </section>
  );
}

function SearchBar({ query, setQuery }: { query: string; setQuery: (v: string)=>void }) {
  return (
    <div className="flex w-full items-center gap-2 rounded-2xl border border-white/10 bg-zinc-950/60 p-2 backdrop-blur lg:max-w-md">
      <Search className="ml-1 h-4 w-4 text-zinc-400"/>
      <Input
        value={query}
        onChange={(e)=>setQuery(e.target.value)}
        placeholder="Search games, modes, or tags"
        className="border-0 bg-transparent text-sm text-white placeholder:text-zinc-500 focus-visible:ring-0"
      />
    </div>
  );
}

function CategoryStrip({ value, onChange }: { value: string; onChange: (v: string)=>void }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <ToggleGroup type="single" value={value} onValueChange={(v)=>v && onChange(v)} className="gap-2">
        {CATEGORIES.map((c) => (
          <ToggleGroupItem
            key={c.key}
            value={c.key}
            className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs text-white data-[state=on]:border-fuchsia-400/60 data-[state=on]:bg-fuchsia-500/10"
          >
            {c.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Button variant="ghost" size="sm" className="gap-2 text-zinc-300"><Filter className="h-4 w-4"/>More</Button>
    </div>
  );
}

function FeaturedRail({ games, onOpen }: { games: typeof GAMES; onOpen: (g: any)=>void }) {
  return (
    <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto">
      {games.map((g) => (
        <motion.div key={g.id} whileHover={{ y: -2 }} className="min-w-[280px] snap-start lg:min-w-[360px]">
          <Card className="group relative overflow-hidden rounded-3xl border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950">
            <CardContent className="p-0">
              <div className="h-40 w-full bg-[linear-gradient(120deg,rgba(240,46,170,.25),rgba(33,159,255,.18))]"/>
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  {g.badges?.map((b) => (
                    <Badge key={b} className="border-white/10 bg-white/5 text-xs text-zinc-200">{b}</Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{g.title}</h3>
                    <p className="text-xs text-zinc-400">{capitalize(g.category)} • {g.difficulty}</p>
                  </div>
                  <div className="text-right text-xs text-zinc-400">
                    ★ {g.rating}
                    <div className="text-[10px]">{Intl.NumberFormat().format(g.plays)} plays</div>
                  </div>
                </div>
                <div className="mt-3 flex justify-between">
                  <Button size="sm" className="gap-2" onClick={()=>onOpen(g)}>
                    <Play className="h-4 w-4"/> Play
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 border-white/20 text-white hover:bg-white/5">
                    Details <ChevronRight className="h-4 w-4"/>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function GamesGrid({ games, onOpen }: { games: typeof GAMES; onOpen: (g: any)=>void }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
      {games.map((g) => (
        <Card key={g.id} className="overflow-hidden rounded-2xl border-white/10 bg-zinc-950/70">
          <CardHeader className="p-0">
            <div className="h-24 w-full bg-[radial-gradient(1200px_200px_at_0%_0%,rgba(255,255,255,0.1),rgba(0,0,0,0))]" />
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="text-sm text-white">{g.title}</CardTitle>
                <p className="mt-0.5 text-[10px] uppercase tracking-widest text-zinc-500">{g.category}</p>
              </div>
              <Badge variant="secondary" className="bg-white/10 text-[10px] text-zinc-200">★ {g.rating}</Badge>
            </div>
            <p className="mt-2 line-clamp-2 text-xs text-zinc-400">{g.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <Button size="sm" className="h-8 gap-2" onClick={()=>onOpen(g)}>
                <Play className="h-4 w-4"/> Play
              </Button>
              <div className="text-[10px] text-zinc-500">{Intl.NumberFormat().format(g.plays)} plays</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function GameDrawer({ game, onOpenChange }: { game: any; onOpenChange: (open: boolean)=>void }) {
  const desktop = isDesktop();
  if (!game) return null;

  const Body = (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{game.title}</h3>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Badge className="border-white/10 bg-white/5 text-zinc-200">{capitalize(game.category)}</Badge>
          <span>★ {game.rating}</span>
          <span>• {game.difficulty}</span>
        </div>
      </div>
      <p className="text-sm text-zinc-300">{game.description}</p>
      <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-3">
        <div className="text-xs text-zinc-400">Status</div>
        <div className="text-sm text-zinc-200">Coming soon — this is a placeholder. Hook your game canvas or route here.</div>
      </div>
      <div className="flex gap-2">
        <Button className="gap-2"><Play className="h-4 w-4"/> Launch</Button>
        <Button variant="outline" className="gap-2 border-white/20 text-white hover:bg-white/5"><Trophy className="h-4 w-4"/> View Leaderboard</Button>
      </div>
    </div>
  );

  return desktop ? (
    <Dialog open={!!game} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl border-white/10 bg-zinc-950">
        <DialogHeader>
          <DialogTitle className="text-white">Game</DialogTitle>
        </DialogHeader>
        {Body}
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={!!game} onOpenChange={onOpenChange}>
      <DrawerContent className="border-white/10 bg-zinc-950">
        <DrawerHeader>
          <DrawerTitle className="text-white">Game</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-6">{Body}</div>
      </DrawerContent>
    </Drawer>
  );
}

function MobileTabBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/70 backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1 p-2">
        {[
          { icon: Home, label: "Home" },
          { icon: Grid3X3, label: "Catalog" },
          { icon: Clock, label: "Recent" },
          { icon: Settings, label: "Settings" },
        ].map((i) => (
          <button key={i.label} className="group grid place-items-center gap-1 rounded-xl p-2 text-zinc-400 hover:bg-white/5">
            <i.icon className="h-5 w-5"/>
            <span className="text-[10px]">{i.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// --- utils ---
function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
