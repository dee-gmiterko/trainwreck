import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectLeaderboard, initLeaderboard } from "../../game/leaderboardSlice";

const Leaderboard = ({ size, score }) => {
  const dispatch = useDispatch();
  const leaderboard = useSelector(state => selectLeaderboard(state, size || 10, score));

  useEffect(() => {
    dispatch(initLeaderboard());
  }, [dispatch])

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
