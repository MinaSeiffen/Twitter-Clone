import { Route, Routes } from "react-router-dom";
import SignUpPage from "./Pages/Auth/SignUp/SignUpPage";
import LoginPage from "./Pages/Auth/Login/LoginPage";
import HomePage from "./Pages/Home/HomePage";
import SideBar from "./Components/Common/SideBar";
import RightPanel from "./Components/Common/RightPanel";
import NotificationPage from "./Pages/Notification/NotificationPage";
import ProfilePage from "./Pages/Profile/ProfilePage";

function App() {
	return (
		<div className='flex max-w-6xl mx-auto'>
      <SideBar/>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/signup' element={<SignUpPage />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path='/notifications' element={<NotificationPage />} />
				<Route path='/profile/:userName' element={<ProfilePage />} />
			</Routes>
      <RightPanel />
		</div>
	);
}

export default App