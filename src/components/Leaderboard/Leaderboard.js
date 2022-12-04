import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectLeaderboard } from "../../game/leaderboardSlice";

const Leaderboard = ({ size, score }) => {
  const leaderboard = useSelector(state => selectLeaderboard(state, size || 10, score));

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
