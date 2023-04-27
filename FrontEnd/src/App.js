import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomeComponent from "./Component/Home/HomeComponent";
import RegistrationComponent from "./Component/RegistrationComponent";
import ApplyLeave from "./Component/Leave/Applyleave";
import EditProfileComponent from "./Component/ProfileComponent/EditProfileComponent";
import AllApplyleavelist from "./Component/Leave/AllApplyleavelist";

import PerformanceComponent from "./Component/Performance/PerformanceComponent";
import PaySlipComponent from "./Component/PaySlip/PaySlipComponent";
import HeaderComponent from "./Component/Layout/HeaderComponent";
import SideBarComponent from "./Component/Layout/SideBarComponent";
import DashboardComponent from "./Component/Dashboard/DashboardComponent";
import UploadComponent from "./Component/UploadComponent";
import LoginComponent from "./Component/LogIn/LogInComponent";
import ChangePasswordComponent from "./Component/LogIn/ChangePasswordComponent";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeComponent />} />
        <Route path="/ChangePassword" element={<ChangePasswordComponent />} />
        <Route path="/Payslip" element={<PaySlipComponent />} />
        <Route path="/LogIn" element={<LoginComponent />} />
      </Routes>
      <div className="d-flex flex-column flex-lg-row h-lg-full bg-surface-secondary">
        <SideBarComponent />
        <Routes>
          <Route path="/" element={<DashboardComponent />} />
          <Route path="/AllApplyleavelist" element={<AllApplyleavelist />} />
          <Route path="/register" element={<RegistrationComponent />} />
          <Route path="/Dashboard" element={<DashboardComponent />} />
          <Route path="/applyleave" element={<ApplyLeave />} />
          <Route path="/Performance" element={<PerformanceComponent />} />
          <Route path="/editProfile" element={<EditProfileComponent />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
