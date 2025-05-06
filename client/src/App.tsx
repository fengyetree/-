import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import CompetitionPage from "@/pages/competition-page";
import RegisterCompetition from "@/pages/register-competition";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminCompetitions from "@/pages/admin/competitions";
import AdminParticipants from "@/pages/admin/participants";
import TrackDetailsPage from "@/pages/track-details";
import TracksListPage from "@/pages/tracks-list";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/competition/:id" component={CompetitionPage} />
      <Route path="/tracks" component={TracksListPage} />
      <Route path="/tracks/:id" component={TrackDetailsPage} />
      <ProtectedRoute path="/register-competition/:id" component={RegisterCompetition} />
      <ProtectedRoute path="/admin" component={AdminDashboard} />
      <ProtectedRoute path="/admin/competitions" component={AdminCompetitions} />
      <ProtectedRoute path="/admin/participants" component={AdminParticipants} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
