import { createSlice, createSelector } from '@reduxjs/toolkit';
import { randomName } from "../utils";

export const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    user: randomName(),
    attempts: [],
  },
  reducers: {
    addScore: (state, action) => {
      const { score, user } = action.payload;
      state.attempts.push({
        score: score,
        user: user || state.user,
      });
      state.attempts.sort((a, b) => (
        b.score - a.score
      ));
    },
    fillLeaderboard: (state, action) => {
      const r6 = (pow) => (
        Math.pow(
          (Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random())/6,
          pow
        )
      )
      // high
      for(let i=0; i<150; i++) {
        state.attempts.push({
          score: Math.floor(
            r6(5) * 4096 + r6(4) * 1024 + r6(3) * 256 + r6(2) * 64 + r6(1) * 16 + r6(2) * 4 + r6(1)
          ),
          user: randomName(),
        });
      }
      // low
      for(let i=0; i<100; i++) {
        state.attempts.push({
          score: Math.floor(
            r6(4) * 64 + r6(3) * 16 + r6(2) * 4 + r6(1) * 1
          ),
          user: randomName(),
        });
      }
      state.attempts.sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        } else {
          return (b.user == state.user) - (a.user == state.user);
        }
      });
    }
  },
})

export const {
  addScore,
  fillLeaderboard,
} = leaderboardSlice.actions;

export const selectAttempts = (state) => state.leaderboard.attempts;
export const selectLeaderboard = (state, size, aroundScore) => {
  const attempts = selectAttempts(state);

  const myIndex = attempts.findIndex(a => a.score <= aroundScore);
  if (aroundScore) {
    if (myIndex-2 > 3) {
      return [
        ...attempts.slice(0, 3).map((a, i) => (
          {...a, order: 1+i}
        )),
        {user: "..."},
        ...attempts.slice(myIndex-2, myIndex-2+size-4).map((a, i) => (
          {...a, order: myIndex-1+i, higlighted: myIndex === myIndex-2+i}
        )),
      ]
    }
  }
  return attempts.slice(0, size).map((a, i) => (
    {...a, order: 1+i, higlighted: myIndex === i}
  ));
};

export default leaderboardSlice.reducer;
