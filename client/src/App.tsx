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

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/competition/:id" component={CompetitionPage} />
      <Route path="/competition/:id/districts" component={CompetitionDistrictsPage} />
      <Route path="/tracks" component={TracksListPage} />
      <Route path="/tracks/:id" component={TrackDetailsPage} />
      <Route path="/case-details/:id" component={CaseDetails} />
      <ProtectedRoute path="/register-competition/:id" component={RegisterCompetition} />
      <ProtectedRoute path="/admin" component={AdminDashboard} />
      <ProtectedRoute path="/admin/competitions" component={AdminCompetitions} />
      <ProtectedRoute path="/admin/participants" component={AdminParticipants} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'LOGIN_STATUS' && event.data.isLoggedIn) {
        // 保存父级传递的token
        localStorage.setItem('token', event.data.token);
      } else if (event.data.type === 'LOGOUT') {
        // 处理退出登录
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
      <TooltipProvider>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
