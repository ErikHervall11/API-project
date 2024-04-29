import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const demoUser = () => {
    return dispatch(
      sessionActions.login({ credential: "Demo-lition", password: "password" })
    ).then(closeModal);
  };

  const isDisabled = credential.length < 4 || password.length < 6;

  return (
    <div className="login-box">
      <h1>Log In</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="username-email">
          <label className="un-em">
            Username or Email
            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="password">
          <label className="pass">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        {errors.credential && <p>{errors.credential}</p>}
        <button className="login-button" type="submit" disabled={isDisabled}>
          Log In
        </button>
      </form>
      <button id="login-demo" onClick={demoUser}>
        Login as Demo User
      </button>
    </div>
  );
}

export default LoginFormModal;
