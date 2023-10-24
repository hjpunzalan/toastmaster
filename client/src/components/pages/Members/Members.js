import { faker } from "@faker-js/faker";
import React, { useMemo } from "react";
import { FaUserPlus, FaUserTimes } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export const Members = ({
  user,
  Moderator,
  active,
  deActivateUser,
  activateUser,
  currentUser,
  changeRole,
}) => {
  const fakePhoto = useMemo(() => faker.image.avatar(), []);

  let photo = user.photo || fakePhoto;

  if (user._id === currentUser._id) {
    photo = currentUser.photo;
  }

  return (
    <tr key={user._id} className="MemberList__member">
      <td>
        <img
          className="MemberList__member-photo"
          src={photo}
          alt="user avatar"
        />
      </td>
      <td>
        <span className="MemberList__member-name">{user.firstName}</span>
      </td>
      <td>
        <span className="MemberList__member-name">{user.lastName}</span>
      </td>
      {(Moderator || active) && (
        <td>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <a
              href={`mailto:${user.email}`}
              target="_top"
              className="MemberList__member-email"
            >
              <MdEmail />
            </a>
            {user.email}
          </span>
        </td>
      )}
      {Moderator && currentUser.role === "admin" && active && (
        <td>
          <select
            defaultValue={user.role === "committee" || user.role === "admin"}
            onChange={(e) => changeRole(user._id, e.target.value)}
          >
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </td>
      )}
      {Moderator &&
        (active ? (
          <td>
            <button
              className="btn btn__delete-xs"
              onClick={() => deActivateUser(user._id)}
            >
              <FaUserTimes className="MemberList__deactivate" />
            </button>
          </td>
        ) : (
          <td>
            <button className="btn btn__activate-xs">
              <FaUserPlus
                className="MemberList__activate"
                onClick={() => activateUser(user._id)}
              />
            </button>
          </td>
        ))}
    </tr>
  );
};

export default Members;
