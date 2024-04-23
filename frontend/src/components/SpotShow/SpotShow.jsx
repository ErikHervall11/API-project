import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { fetchSpots, fetchReviews } from "../../store/spots";
import "./SpotShow.css";

function SpotShow() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.spotId);
  const reviews = useSelector((state) => state.spots.reviews);
  // console.log("==================", reviews);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(fetchSpots(spotId)).then(() => {
      setIsLoaded(true);
    });

    dispatch(fetchReviews(spotId)).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch, spotId]);

  return (
    <div>
      <div id="spotImages">
        {isLoaded && spot && (
          <div>
            <h1>{spot.name}</h1>
            <h2>
              {spot.city}, {spot.state}, {spot.country}
            </h2>

            <img
              id="spotImage-large"
              src={spot.SpotImages[0].url}
              alt="image 1"
            />
            <img
              id="spotImage-small"
              src={spot.SpotImages[1].url}
              alt="image 2"
            />
            <img
              id="spotImage-small"
              src={spot.SpotImages[2].url}
              alt="image 3"
            />
            <img
              id="spotImage-small"
              src={spot.SpotImages[3].url}
              alt="image 4"
            />
            <img
              id="spotImage-small"
              src={spot.SpotImages[4].url}
              alt="image 5"
            />
          </div>
        )}
      </div>
      <div id="spot-description">
        <div>
          <p>
            Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
          </p>
          <p>{spot.description}</p>
        </div>

        <div id="callout-box">
          <div id="reviews-and-cost">
            <div id="cost-per-night">{`$${spot.price.toLocaleString()}.00 night`}</div>
            <div id="reviews-ratings">
              {spot.numReviews === 1
                ? `${spot.avgRating} Average Stars • Reviews: ${spot.numReviews}`
                : spot.numReviews > 1
                ? `${spot.avgRating} Average Stars • Reviews: ${spot.numReviews}`
                : `${spot.avgRating} Average Stars`}
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
      <div id="reviews">
        <div id="reviews-ratings-bottom">
          {spot.numReviews === 1
            ? `${spot.avgRating} Average Stars • Reviews: ${spot.numReviews}`
            : spot.numReviews > 1
            ? `${spot.avgRating} Average Stars • Reviews: ${spot.numReviews}`
            : `${spot.avgRating} Average Stars`}
        </div>
        {reviews &&
          reviews.map((review, index) => (
            <div key={index}>
              <p>{review.User.firstName}</p>
              <p>
                {new Date(review.createdAt).toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p>{review.review}</p>
              <p>Rating: {review.stars}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default SpotShow;
