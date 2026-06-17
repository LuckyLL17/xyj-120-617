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
import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

/** 需要登录才能访问的路由守卫组件 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const { initialize } = useAuthStore();

  /* 应用启动时从 localStorage 恢复登录状态 */
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <Layout>
        <Routes>
          {/* 公开路由 */}
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

          {/* 认证路由 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 需要登录才能访问的路由 */}
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}
