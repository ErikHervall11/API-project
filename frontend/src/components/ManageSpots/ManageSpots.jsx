import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { fetchUserSpots } from "../../store/spots";
import "./ManageSpots.css";
import DeleteForm from "../DeleteFormModal.jsx/DeleteFormModal";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import "../Spots/Spots.css";

function ManageSpots() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.session.user);
  const userSpots = useSelector((state) => state.spots.userSpots);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    dispatch(fetchUserSpots()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <h1 className="manage-spots-header">Manage Spots</h1>
      <div id="spots" className="spots">
        {isLoaded &&
          user &&
          (Object.values(userSpots).length > 0 ? (
            Object.values(userSpots).map((spot) => (
              <div key={spot.id} className="spot-container">
                <NavLink className="nav-link-manage" to={`/spots/${spot.id}`}>
                  <div id="spot-image-container">
                    <div id="tool-tip">
                      <img
                        id="previewImage"
                        src={spot.previewImage}
                        alt={`${spot.name} Preview Image`}
                      />
                      <span id="tooltip-text">{spot.name}</span>
                    </div>
                  </div>
                  <div id="spot-info" className="spot-info">
                    <div>
                      <p>{spot.name}</p>
                      <p>
                        {spot.city}, {spot.state}
                      </p>
                      <p>{`$${spot.price?.toLocaleString()}.00 / night`}</p>
                    </div>
                    <div>
                      <p>Rating: {spot.avgRating || "New"}</p>
                    </div>
                  </div>
                </NavLink>
                <div className="update-delete-buttons">
                  <OpenModalButton
                    className="update-spot-button"
                    buttonText="Update"
                    onButtonClick={() => navigate(`/spots/${spot.id}/edit`)}
                  />
                  <OpenModalButton
                    className="delete-spot-button"
                    buttonText="Delete"
                    modalComponent={<DeleteForm spotId={spot.id} />}
                  />
                </div>
              </div>
            ))
          ) : (
            <NavLink to="/spots/new">Create a New Spot</NavLink>
          ))}
      </div>
    </>
  );
}

export default ManageSpots;
