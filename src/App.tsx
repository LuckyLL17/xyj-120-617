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

export default function App() {
  return (
    <Router>
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
        </Routes>
      </Layout>
    </Router>
  );
}
