import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AppShell } from "./components/layout/AppShell";
import { PublicLayout } from "./components/layout/PublicLayout";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { MyRequestsPage } from "./pages/MyRequestsPage";
import { NewRequestPage } from "./pages/NewRequestPage";
import { RequestDetailPage } from "./pages/RequestDetailPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PublicOnlyRoute } from "./routes/PublicOnlyRoute";
import { RoleRoute } from "./routes/RoleRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <PublicLayout>
                <LoginPage />
              </PublicLayout>
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppShell>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />

                  <Route
                    path="/requests"
                    element={<MyRequestsPage />}
                  />

                  <Route
                    path="/requests/new"
                    element={<NewRequestPage />}
                  />

                  <Route
                    path="/requests/:id"
                    element={<RequestDetailPage />}
                  />

                  <Route
                    path="/analytics"
                    element={
                      <RoleRoute allowedRoles={["MANAGER", "ADMIN"]}>
                        <AnalyticsPage />
                      </RoleRoute>
                    }
                  />

                  <Route
                    path="/settings"
                    element={<SettingsPage />}
                  />
                </Routes>
              </AppShell>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;