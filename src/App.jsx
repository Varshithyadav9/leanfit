import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./App.css";

import WelcomePage from "./components/WelcomePage";
import LoginPage from "./components/LoginPage";
import BasicProfile from "./components/BasicProfile";
import GoalPage from "./components/GoalPage";
import FoodPreferences from "./components/FoodPreferences";
import HabitsPage from "./components/HabitsPage";
import PlanPage from "./components/PlanPage";
import PaymentPage from "./components/PaymentPage";
import Dashboard from "./components/Dashboard";
import SuccessPage from "./components/SuccessPage";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import AdminCoupons from "./components/AdminCoupons";
import CustomerPortal from "./components/CustomerPortal";
import CustomerAuth from "./components/CustomerAuth";
import InfoPage from "./components/InfoPage";
import NotFoundPage from "./components/NotFoundPage";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import EmailTemplates from "./components/EmailTemplates";
import SmartCoach from "./components/SmartCoach";
import Calculators from "./components/Calculators";
import FeedbackPage from "./components/FeedbackPage";
import ForgotPassword from "./components/ForgotPassword";
import ProtectedPage from "./components/ProtectedPage";
import SiteHeader from "./components/SiteHeader";
import { saveSession } from "./utils/auth";
const PUBLIC_PAGE_PATHS = {
  about: "/about",
  contact: "/contact",
  calculators: "/calculators",
  privacy: "/privacy",
  terms: "/terms",
};

const PATH_TO_PUBLIC_PAGE = {
  "/about": "about",
  "/contact": "contact",
  "/calculators": "calculators",
  "/privacy": "privacy",
  "/terms": "terms",
};
function App() {
  const [page, setPageState] = useState("welcome");

const navigate = useNavigate();
const location = useLocation();

const setPage = (nextPage) => {
  const publicPath = PUBLIC_PAGE_PATHS[nextPage];

  if (publicPath) {
    navigate(publicPath);
    return;
  }

  setPageState(nextPage);

  if (location.pathname !== "/") {
    navigate("/");
  }
};

const withSiteHeader = (content, { showBrand = false } = {}) => (<>
  <SiteHeader setPage={setPage} showBrand={showBrand} />
  {content}
</>);
  const [generatedPlan, setGeneratedPlan] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    targetWeight: "",
    activityLevel: "",
    experience: "",
    location: "",
    goal: "",
    foods: {},
    smoking: "",
    alcohol: "",
    sleep: "",
    stress: "",
    workoutTime: "",
    waterIntake: "",
    selectedPlan: "",
    selectedPrice: "",
  });

  const saveCustomer = (customerData, token, remember = true) => {
    saveSession(customerData, token, remember);

    setFormData((current) => ({
      ...current,
      name: customerData?.name || current.name,
      email: customerData?.email || current.email,
      mobile: customerData?.mobile || current.mobile,
    }));
  };

  const handleRegistration = (customerData, token, remember = true) => {
    saveCustomer(customerData, token, remember);

    // A newly-created customer should continue with the LeanFit form.
    setPage("profile");
  };

  const handleLogin = (customerData, token, remember = true) => {
    saveCustomer(customerData, token, remember);

    // An existing customer should see their orders and membership.
    setPage("customer-portal");
  };
const publicPage = PATH_TO_PUBLIC_PAGE[location.pathname];

if (publicPage === "calculators") {
  return withSiteHeader(<Calculators setPage={setPage} />);
}

if (
  publicPage === "about" ||
  publicPage === "contact" ||
  publicPage === "privacy" ||
  publicPage === "terms"
) {
  return withSiteHeader(<InfoPage type={publicPage} setPage={setPage} />);
}

if (location.pathname !== "/") {
  return withSiteHeader(<NotFoundPage setPage={setPage} />);
}
  switch (page) {
    case "welcome":
      return withSiteHeader(<WelcomePage setPage={setPage} />, { showBrand: true });

    case "register":
      return withSiteHeader(
        <LoginPage
          initialMode="register"
          setPage={setPage}
          onAuthenticated={handleRegistration}
        />
      );

    case "login":
      return withSiteHeader(
        <LoginPage
          initialMode="login"
          setPage={setPage}
          onAuthenticated={handleLogin}
        />
      );

    case "forgot-password":
      return withSiteHeader(<ForgotPassword setPage={setPage} />);

    case "profile":
      return withSiteHeader(
        <ProtectedPage setPage={setPage}><BasicProfile
          formData={formData}
          setFormData={setFormData}
          setPage={setPage}
        /></ProtectedPage>
      );

    case "goal":
      return withSiteHeader(
        <GoalPage
          formData={formData}
          setFormData={setFormData}
          setPage={setPage}
        />
      );

    case "food":
      return withSiteHeader(
        <FoodPreferences
          formData={formData}
          setFormData={setFormData}
          setPage={setPage}
        />
      );

    case "habits":
      return withSiteHeader(
        <HabitsPage
          formData={formData}
          setFormData={setFormData}
          setPage={setPage}
        />
      );

    case "plans":
      return withSiteHeader(
        <PlanPage
          formData={formData}
          setFormData={setFormData}
          setPage={setPage}
        />
      );

    case "payment":
      return withSiteHeader(
        <ProtectedPage setPage={setPage}><PaymentPage
          formData={formData}
          setPage={setPage}
          setGeneratedPlan={setGeneratedPlan}
        /></ProtectedPage>
      );

    case "success":
      return withSiteHeader(
        <SuccessPage
          formData={formData}
          generatedPlan={generatedPlan}
          setPage={setPage}
        />
      );

    case "dashboard":
      return withSiteHeader(
        <ProtectedPage setPage={setPage}><Dashboard
          formData={formData}
          generatedPlan={generatedPlan}
          setPage={setPage}
        /></ProtectedPage>
      );

    case "customer-auth":
      return withSiteHeader(<CustomerAuth setPage={setPage} />);

    case "customer-portal":
      return withSiteHeader(<ProtectedPage setPage={setPage}><CustomerPortal setPage={setPage} /></ProtectedPage>);

    case "admin-login":
      return <AdminLogin setPage={setPage} />;

    case "admin":
      return <AdminDashboard setPage={setPage} />;
    case "admin-coupons":
      return <AdminCoupons setPage={setPage} />;
    case "email-templates":
      return <EmailTemplates setPage={setPage} />;
    case "profile-settings":
      return withSiteHeader(<ProtectedPage setPage={setPage}><Profile setPage={setPage} /></ProtectedPage>);
    case "settings":
      return withSiteHeader(<ProtectedPage setPage={setPage}><Settings setPage={setPage} /></ProtectedPage>);
    case "smart-coach":
      return withSiteHeader(<SmartCoach formData={formData} setPage={setPage} />);
    case "calculators":
      return withSiteHeader(<Calculators setPage={setPage} />);
    case "feedback":
      return withSiteHeader(<ProtectedPage setPage={setPage}><FeedbackPage setPage={setPage} mode="customer" /></ProtectedPage>);
    case "admin-feedback":
      return <FeedbackPage setPage={setPage} mode="admin" />;
    case "privacy":
    case "terms":
    case "contact":
    case "about":
      return withSiteHeader(<InfoPage type={page} setPage={setPage} />);
    case "not-found":
      return withSiteHeader(<NotFoundPage setPage={setPage} />);
    default:
      return withSiteHeader(<NotFoundPage setPage={setPage} />);
  }
}

export default App;
