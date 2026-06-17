import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Knowledge from "@/pages/Knowledge";
import KnowledgeDetail from "@/pages/KnowledgeDetail";
import Equipment from "@/pages/Equipment";
import EquipmentDetail from "@/pages/EquipmentDetail";
import EquipmentCompare from "@/pages/EquipmentCompare";
import Checklist from "@/pages/Checklist";
import Community from "@/pages/Community";
import CommunityDetail from "@/pages/CommunityDetail";
import Simulator from "@/pages/Simulator";
import Exchange from "@/pages/Exchange";
import ExchangeDetail from "@/pages/ExchangeDetail";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ChangePassword from "@/pages/ChangePassword";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 独立页面（不使用Layout） */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* 使用Layout的页面 */}
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/knowledge" element={<Knowledge />} />
                <Route path="/knowledge/:id" element={<KnowledgeDetail />} />
                <Route path="/equipment" element={<Equipment />} />
                <Route path="/equipment/compare" element={<EquipmentCompare />} />
                <Route path="/equipment/:id" element={<EquipmentDetail />} />
                <Route path="/checklist" element={<Checklist />} />
                <Route path="/community" element={<Community />} />
                <Route path="/community/:id" element={<CommunityDetail />} />
                <Route path="/simulator" element={<Simulator />} />
                <Route path="/exchange" element={<Exchange />} />
                <Route path="/exchange/:id" element={<ExchangeDetail />} />
                <Route path="/change-password" element={<ChangePassword />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}
