import React from "react";
import { ToastContainer } from "react-toastify";

const Layout = ({ title, siteMetadata, children }) => {
  return (
    <div className="page-root">

      {children}

      <ToastContainer theme="dark" />
    </div>
  );
};

export default Layout;
