import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteSpot } from "../../store/spots";

function DeleteForm({ spotId }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    await dispatch(deleteSpot(spotId));
    closeModal();
  };

  return (
    <div>
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to remove this spot?</p>
      <button onClick={handleSubmit}>Yes (Delete Spot)</button>
      <button onClick={closeModal}>No (Keep Spot)</button>
    </div>
  );
}

export default DeleteForm;
