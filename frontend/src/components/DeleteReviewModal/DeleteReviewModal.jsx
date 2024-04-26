import { useDispatch } from "react-redux";
import { deleteReview } from "../../store/spots";
import { useModal } from "../../context/Modal";

function DeleteReviewModal({ reviewId, spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    await dispatch(deleteReview(reviewId, spotId));
    closeModal();
  };

  return (
    <div>
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to delete this review?</p>
      <button onClick={handleDelete}>Yes (Delete Review)</button>
      <button onClick={closeModal}>No (Keep Review)</button>
    </div>
  );
}

export default DeleteReviewModal;
