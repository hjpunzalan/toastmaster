import React from "react";
import { FaKey, FaUserAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export const User = ({ currentUser, isModified }) => {
  return (
    <div className="Dashboard__right">
      <img
        className="Dashboard__user-photo"
        src={currentUser?.photo}
        alt="user avatar"
      />

      <div className="Dashboard__user-details">
        <p className="Dashboard__user-name">
          Hi <strong>{currentUser.firstName}</strong>
        </p>
        <div className="Dashboard__links">
          <Link to="/user/update" className="Dashboard__links-link">
            <FaUserAlt /> <span>Update Profile</span>
          </Link>
          <Link to="/user/changepassword" className="Dashboard__links-link">
            <FaKey /> <span>Change Password</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default User;
