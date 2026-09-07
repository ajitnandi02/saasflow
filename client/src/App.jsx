import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";

import ProtectedRoute from "./components/common/ProtectedRoute.jsx";

import Dashboard from "./pages/dashboard/Dashboard.jsx";

import Navbar from "./components/navigation/Navbar.jsx";
import Users from "./pages/users/Users.jsx";

import Projects from "./pages/projects/Projects.jsx";
import Tasks from "./pages/tasks/Tasks.jsx";


// ==========================================
// APP
// ==========================================

function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* ==========================================
            PUBLIC ROUTES
        ========================================== */}

        {/* HOME */}

        <Route
          path="/"
          element={
            <h1>
              SaaSFlow
            </h1>
          }
        />


        {/* LOGIN */}

        <Route
          path="/login"
          element={
            <Login />
          }
        />


        {/* REGISTER */}

        <Route
          path="/register"
          element={
            <Register />
          }
        />


        {/* ==========================================
            PROTECTED DASHBOARD
        ========================================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>

              <>

                <Navbar />

                <Dashboard />

              </>

            </ProtectedRoute>
          }
        />


        {/* ==========================================
            TEMPORARY USERS
        ========================================== */}

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Users />
              </>
            </ProtectedRoute>
          }
        />


        {/* ==========================================
            TEMPORARY PROJECTS
        ========================================== */}

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Projects />
              </>
            </ProtectedRoute>
          }
        />


        {/* ==========================================
            TEMPORARY TASKS
        ========================================== */}

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Tasks />
              </>
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;