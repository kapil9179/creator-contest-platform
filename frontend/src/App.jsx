import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import AdminWinners from "./pages/AdminWinners.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import Feed from "./pages/Feed.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Signup from "./pages/Signup.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

const App = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Navigate to="/feed" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/feed" element={<Feed />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/winners" element={<AdminWinners />} />
      </Route>
      <Route path="*" element={<Navigate to="/feed" replace />} />
    </Routes>
  </>
);

export default App;
