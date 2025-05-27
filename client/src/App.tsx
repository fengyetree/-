import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import CompetitionPage from "@/pages/competition-page";
import RegisterCompetition from "@/pages/register-competition";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminCompetitions from "@/pages/admin/competitions";
import AdminParticipants from "@/pages/admin/participants";
import TrackDetailsPage from "@/pages/track-details";
import TracksListPage from "@/pages/tracks-list";
import CaseDetails from "@/pages/case-details";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import { useEffect } from "react";
import CompetitionDistrictsPage from "@/pages/competition-districts-page";
import CompetitionMapPage from "@/pages/competition-map-page";
import AllUniversitiesPage from "@/pages/all-universities-page";
import LoginPage from "@/pages/login-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/competition/:id" component={CompetitionPage} />
      <Route path="/competition/:id/register" component={RegisterCompetition} />
      <Route path="/competition/:id/districts" component={CompetitionDistrictsPage} />
      <Route path="/competition/:id/map" component={CompetitionMapPage} />
      <Route path="/track/:id" component={TrackDetailsPage} />
      <Route path="/tracks" component={TracksListPage} />
      <Route path="/case/:id" component={CaseDetails} />
      <Route path="/universities" component={AllUniversitiesPage} />
      <Route path="/admin" component={ProtectedRoute(AdminDashboard)} />
      <Route path="/admin/competitions" component={ProtectedRoute(AdminCompetitions)} />
      <Route path="/admin/participants" component={ProtectedRoute(AdminParticipants)} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'LOGIN_STATUS' && event.data.isLoggedIn) {
        localStorage.setItem('token', event.data.token);
      } else if (event.data.type === 'LOGOUT') {
        localStorage.removeItem('token');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
