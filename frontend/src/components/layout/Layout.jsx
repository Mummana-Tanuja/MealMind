import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const layoutStyle = {
  display: "flex",
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top left, rgba(121, 191, 122, 0.24), transparent 32rem), linear-gradient(135deg, var(--color-page) 0%, var(--color-page-warm) 52%, #eef8ff 100%)"
};
const contentStyle = {
  flex: 1,
  padding: "28px",
  display: "flex",
  flexDirection: "column",
  gap: "24px"
};

function Layout({ children, pageTitle }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const mainStyle = {
    marginLeft: sidebarOpen ? "240px" : "0",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    transition: "margin-left 0.25s ease"
  };

  return (
    <div style={layoutStyle}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={mainStyle}>
        <Navbar onMenuClick={() => setSidebarOpen((open) => !open)} pageTitle={pageTitle} />
        <main style={contentStyle}>{children}</main>
      </div>
    </div>
  );
}

export default Layout;
