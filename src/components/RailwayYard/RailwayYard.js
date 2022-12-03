import React from "react";
import { Container } from "react-pixi-fiber";
import Rail from "../Rail/Rail";

const RailwayYard = ({ rails }) => {

  return (
    <Container
      x={0} y={0}
    >
      {rails && rails.map((railsColumn, x) => (
        Object.entries(railsColumn).map(([y, railPiece]) => (
          <Rail key={`${x}:${y}`} x={x} y={y} railPiece={railPiece} />
        ))
      )).flat(1)}
    </Container>
  );
};

export default RailwayYard;
