import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const Public = (props) => {
  const isLoggedIn = false;
  return isLoggedIn ? <Navigate to="/" replace /> : <>{props.children}</>;
};

Public.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};
export default Public;
