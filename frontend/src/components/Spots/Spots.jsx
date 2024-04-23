import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpots } from "../../store/spots";
import { NavLink } from "react-router-dom";
import "./Spots.css";

function Spots() {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots);

  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(fetchSpots()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <div id="spots">
      {isLoaded &&
        Object.values(spots).map(
          (spot) =>
            !spot.Owner && (
              <NavLink
                id="spot"
                class="tooltip"
                key={spot.id}
                to={`/spots/${spot.id}`}
              >
                {/* <span class="tooltiptext">{spot.name}</span> */}
                <img
                  id="previewImage"
                  src={spot.previewImage}
                  alt={`${spot.name} Preview Image`}
                />
                <h1>{spot.name}</h1>
                <p>{spot.city}</p>
                <p>{spot.state}</p>
                <p>{`$${spot.price}.00`}</p>
                <p>{spot.avgRating}</p>
              </NavLink>
            )
        )}
    </div>
  );
}

export default Spots;
