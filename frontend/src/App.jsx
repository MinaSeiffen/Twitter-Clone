import { Navigate, Route, Routes } from "react-router-dom";
import SignUpPage from "./Pages/Auth/SignUp/SignUpPage";
import LoginPage from "./Pages/Auth/Login/LoginPage";
import HomePage from "./Pages/Home/HomePage";
import SideBar from "./Components/Common/SideBar";
import RightPanel from "./Components/Common/RightPanel";
import NotificationPage from "./Pages/Notification/NotificationPage";
import ProfilePage from "./Pages/Profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./Components/Common/LoadingSpinner";

function App() {
  const {data: authUser , isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async()=>{
      try {
        const res = await fetch('/api/auth/getme')
        const data = await res.json()

        if (data.error) {
          return null;
        }

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong")
        }

        return data
      } catch (error) {
        throw new Error(error)
      }
    },
    retry: false,
  })


  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }


  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser && <SideBar />}
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to={"/login"} />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/"} /> } />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to={"/login"} />} />
        <Route path="/profile/:userName" element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />} />
      </Routes>
      {authUser && <RightPanel />}
      <Toaster />
    </div>
  );
}

export default App;
