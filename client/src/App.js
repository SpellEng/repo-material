import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { SocketProvider } from './Context/SocketContext';
import ProtectedRoutes from './Routes/ProtectedRoutes';
import AdminRoutes from './Routes/AdminRoute';
import { isAuthenticated } from './Components/Auth/auth';
import axios from 'axios';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import Learn from './Pages/Learn/Learn';

// Lazy loading components
const Home = lazy(() => import('./Pages/Home/Home'));
const Contact = lazy(() => import('./Pages/Contact/Contact'));
const Faqs = lazy(() => import('./Pages/Faqs/Faqs'));
const Registration = lazy(() => import('./Pages/Registration/Registration'));
const Login = lazy(() => import('./Pages/Login/Login'));
const About = lazy(() => import('./Pages/About/About'));
const Tutors = lazy(() => import('./Pages/AllTutors/AllTutors'));
const StudentProfile = lazy(() => import('./Pages/Students/StudentProfile/StudentProfile'));
const TutorProfile = lazy(() => import('./Pages/Tutors/TutorProfile/TutorProfile'));
const UpcomingStudent = lazy(() => import('./Pages/Students/UpcomingStudent/UpcomingStudent'));
const UpcomingTutor = lazy(() => import('./Pages/Tutors/UpcomingTutor/UpcomingTutor'));
const Subscription = lazy(() => import('./Pages/Subscription/Subscription'));
const TeacherDetails = lazy(() => import('./Pages/TeacherDetails/TeacherDetails'));
const Availability = lazy(() => import('./Pages/Tutors/Availability/Availability'));
const Terms = lazy(() => import('./Pages/Terms/Terms'));
const Privacy = lazy(() => import('./Pages/Privacy/Privacy'));
const Chat = lazy(() => import('./Pages/Chat/Chat'));
const TutorEarnings = lazy(() => import('./Pages/Tutors/Earning/Earning'));
const MySubscriptions = lazy(() => import('./Pages/Students/MySubscriptions/MySubscriptions'));
const AdminTutorsList = lazy(() => import('./Pages/Admin/Tutors/Tutors'));
const AdminStudentsList = lazy(() => import('./Pages/Admin/Students/Students'));
const AdminClassesList = lazy(() => import('./Pages/Admin/Classes/Classes'));
const AdminDashboard = lazy(() => import('./Pages/Admin/Dashboard/Dashboard'));
const TutorRegistration = lazy(() => import('./Pages/TutorRegistration/TutorRegistration'));
const CancellationAndRefund = lazy(() => import('./Pages/CancellationAndRefund/CancellationAndRefund'));
const ShippingPolicy = lazy(() => import('./Pages/ShippingPolicy/ShippingPolicy'));
const AdminCoupons = lazy(() => import('./Pages/Admin/Coupons/Coupons'));
const BookTrial = lazy(() => import('./Pages/BookTrial/BookTrial'));
const ForgotPassword = lazy(() => import('./Pages/ForgotPassword/ForgotPassword'));
const ResetPassword = lazy(() => import('./Pages/ForgotPassword/ResetPassword'));

function App() {
  const location = useLocation();
  const [subscriptions, setSubscriptions] = useState([]);

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/subscriptions/user/${isAuthenticated()?._id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });
      setSubscriptions(response.data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated()?.role === 0) {
      fetchSubscriptions();
    }
  }, []);

  useEffect(() => {
    const checkExpiry = async () => {
      const now = new Date();
      for (let subscription of subscriptions) {
        const expiryDate = new Date(subscription.expiryDate);
        if (expiryDate < now && subscription.status !== 'expired') {
          try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/subscriptions/update-status/${subscription._id}`, { status: "expired" }, {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
              }
            }).then(res => {
              if (res.status === 200) {
                fetchSubscriptions();
              }
            })
          } catch (error) {
            console.error('Error updating subscription status:', error);
          }
        }
      }
    };

    checkExpiry();
  }, [subscriptions]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="App">
      <SocketProvider>
        {
          location?.pathname !== "/learn" &&
          <Navbar />
        }
        <Suspense fallback={<div></div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/signup" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/all-tutors" element={<ProtectedRoutes><Tutors /></ProtectedRoutes>} />
            <Route path="/student/profile" element={<ProtectedRoutes><StudentProfile /></ProtectedRoutes>} />
            <Route path="/student/upcoming-classes" element={<ProtectedRoutes><UpcomingStudent /></ProtectedRoutes>} />
            <Route path="/student/subscriptions" element={<ProtectedRoutes><MySubscriptions /></ProtectedRoutes>} />
            <Route path="/student/book-trial" element={<ProtectedRoutes><BookTrial /></ProtectedRoutes>} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/tutor/:id" element={<TeacherDetails />} />
            <Route path="/tutor/registration" element={<TutorRegistration />} />
            <Route path="/tutor/profile" element={<ProtectedRoutes><TutorProfile /></ProtectedRoutes>} />
            <Route path="/tutor/availability" element={<ProtectedRoutes><Availability /></ProtectedRoutes>} />
            <Route path="/tutor/earnings" element={<ProtectedRoutes><TutorEarnings /></ProtectedRoutes>} />
            <Route path="/tutor/upcoming-classes" element={<ProtectedRoutes><UpcomingTutor /></ProtectedRoutes>} />
            <Route path="/chats" element={<ProtectedRoutes><Chat /></ProtectedRoutes>} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/faqs" element={<Faqs />} />
            <Route path="/cancellation-and-refund-policy" element={<CancellationAndRefund />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminRoutes><AdminDashboard /></AdminRoutes>} />
            <Route path="/admin/tutors" element={<AdminRoutes><AdminTutorsList /></AdminRoutes>} />
            <Route path="/admin/students" element={<AdminRoutes><AdminStudentsList /></AdminRoutes>} />
            <Route path="/admin/classes" element={<AdminRoutes><AdminClassesList /></AdminRoutes>} />
            <Route path="/admin/coupons" element={<AdminRoutes><AdminCoupons /></AdminRoutes>} />
          </Routes>
        </Suspense>
        {
          location?.pathname !== "/chats" && location?.pathname !== "/learn" &&
          <Footer />
        }
      </SocketProvider>
    </div>
  );
}

export default App;
