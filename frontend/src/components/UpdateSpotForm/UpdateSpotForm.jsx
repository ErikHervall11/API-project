import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { updateSpot, fetchSpotById } from "../../store/spots";
import "./UpdateSpotForm.css";

function UpdateSpotForm() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spot = useSelector((state) => state.spots.spotId);
  //   console.log("====================", spot);

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState({ url: "", preview: false });
  const [img2, setImg2] = useState({ url: "", preview: false });
  const [img3, setImg3] = useState({ url: "", preview: false });
  const [img4, setImg4] = useState({ url: "", preview: false });
  const [img5, setImg5] = useState({ url: "", preview: false });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (spot) {
      setCountry(spot.country);
      setAddress(spot.address);
      setCity(spot.city);
      setState(spot.state);
      setDescription(spot.description);
      setName(spot.name);
      setPrice(spot.price);
      setPreviewImage({
        url: spot?.SpotImages?.[0]?.url || "",
        preview: true,
      });
      setImg2({
        url: spot?.SpotImages?.[1]?.url || "",
        preview: true,
      });
      setImg3({
        url: spot?.SpotImages?.[2]?.url || "",
        preview: true,
      });
      setImg4({
        url: spot?.SpotImages?.[3]?.url || "",
        preview: true,
      });
      setImg5({
        url: spot?.SpotImages?.[4]?.url || "",
        preview: true,
      });
    } else {
      dispatch(fetchSpotById(spotId));
    }
  }, [dispatch, spot, spotId]);

  const validateForm = () => {
    let formErrors = {};
    if (!country) formErrors.country = "Country is required";
    if (!address) formErrors.address = "Address is required";
    if (!city) formErrors.city = "City is required";
    if (!state) formErrors.state = "State is required";
    if (!name) formErrors.name = "Name of your spot is required";
    if (!price) formErrors.price = "Price per night is required";
    if (description.length < 30)
      formErrors.description = "Description needs 30 or more characters";
    if (!previewImage.url || !img2.url || !img3.url || !img4.url || !img5.url)
      formErrors.images = "Preview Image URL is required";

    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      let images = { previewImage, img2, img3, img4, img5 };

      const updatedSpot = {
        country,
        address,
        city,
        state,
        lat: 1,
        lng: 1,
        description,
        name,
        price,
      };

      const result = await dispatch(updateSpot(updatedSpot, spotId, images));

      if (result) {
        navigate(`/spots/${result.id}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="update-spot-form">
      <h1>Update Your Spot</h1>
      <section>
        <h2>Location Information</h2>
        <div>
          <p>Country</p>
          {errors.country && <p className="error">{errors.country}</p>}
          <input
            id="country"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <p>Address</p>
          {errors.address && <p className="error">{errors.address}</p>}
          <input
            type="text"
            name="address"
            value={address}
            placeholder="Street Address"
            onChange={(e) => setAddress(e.target.value)}
          />
          <p>City</p>
          {errors.city && <p className="error">{errors.city}</p>}
          <input
            type="text"
            name="city"
            value={city}
            placeholder="City"
            onChange={(e) => setCity(e.target.value)}
          />
          <p>State</p>
          {errors.state && <p className="error">{errors.state}</p>}
          <input
            type="text"
            name="state"
            value={state}
            placeholder="State"
            onChange={(e) => setState(e.target.value)}
          />
        </div>
      </section>

      <section>
        <h2>Describe your place to guests</h2>
        <p>
          Mention the best features of your space, any special amenities like
          fast wifi or parking, and what you love about the neighborhood.
        </p>
        <p>
          Description
          {errors.description && <p className="error">{errors.description}</p>}
        </p>
        <textarea
          placeholder="Please write at least 30 characters"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </section>

      <section>
        <h2>Create a title for your spot</h2>
        <p>
          Catch guests&apos; attention with a spot title that highlights what
          makes your place special.
        </p>
        {errors.name && <p className="error">{errors.name}</p>}
        <input
          type="text"
          name="title"
          value={name}
          placeholder="Name of your spot"
          onChange={(e) => setName(e.target.value)}
        />
      </section>

      <section>
        <h2>Set a base price for your spot</h2>
        <p>
          Competitive pricing can help your listing stand out and rank higher in
          search results.
        </p>
        {errors.price && <p className="error">{errors.price}</p>}
        <input
          type="number"
          name="price"
          value={price}
          placeholder="Price per night (USD)"
          onChange={(e) => setPrice(e.target.value)}
        />
      </section>

      <section>
        <h2>Liven up your spot with photos</h2>
        <p>Submit a link to at least one photo to publish your spot.</p>

        {errors.images && <p className="error">{errors.images}</p>}

        <div id="photos-input-field">
          <label htmlFor="prevImageURL">
            <input
              type="text"
              value={previewImage.url}
              placeholder="Preview Image Url"
              id="prevImageURL"
              onChange={(e) =>
                setPreviewImage((prevState) => ({
                  ...prevState,
                  url: e.target.value,
                }))
              }
            />
          </label>
          <label htmlFor="image2Input">
            <input
              type="text"
              placeholder="Image URL"
              id="image2Input"
              value={img2.url}
              onChange={(e) =>
                setImg2((prevState) => ({
                  ...prevState,
                  url: e.target.value,
                }))
              }
            />
          </label>
          <label htmlFor="image3Input">
            <input
              id="image3Input"
              type="text"
              placeholder="Image URL"
              value={img3.url}
              onChange={(e) =>
                setImg3((prevState) => ({
                  ...prevState,
                  url: e.target.value,
                }))
              }
            />
          </label>
          <label htmlFor="image4Input">
            <input
              type="text"
              id="image4Input"
              placeholder="Image URL"
              value={img4.url}
              onChange={(e) =>
                setImg4((prevState) => ({
                  ...prevState,
                  url: e.target.value,
                }))
              }
            />
          </label>
          <label htmlFor="image5Input">
            <input
              type="text"
              id="image5Input"
              placeholder="Image URL"
              value={img5.url}
              onChange={(e) =>
                setImg5((prevState) => ({
                  ...prevState,
                  url: e.target.value,
                }))
              }
            />
          </label>
        </div>
      </section>

      <button type="submit">Update Your Spot</button>
    </form>
  );
}

export default UpdateSpotForm;
