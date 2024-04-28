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
    <div id="spots" className="spots">
      {isLoaded &&
        Object.values(spots).map(
          (spot) =>
            !spot.Owner && (
              <NavLink
                className="nav-link"
                key={spot.id}
                to={`/spots/${spot.id}`}
              >
                <div className="spot-container">
                  <div className="spot-image-container">
                    <div id="tool-tip">
                      <img
                        id="previewImage"
                        src={spot.previewImage}
                        alt={`${spot.name} Preview Image`}
                      />
                      <span id="tooltip-text">{spot.name}</span>
                    </div>
                  </div>
                  <div className="spot-info">
                    <div id="left" className="spot-left">
                      <p>
                        {spot.city}, {spot.state}
                      </p>

                      <p>
                        <span style={{ fontWeight: "bold" }}>
                          ${spot.price?.toLocaleString()}.00
                        </span>
                        {" / "}
                        night
                      </p>
                    </div>
                    <div id="right" className="spot-right">
                      <p>
                        <img src="/starnoback.png" /> {spot.avgRating}
                      </p>
                    </div>
                  </div>
                </div>
              </NavLink>
            )
        )}
    </div>
  );
}

export default Spots;
