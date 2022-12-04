import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectLeaderboard, fillLeaderboard } from "../../game/leaderboardSlice";
import { utils } from 'pixi.js';

const Leaderboard = ({ size, score }) => {
  const dispatch = useDispatch();
  const leaderboard = useSelector(state => selectLeaderboard(state, size || 10, score));

  useEffect(() => {
    if(leaderboard.length <= 3) {
      dispatch(fillLeaderboard());
    }
  }, [leaderboard.length])

  return (
    <table className="leaderboard">
      <thead>
        <tr>
          <th>#</th>
          <th>User</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {leaderboard.map((attempt, index) => (
          <tr key={index} className={attempt.higlighted ? "higlighted" : ""}>
            <td>{attempt.order}</td>
            <td>{attempt.user}</td>
            <td>{attempt.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
};

export default Leaderboard;
