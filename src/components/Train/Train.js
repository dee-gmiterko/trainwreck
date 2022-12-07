import React from "react";
import { Container } from "react-pixi-fiber";
import Cart from "../Cart/Cart";
import * as config from "../../config";
import { useSelector } from "react-redux";
import { selectGameSize, selectCamera } from "../../game/gameSlice";

const Train = ({ train }) => {
  const { width } = useSelector(selectGameSize);
  const { zoom } = useSelector(selectCamera);

  const transitionOffset = -1 * Math.min(0, (train.carts[0].x + ( (width/zoom)/2 ) + (config.CAMERA_CENTER_PERC * width / zoom)));

  return (
    <Container x={transitionOffset + config.PIECE_WIDTH2} y={config.PIECE_HEIGHT2}>
      {train.carts.map((cart, index) => (
        <Cart key={index} train={train} cart={cart} />
      ))}
    </Container>
  );
};

export default Train;
