import { useState } from "react";
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
import { saveSession } from "./utils/auth";

function App() {
  const [page, setPage] = useState("welcome");
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

  switch (page) {
    case "welcome":
      return <WelcomePage setPage={setPage} />;

    case "register":
      return (
        <LoginPage
          initialMode="register"
          setPage={setPage}
          onAuthenticated={handleRegistration}
        />
      );

    case "login":
      return (
        <LoginPage
          initialMode="login"
          setPage={setPage}
          onAuthenticated={handleLogin}
        />
      );

    case "forgot-password":
      return <ForgotPassword setPage={setPage} />;

    case "profile":
      return (
        <ProtectedPage setPage={setPage}><BasicProfile
          formData={formData}
          setFormData={setFormData}
          setPage={setPage}
        /></ProtectedPage>
      );

    case "goal":
      return (
        <GoalPage
          formData={formData}
          setFormData={setFormData}
          setPage={setPage}
        />
      );

    case "food":
      return (
        <FoodPreferences
          formData={formData}
          setFormData={setFormData}
          setPage={setPage}
        />
      );

    case "habits":
      return (
        <HabitsPage
          formData={formData}
          setFormData={setFormData}
          setPage={setPage}
        />
      );

    case "plans":
      return (
        <PlanPage
          formData={formData}
          setFormData={setFormData}
          setPage={setPage}
        />
      );

    case "payment":
      return (
        <ProtectedPage setPage={setPage}><PaymentPage
          formData={formData}
          setPage={setPage}
          setGeneratedPlan={setGeneratedPlan}
        /></ProtectedPage>
      );

    case "success":
      return (
        <SuccessPage
          formData={formData}
          generatedPlan={generatedPlan}
          setPage={setPage}
        />
      );

    case "dashboard":
      return (
        <ProtectedPage setPage={setPage}><Dashboard
          formData={formData}
          generatedPlan={generatedPlan}
          setPage={setPage}
        /></ProtectedPage>
      );

    case "customer-auth":
      return <CustomerAuth setPage={setPage} />;

    case "customer-portal":
      return <ProtectedPage setPage={setPage}><CustomerPortal setPage={setPage} /></ProtectedPage>;

    case "admin-login":
      return <AdminLogin setPage={setPage} />;

    case "admin":
      return <AdminDashboard setPage={setPage} />;
    case "email-templates":
      return <EmailTemplates setPage={setPage} />;
    case "profile-settings":
      return <ProtectedPage setPage={setPage}><Profile setPage={setPage} /></ProtectedPage>;
    case "settings":
      return <ProtectedPage setPage={setPage}><Settings setPage={setPage} /></ProtectedPage>;
    case "smart-coach":
      return <SmartCoach formData={formData} setPage={setPage} />;
    case "calculators":
      return <Calculators setPage={setPage} />;
    case "feedback":
      return <ProtectedPage setPage={setPage}><FeedbackPage setPage={setPage} mode="customer" /></ProtectedPage>;
    case "admin-feedback":
      return <FeedbackPage setPage={setPage} mode="admin" />;
    case "privacy":
    case "terms":
    case "contact":
    case "about":
      return <InfoPage type={page} setPage={setPage} />;
    case "not-found":
      return <NotFoundPage setPage={setPage} />;
    default:
      return <NotFoundPage setPage={setPage} />;
  }
}

export default App;
