import React from "react";
import { Container } from "react-pixi-fiber";
import RailTransition from "../RailTransition/RailTransition";
import Rail from "../Rail/Rail";
import SwitchCursor from "../SwitchCursor/SwitchCursor";
import SwitchPath from "../SwitchPath/SwitchPath";

const RailwayYard = ({ rails, switchCursor, switchPath }) => {

  return (
    <Container
      x={0} y={0}
    >
      <RailTransition />
      {rails && rails.map((railsColumn, x) => (
        Object.entries(railsColumn).map(([y, railPiece]) => (
          <Rail key={`${x}:${y}`} x={x} y={y} railPiece={railPiece} />
        ))
      )).flat(1)}
      {switchCursor.x !== undefined && switchCursor.y !== undefined && (
        <SwitchCursor x={switchCursor.x} y={switchCursor.y} />
      )}
      {switchPath && (
        <SwitchPath path={switchPath} />
      )}
    </Container>
  );
};

export default RailwayYard;
