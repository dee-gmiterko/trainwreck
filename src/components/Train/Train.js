import React from "react";
import { Container } from "react-pixi-fiber";
import Cart from "../Cart/Cart";
import * as config from "../../config";

const Train = ({ train }) => {

  return (
    <Container x={config.PIECE_WIDTH2} y={config.PIECE_HEIGHT2}>
      {train.carts.map((cart, index) => (
        <Cart key={index} train={train} cart={cart} />
      ))}
    </Container>
  );
};

export default Train;
