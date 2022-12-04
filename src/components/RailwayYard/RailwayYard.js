import React from "react";
import { Container } from "react-pixi-fiber";
import Rail from "../Rail/Rail";
import SwitchCursor from "../SwitchCursor/SwitchCursor";

const RailwayYard = ({ rails, cursor }) => {

  return (
    <Container
      x={0} y={0}
    >
      {rails && rails.map((railsColumn, x) => (
        Object.entries(railsColumn).map(([y, railPiece]) => (
          <Rail key={`${x}:${y}`} x={x} y={y} railPiece={railPiece} />
        ))
      )).flat(1)}
      {cursor.x !== undefined && cursor.y !== undefined && (
        <SwitchCursor x={cursor.x} y={cursor.y} />
      )}
    </Container>
  );
};

export default RailwayYard;
