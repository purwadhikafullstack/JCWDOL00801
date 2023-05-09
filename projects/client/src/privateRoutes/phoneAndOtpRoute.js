import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const VerifyChecker = (props) => {
  const { isVerified, phone, role } = useSelector((state) => {
    return {
      isVerified: state.userReducer.isVerified,
      phone: state.userReducer.phone,
      role: state.userReducer.role,
    };
  });
  const currentPath = window.location.pathname;
  const getLocalStorage = localStorage.getItem("renthaven1");
  if (props.loading == false) {
    if (getLocalStorage) {
      if ((isVerified == false || phone == "-") && currentPath != "/verify") {
        return <Navigate to="/verify" />;
      } else if (isVerified == true && phone != "-" && currentPath == "/verify") {
        if (role == "tenant") {
          return <Navigate to="/tenant-dashboard" />;
        }
        return <Navigate to="/" />;
      } else if (currentPath == "/signin" || currentPath == "/signup") {
        if (role == "tenant") {
          return <Navigate to="/tenant-dashboard" />;
        }
        return <Navigate to="/" />;
      } else if (role != "tenant" && currentPath == "/tenant-dashboard") {
        return <Navigate to="/" />;
      }
      if (role == "tenant" && currentPath == "/") {
        return <Navigate to="/tenant-dashboard" />;
      } else if (role !== "tenant" && currentPath === "/property") {
        return <Navigate to="" />;
      } else if (role !== "tenant" && currentPath === "/property/new") {
        return <Navigate to="" />;
      } else if (role !== "tenant" && currentPath === "/property/new/building") {
        return <Navigate to="" />;
      } else if (role !== "tenant" && currentPath === "/property/new/building-room") {
        return <Navigate to="" />;
      } else if (role !== "tenant" && currentPath === "/property/edit") {
        return <Navigate to="" />;
      } 

      return props.children;
    } else if (
      currentPath == "/profile" ||
      currentPath == "/verify" ||
      currentPath == "/tenant-dashboard" || currentPath == "/my-orders"
    ) {
      return <Navigate to="/" />;
    } else {
      return props.children;
    }
  }
};

export default VerifyChecker;
