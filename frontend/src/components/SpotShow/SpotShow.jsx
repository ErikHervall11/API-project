import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { fetchReviews, fetchSpotById } from "../../store/spots";
import "./SpotShow.css";
import ReviewModal from "../ReviewModal/ReviewModal";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";
import OpenModalButton from "../OpenModalButton/OpenModalButton";

function SpotShow() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.spotId);
  const reviews = useSelector((state) => state.spots.reviews);
  const user = useSelector((state) => state.session.user);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (spotId) {
      setIsLoaded(false);
      Promise.all([
        dispatch(fetchSpotById(spotId)),
        dispatch(fetchReviews(spotId)),
      ]).then(() => setIsLoaded(true));
    }
  }, [dispatch, spotId]);

  const handleReviewModal = () => setShowReviewModal(true);
  const closeReviewModal = () => {
    setShowReviewModal(false);
    dispatch(fetchSpotById(spotId));
    // dispatch(fetchReviews(spotId));
  };

  return (
    <div>
      {isLoaded && spot && (
        <>
          <div className="spot-show-header">
            <h1>{spot.name}</h1>
            <p>
              {spot.city}, {spot.state}, {spot.country}
            </p>
            <p>
              Year{" : "}
              {spot.price?.toLocaleString()}
              {spot.city === "Athens" || spot.city === "Jurassic Junction"
                ? " BC"
                : ""}
            </p>
          </div>
          <div className="full-image-con">
            <div className="images-con">
              <div id="spotImages" className="spot-images-container">
                <div className="spot-image-large">
                  <img src={spot?.SpotImages?.[0]?.url} alt="image 1" />
                </div>
                <div className="spot-images-small">
                  <img src={spot?.SpotImages?.[1]?.url} alt="image 2" />
                  <img src={spot?.SpotImages?.[2]?.url} alt="image 3" />
                  <img src={spot?.SpotImages?.[3]?.url} alt="image 4" />
                  <img src={spot?.SpotImages?.[4]?.url} alt="image 5" />
                </div>
              </div>
            </div>
          </div>
          <div id="spot-description">
            <div className="host-description">
              <h1>
                Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
              </h1>
              <p>{spot.description}</p>
            </div>
            <div id="callout-box">
              <p className="book-now">Book Now, For Then!</p>
              <div id="reviews-and-cost">
                <div id="cost-per-night">
                  <p>
                    <span style={{ fontWeight: "bold" }}>
                      ${spot.price?.toLocaleString()}.00
                    </span>
                    {" / "}
                    night
                  </p>
                </div>
                <div id="reviews-ratings">
                  {`${spot.avgRating} Average Stars • ${spot.numReviews} Reviews`}
                </div>
              </div>
              <div id="div-button">
                <button
                  id="reserve-button"
                  onClick={() => alert("Feature coming soon!")}
                >
                  Reserve
                </button>
              </div>
            </div>
          </div>

          <div className="reviews">
            <div className="reviews-ratings-bottom">
              {`${spot.avgRating} Average Stars • Reviews: ${spot.numReviews}`}
            </div>

            {user &&
              user.id !== spot.ownerId &&
              reviews.find((f) => f.userId === user.id) === undefined && (
                <button
                  className="post-review-button"
                  onClick={handleReviewModal}
                >
                  Post Your Review
                </button>
              )}
            <ReviewModal
              show={showReviewModal}
              onClose={closeReviewModal}
              spotId={spotId}
            />

            {reviews &&
              reviews
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((review, index) => (
                  <div className="each-review" key={index}>
                    <p>{review.User?.firstName || "Anonymous"}</p>
                    <p className="date">
                      {new Date(review.createdAt).toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <div className="rating-review">
                      <p>Rating: {review.stars}</p>
                      <p className="review">{review.review}</p>
                    </div>

                    {user && user.id === review.userId && (
                      <OpenModalButton
                        className="delete-spot-button"
                        buttonText="Delete"
                        modalComponent={
                          <DeleteReviewModal
                            onClose={closeReviewModal}
                            spotId={spot.id}
                            reviewId={review.id}
                          />
                        }
                      />
                    )}
                  </div>
                ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SpotShow;
