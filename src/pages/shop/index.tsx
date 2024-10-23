/** @format */

import { Carousel } from "antd";
import React, { useState } from "react";

const ShopPage = () => {
  const [promotions, setPromotions] = useState([
    {
      title: "Static Random Image",
      description: "Get the same random image every time ",
      imageUrl:
        "https://media.istockphoto.com/id/184103864/vi/anh/nh%E1%BB%AFng-%C4%91%C3%A1m-m%C3%A2y-tr%C3%AAn-b%E1%BA%A7u-tr%E1%BB%9Di.jpg?s=1024x1024&w=is&k=20&c=DuL0CH49Zb02GAHMPxOlGMfNHv4gyDXVD__H3x8WX8E=",
    },
    {
      title: "Get a grayscale image by appending",
      description: "Get the same random image every time ",
      imageUrl:
        "https://plus.unsplash.com/premium_photo-1675805015392-28fd80c551ec?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ]);
  return (
    <>
      <div>ShopPage</div>
      <Carousel>
        {promotions.map((promotion, index) => (
          <div key={index}>
            <div
              style={{
                backgroundImage: `url(${promotion.imageUrl})`,
                width: "100%",
                height: "300px",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div>
                <h3>{promotion.title}</h3>
                <p>{promotion.description}</p>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </>
  );
};

export default ShopPage;
