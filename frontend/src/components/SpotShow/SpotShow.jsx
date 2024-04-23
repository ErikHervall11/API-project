import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { fetchSpots } from "../../store/spots";
import "./SpotShow.css";

function SpotShow() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.spotId);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(fetchSpots(spotId)).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <div id="spotImages">
      {isLoaded && spot && (
        <div>
          <h1>{spot.name}</h1>
          <h2>
            Location: {spot.city}, {spot.state}, {spot.country}
          </h2>
          <img
            id="spotImage-large"
            src={spot.SpotImages[0].url}
            alt="image 1"
          />
          <img
            id="spotImage-small"
            src={spot.SpotImages[1].url}
            alt="image 2"
          />
          <img
            id="spotImage-small"
            src={spot.SpotImages[2].url}
            alt="image 3"
          />
          <img
            id="spotImage-small"
            src={spot.SpotImages[3].url}
            alt="image 4"
          />
          <img
            id="spotImage-small"
            src={spot.SpotImages[4].url}
            alt="image 5"
          />
        </div>
      )}
    </div>
  );
}

export default SpotShow;
