import React from "react";
import Leaderboard from "../Leaderboard/Leaderboard";
import { navigate } from "gatsby";
import { useSelector } from "react-redux";
import { selectLevel } from "../../game/railwayYardSlice";
import { selectCartsCount, selectScore, selectSpeed, selectCrashed, selectGuideVisibility } from "../../game/trainsSlice";

import imgCart from "../../images/1f683.svg";
import imgCoint from "../../images/1fa99.svg";

const TrainwreckOverlay = () => {
  const level = useSelector(selectLevel);
  const carts = useSelector(selectCartsCount);
  const score = useSelector(selectScore);
  const speed = useSelector(selectSpeed);
  const crashed = useSelector(selectCrashed);
  const guideVisibility = useSelector(selectGuideVisibility);

  return (
    <div className="overlay">
      <div className="v-top h-right">
        <div className="stats">
          <i>
            <img src={imgCart} alt="Carts" />
          </i>
          <span className="carts">{carts}</span>
          <i>
            <img src={imgCoint} alt="Score" />
          </i>
          <span className="score">{score}</span>
        </div>
        <div className="stats">
          <span className="speed">{Math.round(speed*100)/100}<abbr> km/s</abbr></span>
        </div>
      </div>
      {crashed ? (
        <div className="v-center h-center">
          <span className="title">Crashed</span>
          <Leaderboard size={10} score={score} />
          <span className="hint">Press space to continue</span>
        </div>
      ) : (
        (level) && (
          <div key={level} className="v-center h-center animate-level">
            <span className="title">Level {level}</span>
          </div>
        )
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
