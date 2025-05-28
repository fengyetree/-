
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/toaster";

import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import CompetitionPage from "@/pages/competition-page";
import RegisterCompetition from "@/pages/register-competition";
import TracksList from "@/pages/tracks-list";
import TrackDetails from "@/pages/track-details";
import CaseDetails from "@/pages/case-details";
import CompetitionMapPage from "@/pages/competition-map-page";
import AllUniversitiesPage from "@/pages/all-universities-page";
import CompetitionDistrictsPage from "@/pages/competition-districts-page";
import DistrictRegistrationPage from "@/pages/district-registration-page";
import NotFound from "@/pages/not-found";

// Admin pages
import AdminLayout from "@/pages/admin/layout";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminCompetitions from "@/pages/admin/competitions";
import AdminParticipants from "@/pages/admin/participants";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/auth" component={AuthPage} />
            <Route path="/competition/:id" component={CompetitionPage} />
            <Route path="/register-competition/:id" component={RegisterCompetition} />
            <Route path="/tracks" component={TracksList} />
            <Route path="/track/:id" component={TrackDetails} />
            <Route path="/case/:id" component={CaseDetails} />
            <Route path="/competition-map" component={CompetitionMapPage} />
            <Route path="/universities" component={AllUniversitiesPage} />
            <Route path="/districts" component={CompetitionDistrictsPage} />
            <Route path="/district-registration/:district" component={DistrictRegistrationPage} />
            
            {/* Admin routes */}
            <Route path="/admin" nest>
              <AdminLayout>
                <Switch>
                  <Route path="/" component={AdminDashboard} />
                  <Route path="/competitions" component={AdminCompetitions} />
                  <Route path="/participants" component={AdminParticipants} />
                </Switch>
              </AdminLayout>
            </Route>
            
            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
