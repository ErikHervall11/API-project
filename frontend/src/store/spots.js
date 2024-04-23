const GET_SPOTS = "GET_SPOTS";
const GET_SPOT_BY_ID = "GET_SPOT_BY_ID";

export const getSpots = (spots) => ({
  type: GET_SPOTS,
  payload: spots,
});

export const getSpotById = (spot) => ({
  type: GET_SPOT_BY_ID,
  payload: spot,
});

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
    default:
      return state;
  }
};

export default spotsReducer;
