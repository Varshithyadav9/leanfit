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

  const saveCustomer = (customerData, token) => {
    localStorage.setItem("leanfitToken", token);
    localStorage.setItem("leanfitCustomer", JSON.stringify(customerData));

    setFormData((current) => ({
      ...current,
      name: customerData?.name || current.name,
      email: customerData?.email || current.email,
      mobile: customerData?.mobile || current.mobile,
    }));
  };

  const handleRegistration = (customerData, token) => {
    saveCustomer(customerData, token);

    // A newly-created customer should continue with the LeanFit form.
    setPage("profile");
  };

  const handleLogin = (customerData, token) => {
    saveCustomer(customerData, token);

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

    case "profile":
      return (
        <BasicProfile
          formData={formData}
          setFormData={setFormData}
          setPage={setPage}
        />
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
        <PaymentPage
          formData={formData}
          setPage={setPage}
          setGeneratedPlan={setGeneratedPlan}
        />
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
        <Dashboard
          formData={formData}
          generatedPlan={generatedPlan}
          setPage={setPage}
        />
      );

    case "customer-auth":
      return <CustomerAuth setPage={setPage} />;

    case "customer-portal":
      return <CustomerPortal setPage={setPage} />;

    case "admin-login":
      return <AdminLogin setPage={setPage} />;

    case "admin":
      return <AdminDashboard setPage={setPage} />;

    default:
      return <WelcomePage setPage={setPage} />;
  }
}

export default App;
