import { csrfFetch } from "./csrf";

const GET_SPOTS = "GET_SPOTS";
const GET_SPOT_BY_ID = "GET_SPOT_BY_ID";
const GET_REVIEWS_BY_SPOT_ID = "GET_REVIEWS_BY_SPOT_ID";
const GET_USER_SPOTS = "GET_USER_SPOTS";

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

export const getUserSpots = (spots) => ({
  type: GET_USER_SPOTS,
  payload: spots,
});

export const deleteSpot = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      dispatch(fetchUserSpots());
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error deleting spot:", error);
  }
};

export const fetchUserSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots/current");
  const spots = await response.json();
  dispatch(getUserSpots(spots));
};

export const fetchNewSpot = (spot, spotId) => async (dispatch) => {
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(spot),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(fetchSpots(spotId));
    return data;
  } else {
    const error = await response.json();
    throw new Error(error.message);
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

export const submitReview = (reviewData, spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reviewData),
  });

  if (response.ok) {
    const review = await response.json();
    dispatch(fetchReviews(spotId));
    return review;
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

    case GET_REVIEWS_BY_SPOT_ID: {
      return { ...state, reviews: action.payload.Reviews };
    }
    case GET_USER_SPOTS: {
      const newState = {};
      action.payload.Spots.forEach((spot) => (newState[spot.id] = spot));
      return {
        userSpots: { ...newState },
      };
    }

    default:
      return state;
  }
};

export default spotsReducer;
