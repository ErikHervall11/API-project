import { csrfFetch } from "./csrf";

const GET_SPOTS = "GET_SPOTS";
const GET_SPOT_BY_ID = "GET_SPOT_BY_ID";
const GET_REVIEWS_BY_SPOT_ID = "GET_REVIEWS_BY_SPOT_ID";
const CREATE_NEW_SPOT = "CREATE_NEW_SPOT";

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

export const createNewSpot = (spot) => ({
  type: CREATE_NEW_SPOT,
  payload: spot,
});

export const fetchNewSpot = (spot) => async (dispatch) => {
  const res = await csrfFetch("/api/spots", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(spot),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(createNewSpot(data));
  } else {
    const error = await res.json();
    console.error("Failed to create new spot:", error);
  }
};

export const fetchReviews = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
  const data = await res.json();
  dispatch(getReviewsBySpotId(data));
};

export const fetchSpots = () => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/spots");
    const spots = await res.json();
    dispatch(getSpots(spots));
  } catch (error) {
    console.error("Fetching spots failed:", error);
  }
};

export const fetchSpotById = (spotId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spotId}`);
    if (!res.ok) throw new Error("Failed to fetch the spot data.");
    const spot = await res.json();
    dispatch(getSpotById(spot));
  } catch (error) {
    console.error("Fetching spot by ID failed:", error);
  }
};

const spotsReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_SPOTS: {
      const newState = {};
      action.payload.Spots.forEach((spot) => {
        newState[spot.id] = spot;
      });
      return newState;
    }
    case GET_SPOT_BY_ID: {
      const newState = { ...state };
      const spot = action.payload;
      newState.spotId = spot;
      return newState;
    }

    case GET_REVIEWS_BY_SPOT_ID:
      return { ...state, reviews: action.payload.Reviews };

    case CREATE_NEW_SPOT:
      return {
        ...state,
        spots: [state.spots, action.payload],
      };

    default:
      return state;
  }
};

export default spotsReducer;
