import { useState } from "react";
import { useDispatch } from "react-redux";

import "./ReviewModal.css";
import { submitReview } from "../../store/spots";

function ReviewModal({ show, onClose, spotId }) {
  const [reviewText, setReviewText] = useState("");
  const [stars, setStars] = useState(0);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const review = { review: reviewText, stars };
      await dispatch(submitReview(review, spotId));
      onClose();
      setReviewText("");
      setStars(0);
    } catch (error) {
      setError("Failed to post review. Please try again.");
    }
  };

  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="review-modal">
        <button
          className="modal-close-button"
          onClick={() => {
            onClose();
            setError("");
          }}
        ></button>
        <form onSubmit={handleSubmit}>
          <h2>How was your stay?</h2>
          {error && <p className="error-message">{error}</p>}
          <textarea
            placeholder="Leave your review here..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
          />
          <label>
            Stars:
            <input
              type="number"
              min="1"
              max="5"
              value={stars}
              onChange={(e) => setStars(Number(e.target.value))}
              required
            />
          </label>
          <button
            type="submit"
            disabled={reviewText.length < 10 || stars === 0}
          >
            Submit Your Review
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReviewModal;
