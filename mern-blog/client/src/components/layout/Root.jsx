import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Root = () => {
  return (
    <Fragment>
      <Navbar />
      <div className="container my-5">
        <Outlet />
      </div>
    </Fragment>
  );
};

export default Root;
