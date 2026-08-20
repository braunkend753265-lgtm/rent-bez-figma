import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import SearchPage from "./pages/SearchPage";
import ListingPage from "./pages/ListingPage";
import { LandlordsPage, RentPage } from "./pages/MarketingPages";
import AuthPage from "./pages/AuthPage";
import OwnerPage from "./pages/OwnerPage";
import { CityProvider } from "./contexts/CityContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={SearchPage} />
      <Route path={"/search"} component={SearchPage} />
      <Route path="/listing/:id">{(params) => <ListingPage id={params.id} />}</Route>
      <Route path={"/rent"} component={RentPage} />
      <Route path={"/landlords"} component={LandlordsPage} />
      <Route path={"/auth"} component={AuthPage} />
      <Route path={"/owner"} component={OwnerPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <CityProvider><FavoritesProvider><TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider></FavoritesProvider></CityProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
