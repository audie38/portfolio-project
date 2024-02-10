import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const Private = (props) => {
  const isLoggedIn = false;
  return isLoggedIn ? <>{props.children}</> : <Navigate to="/login" replace />;
};

Private.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default Private;
