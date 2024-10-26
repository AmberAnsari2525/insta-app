import './App.css';
import "../src/sass/main.css"
import "../src/sass/vender/bootstrap.css"
import  '../src/sass/vender/bootstrap.min.css'
import '../src/owlcarousel/owl.carousel.min.css'
import '../src/owlcarousel/owl.theme.default.min.css'

import {AuthProvider} from './Context/Authcontext';
import AuthContext from './Context/Authcontext';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import {Login} from "./pages/login";
import {SignUpPage} from "./pages/sign_up"
import {Home} from './pages/home'
import {Explore} from "./pages/explore";
import {Messages} from "./pages/messages"
import {Notifications} from "./pages/notification";
import MainLayout from "./pages/mainLayout";
import {Profile} from "./pages/profile";
import {Reels} from "./pages/reels";
import 'bootstrap/dist/css/bootstrap.min.css';
import password from "./pages/password";
import UserProfile from "./pages/userprofile";
import {EditUser} from "./pages/editUser";
import Users from  './pages/user'
import PrivacySetting from "./pages/privacy";
function App() {
  return (
    <>
        <Router>
            <AuthProvider>
                <div>
                    <Routes>
                        {/* Routes without Navbar (Login, Signup, Forgot Password) */}
                        <Route path="/" element={
                            <AuthContext.Consumer>
                                {({ preventAuthAccess }) => preventAuthAccess(SignUpPage)}
                            </AuthContext.Consumer>
                        } />
                        <Route path="/sign-up" element={
                            <AuthContext.Consumer>
                                {({ preventAuthAccess }) => preventAuthAccess(SignUpPage)}
                            </AuthContext.Consumer>
                        } />
                        <Route path="/log-in" element={
                            <AuthContext.Consumer>
                                {({ preventAuthAccess }) => preventAuthAccess(Login)}
                            </AuthContext.Consumer>
                        } />



                        {/* Routes with Navbar inside MainLayout  start*/}
                        <Route element={<MainLayout />}>
                            <Route path="/home" element={
                                <AuthContext.Consumer>
                                    {({requireAuth}) => requireAuth(Home)}
                                </AuthContext.Consumer>
                            } />
                            <Route path="/all-user" element={
                                <AuthContext.Consumer>
                                    {({requireAuth}) => requireAuth(Users)}
                                </AuthContext.Consumer>
                            } />

                            <Route path="/messages/" element={
                                <AuthContext.Consumer>
                                    {({requireAuth}) => requireAuth(Messages)}
                                </AuthContext.Consumer>
                            } />
                            <Route path="/profile" element={
                                <AuthContext.Consumer>
                                    {({requireAuth}) => requireAuth(Profile)}
                                </AuthContext.Consumer>
                            } />
                            <Route path="/reels" element={
                                <AuthContext.Consumer>
                                    {({requireAuth}) => requireAuth(Reels)}
                                </AuthContext.Consumer>
                            } />
                            <Route path="/explore" element={
                                <AuthContext.Consumer>
                                    {({requireAuth}) => requireAuth(Explore)}
                                </AuthContext.Consumer>
                            } />
                            <Route path="/notification" element={
                                <AuthContext.Consumer>
                                    {({requireAuth}) => requireAuth(Notifications)}
                                </AuthContext.Consumer>
                            } />

                            <Route path="/password" element={
                                <AuthContext.Consumer>
                                    {({requireAuth}) => requireAuth(password)}
                                </AuthContext.Consumer>
                            } />
                            <Route path="/userprofile/:id" element={
                                <AuthContext.Consumer>
                                    {({requireAuth}) => requireAuth(UserProfile )}
                                </AuthContext.Consumer>
                            } />
                            <Route path="/edit-user" element={
                                <AuthContext.Consumer>
                                    {({requireAuth}) => requireAuth(EditUser)}
                                </AuthContext.Consumer>
                            } />
                            <Route path="/account-privacy" element={
                                <AuthContext.Consumer>
                                    {({requireAuth}) => requireAuth(PrivacySetting)}
                                </AuthContext.Consumer>
                            } />


                        </Route>





                    </Routes>
                </div>
            </AuthProvider>
        </Router>

    </>
  );
}

export default App;
