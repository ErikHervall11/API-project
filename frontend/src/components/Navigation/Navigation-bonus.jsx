import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton-bonus";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const navigate = useNavigate();
  const newSpot = () => {
    navigate("/spots/new");
  };

  return (
    <>
      <div id="navbar">
        <NavLink to="/">
          <img id="logo" src="/erabnb.jpg" />
        </NavLink>
        <nav id="right-nav">
          <button onClick={newSpot} id="create-spot-button">
            Create a New Spot
          </button>
          {isLoaded && <ProfileButton user={sessionUser} />}
        </nav>
      </div>
    </>
  );
}

export default Navigation;
