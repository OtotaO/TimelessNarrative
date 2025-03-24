import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Phrases from "@/pages/phrases";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { BookOpen, BookText } from "lucide-react";

function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex gap-6 md:gap-10">
          <Link href="/">
            <Button variant={location === "/" ? "default" : "ghost"} className="gap-2">
              <BookOpen className="w-4 h-4" />
              Timeline
            </Button>
          </Link>
          <Link href="/phrases">
            <Button variant={location === "/phrases" ? "default" : "ghost"} className="gap-2">
              <BookText className="w-4 h-4" />
              Phrases
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/phrases" component={Phrases} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Navigation />
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;