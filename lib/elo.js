const K = 20;

const getExpectedResult = (ratingA, ratingB) => {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
};

const calculateRating = (playerA, playerB, result) => {
  return (
    playerA.rating +
    Math.round(K * (result - getExpectedResult(playerA.rating, playerB.rating)))
  );
};

/**
 * Calculates new rating and updates the player's attributes
 * @param {Player} playerA - the winning player
 * @param {Player} playerB - the losing player
 * @returns
 */
export const getUpdatedRatings = (playerA, playerB) => {
  const playerARating = calculateRating(playerA, playerB, 1);
  const playerBRating = calculateRating(playerB, playerA, 0);

  return {
    playerA: playerARating,
    playerB: playerBRating,
  };
};
