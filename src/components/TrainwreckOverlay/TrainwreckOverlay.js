import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCartsCount, selectScore, selectSpeed, selectCrashed, selectGuideVisibility } from "../../game/trainsSlice";
import { utils } from 'pixi.js';

const TrainwreckOverlay = () => {
  const carts = useSelector(selectCartsCount);
  const score = useSelector(selectScore);
  const speed = useSelector(selectSpeed);
  const crashed = useSelector(selectCrashed);
  const guideVisibility = useSelector(selectGuideVisibility);

  return (
    <div className="overlay">
      <div className="v-top h-right">,
        <div className="stats">
          <span className="carts"><i>[c]</i> {carts}</span>
          <>&nbsp;</>
          <span className="score"><i>[s]</i> {score} km</span>
        </div>
        <div>
          <span className="speed">{Math.round(speed)} km/s</span>
        </div>
      </div>
      {crashed && (
        <div className="v-center h-center">
          <span className="title">Crashed</span>
          <span className="hint">Press space to continue</span>
        </div>
      )}
      <div className="v-bottom h-center">
        <span className="hint" style={{opacity: guideVisibility}}>
          hold ◀ and ▶ to control train speed, ▲ and ▼ for railroad switches
        </span>
      </div>
    </div>
  )
};

export default TrainwreckOverlay;
