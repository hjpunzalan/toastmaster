import { faker } from "@faker-js/faker";
import "moment-timezone";
import React, { useMemo } from "react";
import Moment from "react-moment";
import ReadOnly from "../../utils/draft-js/ReadOnly";

const PostHead = ({
  post,
  currentUser,
  toggleEditPost,
  handleDeletePost,
  Moderator,
}) => {
  const fakePhoto = useMemo(() => faker.image.avatar(), []);
  let userNameLength = post.user.firstName.length + post.user.lastName.length;
  let convertedName =
    post.user.firstName + " " + post.user.lastName[0].toUpperCase();
  if (userNameLength > 20) {
    convertedName =
      post.user.firstName[0].toUpperCase() +
      post.user.lastName[0].toUpperCase();
  }

  let photo = post.user.photo || fakePhoto;

  if (post.user._id === currentUser._id) {
    photo = currentUser.photo;
  }

  return (
    <div className="Post__post">
      <div className="Post__postUser">
        <img src={photo} alt="user-logo" className="Post__postUser-img" />
        <span className="Post__postUser-name">
          {userNameLength > 12 && window.screen.width > 1000 ? (
            <span>{convertedName}</span>
          ) : (
            <>
              <span>{post.user.firstName}&nbsp;</span>
              <span>{post.user.lastName}</span>
            </>
          )}
        </span>
      </div>
      <div className="Post__postBody">
        <div className="Post__postBody-text">
          <ReadOnly contentState={post.contentState} />
        </div>
        <>
          <span className="Post__postBody-date">
            Posted:
            <Moment tz="Australia/Perth" format="ddd MMM DD YYYY HH:mm">
              {post.date}
            </Moment>
          </span>
          {post.lastEdited !== post.date && (
            <span className="Post__postBody-edited">
              Last edited:
              <Moment tz="Australia/Perth" format="ddd MMM DD YYYY HH:mm">
                {post.lastEdited}
              </Moment>
            </span>
          )}
          <div className="Post__postButtons">
            {currentUser._id === post.user._id && (
              <button className="btn btn__edit-xs" onClick={toggleEditPost}>
                Edit
              </button>
            )}
            {(currentUser._id === post.user._id ||
              (Moderator && currentUser.role === "admin")) && (
              <button className="btn btn__delete-xs" onClick={handleDeletePost}>
                Delete
              </button>
            )}
          </div>
        </>
      </div>
    </div>
  );
};

export default PostHead;
