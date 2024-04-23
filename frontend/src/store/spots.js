const GET_SPOTS = "GET_SPOTS";
const GET_SPOT_BY_ID = "GET_SPOT_BY_ID";
const GET_REVIEWS_BY_SPOT_ID = "GET_REVIEWS_BY_SPOT_ID";

export const getSpots = (spots) => ({
  type: GET_SPOTS,
  payload: spots,
});

export const getSpotById = (spot) => ({
  type: GET_SPOT_BY_ID,
  payload: spot,
});

export const getReviewsBySpotId = (reviews) => ({
  type: GET_REVIEWS_BY_SPOT_ID,
  payload: reviews,
});

export const fetchReviews = (spotId) => async (dispatch) => {
  const res = await fetch(`/api/spots/${spotId}/reviews`);
  const data = await res.json();
  dispatch(getReviewsBySpotId(data));
};

export const fetchSpots = (spotId) => async (dispatch) => {
  if (!spotId) {
    const res = await fetch("/api/spots");
    const spots = await res.json();
    dispatch(getSpots(spots));
  } else {
    const res = await fetch(`/api/spots/${spotId}`);
    const spot = await res.json();
    dispatch(getSpotById(spot));
  }
};

const spotsReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_SPOTS: {
      const newState = { ...state };
      action.payload.Spots.forEach((spot) => {
        newState[spot.id] = spot;
      });
      return newState;
    }
    case GET_SPOT_BY_ID: {
      const newState = { ...state };
      newState.spotId = action.payload;
      return newState;
    }
    case GET_REVIEWS_BY_SPOT_ID:
      return { ...state, reviews: action.payload.Reviews };
    default:
      return state;
  }
};

export default spotsReducer;
