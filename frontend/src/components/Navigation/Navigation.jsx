import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  const sessionLinks = sessionUser ? (
    <li>
      <ProfileButton user={sessionUser} />
    </li>
  ) : (
    <>
      <div className="modal-overlay">
        <div className="modal">
          <p className="open-modal-button">
            <OpenModalButton
              buttonText="Log In"
              modalComponent={<LoginFormModal />}
            />
            {/* <NavLink to="/login">Log In</NavLink> */}
          </p>
          <p className="open-modal-button">
            <OpenModalButton
              buttonText="Sign Up"
              modalComponent={<SignupFormModal />}
            />
            {/* <NavLink to="/signup">Sign Up</NavLink> */}
          </p>
        </div>
      </div>
    </>
  );

  return (
    <ul>
      <li>
        <NavLink to="/"></NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;
