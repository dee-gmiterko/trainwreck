import React, { useState, useEffect, useRef } from "react";
import Leaderboard from "../Leaderboard/Leaderboard";
import { navigate } from "gatsby";
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
      <div className="v-top h-right">
        <div className="stats">
          <i>🚃</i>
          <span className="carts">{carts}</span>
          <i>🪙</i>
          <span className="score">{score}<abbr> km</abbr></span>
        </div>
        <div className="stats">
          <span className="speed">{Math.round(speed)}<abbr> km/s</abbr></span>
        </div>
      </div>
      {crashed && (
        <div className="v-center h-center">
          <span className="title">Crashed</span>
          <Leaderboard size={10} score={score} />
          <span className="hint">Press space to continue</span>
        </div>
      )}
      <div className="v-bottom h-center">
        <span className="hint" style={{opacity: guideVisibility}}>
          hold ◀ and ▶ to control train speed, ▲ and ▼ for railroad switches
        </span>
      </div>
      <div className="v-bottom h-right">
        <button onClick={() => navigate("/leaderboard")}>Leaderboard</button>
      </div>
    </div>
  )
};

export default TrainwreckOverlay;
