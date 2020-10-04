import React, { useState, useEffect, useRef } from "react";
import cn from "classnames";

import "../UsersList.scss";
import { Avatar, Row, Col } from "antd";
import SubscribeStar from "../SubscribeStar";
import shoeVideo from "../../../assets/video/shoe.mp4";

const getPicture = (file) => {
  const path = require(`../../../assets/images/${file}.svg`);
  return path.default;
};

const UserPreviewCard = (props) => {
  const {
    user,
    type,
    isFavorite,
    handleAddFavorite,
    handleDeleteFavorite,
  } = props;
  const [userActive, setUserActive] = useState(false);
  const [isInMiddle, setIsInMiddle] = useState(false);
  const ref = useRef();

  const isInViewport = (elem) => {
    const bounding = elem ? elem.getBoundingClientRect() : "";
    const windowHeight = window.innerHeight;
    let isInCenter = false;

    if (
      bounding.bottom < windowHeight * 0.6 &&
      bounding.top >= windowHeight * 0.4
    ) {
      isInCenter = true;
    }
    return isInCenter;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsInMiddle(isInViewport(ref.current));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isInMiddle]);

  useEffect(() => {
    if (isInMiddle && ref.current) {
      ref.current.play();
    }
    if (!isInMiddle && ref.current) {
      ref.current.pause();
    }
    if (isFavorite) {
      setUserActive(isFavorite);
    }
  }, [isFavorite, isInMiddle]);

  const handleStarActive = () => {
    setUserActive(!userActive); // toggle classes on star icon
    if (userActive) {
      handleDeleteFavorite(); // add to favorite
    } else {
      handleAddFavorite(); // delete from favorite
    }
  };

  return (
    <div
      className={cn({
        "user-card": type === "default",
        "user-card preview": type === "preview",
      })}
    >
      <div className="user-info">
        <Row style={{ justifyContent: "space-between" }}>
          <Avatar size={25} src={getPicture(user.image)} />
          <span>{user.name}</span>
          <SubscribeStar
            class={cn({
              "favorite-icon": !userActive,
              "favorite-icon active": userActive,
            })}
            handleClick={handleStarActive}
          />
        </Row>
        <Row style={{ flexFlow: "column" }}>
          <p>{user.age} лет</p>
          <p>{user.phone}</p>
          <p>{user.phrase}</p>
        </Row>
      </div>
      {type === "preview" && (
        <div className="user-video_wrapper">
          {" "}
          <p>VIdeo</p>
          <p>is in VIEWPORT === {isInMiddle.toString()}</p>
          <p>{user.video}</p>
          <video
            ref={ref}
            className="background-video"
            loop
            autoPlay={false}
            muted
          >
            <source src={shoeVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default UserPreviewCard;
