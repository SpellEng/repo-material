import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Contact from "./Pages/Contact/Contact";
import Faqs from "./Pages/Faqs/Faqs";
import Registration from "./Pages/Registration/Registration";
import Login from "./Pages/Login/Login";
import About from "./Pages/About/About";
import Tutors from "./Pages/AllTutors/AllTutors";
import StudentProfile from "./Pages/Students/StudentProfile/StudentProfile";
import TutorProfile from "./Pages//Tutors/TutorProfile/TutorProfile";
import UpcomingStudent from "./Pages/Students/UpcomingStudent/UpcomingStudent";
import UpcomingTutor from "./Pages/Tutors/UpcomingTutor/UpcomingTutor";
import Subscription from "./Pages/Subscription/Subscription";
import TeacherDetails from "./Pages/TeacherDetails/TeacherDetails";
import Availability from "./Pages/Tutors/Availability/Availability";
import Terms from "./Pages/Terms/Terms";
import Privacy from "./Pages/Privacy/Privacy";
import { SocketProvider } from "./Context/SocketContext";
import Chat from "./Pages/Chat/Chat";
import Footer from "./Components/Footer/Footer";
import StudentDashboard from "./Pages/Students/StudentDashboard/StudentDashboard";
import Navbar from "./Components/Navbar/Navbar";
import TutorEarnings from "./Pages/Tutors/Earning/Earning";
import { useEffect, useState } from "react";
import ProtectedRoutes from "./Routes/ProtectedRoutes";
import MySubscriptions from "./Pages/Students/MySubscriptions/MySubscriptions";
import VideoPage from "./Pages/UpdatedVideo/VideoPage";
import { isAuthenticated } from "./Components/Auth/auth";
import axios from "axios";
import AdminRoutes from "./Routes/AdminRoute";
import AdminTutorsList from "./Pages/Admin/Tutors/Tutors";
import AdminStudentsList from "./Pages/Admin/Students/Students";
import AdminClassesList from "./Pages/Admin/Classes/Classes";
import AdminDashboard from "./Pages/Admin/Dashboard/Dashboard";
import TeacherReviews from "./Pages/TeacherReviews/TeacherReviews";
import TutorRegistration from "./Pages/TutorRegistration/TutorRegistration";
import CancellationAndRefund from "./Pages/CancellationAndRefund/CancellationAndRefund";
import ShippingPolicy from "./Pages/ShippingPolicy/ShippingPolicy";
import AdminCoupons from "./Pages/Admin/Coupons/Coupons";
import BookTrial from "./Pages/BookTrial/BookTrial";
import ForgotPassword from "./Pages/ResetPassword/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";

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

    return () => {

    }
  }, [location.pathname])



  return (
    <div className="App">
      <SocketProvider>
        {
          // location?.pathname !== "/video-class" &&
          <Navbar />
        }
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/all-tutors" element={<Tutors />} />
          <Route path="/student/profile" element={<ProtectedRoutes><StudentProfile /></ProtectedRoutes>} />
          <Route path="/student/upcoming-classes" element={<ProtectedRoutes><UpcomingStudent /></ProtectedRoutes>} />
          <Route path="/student/subscriptions" element={<ProtectedRoutes><MySubscriptions /></ProtectedRoutes>} />
          <Route path="/student/book-trial" element={<ProtectedRoutes><BookTrial /></ProtectedRoutes>} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/tutor/:id" element={<TeacherDetails />} />
          <Route path="/student/dashboard" element={<ProtectedRoutes><StudentDashboard /></ProtectedRoutes>} />
          <Route path="/tutor/registration" element={<TutorRegistration />} />
          <Route path="/tutor/profile" element={<ProtectedRoutes><TutorProfile /></ProtectedRoutes>} />
          <Route path="/tutor/availability" element={<ProtectedRoutes><Availability /></ProtectedRoutes>} />
          <Route path="/tutor/earnings" element={<ProtectedRoutes><TutorEarnings /></ProtectedRoutes>} />
          <Route path="/tutor/upcoming-classes" element={<ProtectedRoutes><UpcomingTutor /></ProtectedRoutes>} />
          <Route path="/video-class" element={<ProtectedRoutes><VideoPage /></ProtectedRoutes>} />
          <Route path="/class/leave-a-review" element={<ProtectedRoutes><TeacherReviews /></ProtectedRoutes>} />
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
        {
          location?.pathname !== "/chats" &&
          <Footer />
        }
      </SocketProvider>
    </div>
  );
}

export default App;
