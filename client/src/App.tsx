import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TransactionProvider } from "@/context/TransactionContext";
import Home from "@/pages/Home";
import Money from "@/pages/Money";
import Bills from "@/pages/Bills";
import You from "@/pages/You";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/money" component={Money} />
      <Route path="/bills" component={Bills} />
      <Route path="/you" component={You} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TransactionProvider>
          <Toaster />
          <Router />
        </TransactionProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
