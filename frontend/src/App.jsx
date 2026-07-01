import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyAccount from "./pages/VerifyAccount";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route

            path="/"

            element={<Auth/>}

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
          element={<Dashboard />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;