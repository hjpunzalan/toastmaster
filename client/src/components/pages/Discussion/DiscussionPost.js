import { faker } from "@faker-js/faker";
import "moment-timezone";
import React, { useMemo } from "react";
import { IoIosChatboxes } from "react-icons/io";
import Moment from "react-moment";
import { Link } from "react-router-dom";

export const DiscussionPost = ({
  user,
  count,
  id,
  title,
  date,
  text,
  firstName,
  lastName,
  currentUser,
}) => {
  const fakePhoto = useMemo(() => faker.image.avatar(), []);
  let photo = user.photo || fakePhoto;
  if (user._id === currentUser._id) {
    photo = currentUser.photo;
  }
  return (
    <Link to={`/discussion/post/${id}`} className="Discussion__post">
      <div className="Discussion__postUser">
        <img
          src={photo || fakePhoto}
          alt="user-logo"
          className="Discussion__postUser-img"
        />
        <span className="Discussion__postUser-name">
          <span>{firstName}&nbsp;</span>
          {(firstName.length <= 10 || lastName.length <= 10) && (
            <span>{lastName}</span>
          )}
        </span>
      </div>
      <div className="Discussion__postBody">
        <div className="Discussion__postBody-header">
          <h3 className="Discussion__postBody-title"> {title}</h3>
          <span className="Discussion__postBody-chat">
            {count > 0 && (
              <>
                {count} <IoIosChatboxes />
              </>
            )}
          </span>
        </div>
        <p className="Discussion__postBody-text">{text}</p>
        <span className="Discussion__postBody-date">
          <Moment tz="Australia/Perth" format="DD MMM YYYY">
            {date}
          </Moment>
        </span>
      </div>
    </Link>
  );
};

export default DiscussionPost;
