import {

    BrowserRouter,

    Routes,

    Route

} from "react-router-dom";

import Auth from "./pages/Auth";

import Dashboard from "./pages/Dashboard";

import Signup from "./pages/Signup";

import VerifyAccount from "./pages/VerifyAccount";

import AdminDashboard from "./admin/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route

                    path="/"

                    element={<Auth />}

                />

                <Route

                    path="/signup"

                    element={<Signup />}

                />

                <Route

                    path="/verify"

                    element={<VerifyAccount />}

                />

                <Route

                    path="/dashboard"

                    element={

                        <ProtectedRoute

                            role="Customer"

                        >

                            <Dashboard />

                        </ProtectedRoute>

                    }

                />

                <Route

                    path="/admin"

                    element={

                        <ProtectedRoute

                            role="Admin"

                        >

                            <AdminDashboard />

                        </ProtectedRoute>

                    }

                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;