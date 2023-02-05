import React from "react";
import { ToastContainer } from "react-toastify";
import SiteMetadata from "../SiteMetadata/SiteMetadata";

const Layout = ({ title, siteMetadata, children }) => {
  return (
    <>
      <SiteMetadata siteMetadata={siteMetadata} title={title} />
      <div className="page-root">
        
        {children}

        <ToastContainer theme="dark" />
      </div>
    </>
  );
};

export default Layout;
