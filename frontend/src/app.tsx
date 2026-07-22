import { FC } from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddSkill from "./pages/AddSkill";
import EditSkill from "./pages/EditSkill";
import MySkills from "./pages/MySkills";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import Messages from "./pages/Messages";
import MySessions from "./pages/MySessions";
import BookSession from "./pages/BookSession";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import BrowseSkills from "./pages/browseSkills";

const App: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/skills" element={<BrowseSkills />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <Help />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages/:userId"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/skills/add"
        element={
          <ProtectedRoute>
            <AddSkill />
          </ProtectedRoute>
        }
      />
      <Route
        path="/skills/edit/:id"
        element={
          <ProtectedRoute>
            <EditSkill />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-skills"
        element={
          <ProtectedRoute>
            <MySkills />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-sessions"
        element={
          <ProtectedRoute>
            <MySessions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/book-session/:skillId"
        element={
          <ProtectedRoute>
            <BookSession />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;