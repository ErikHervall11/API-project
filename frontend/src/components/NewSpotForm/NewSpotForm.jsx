import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchNewSpot } from "../../store/spots";
import { useNavigate } from "react-router-dom";

function NewSpotForm() {
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState(["", "", "", "", ""]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const spot = {
      country,
      address,
      city,
      state,
      lat: 1,
      lng: 1,
      description,
      name,
      price,
      images: images.filter((img) => img),
    };
    await dispatch(fetchNewSpot(spot));

    navigate("/");
  };

  const updateImage = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create a New Spot</h1>

      <section>
        <h2>Where&apos;s your place located?</h2>
        <p>
          Guests will only get your exact address once they booked a
          reservation.
        </p>
        <input
          type="text"
          name="country"
          placeholder="Country"
          onChange={(e) => setCountry(e.target.value)}
        />
        <input
          type="text"
          name="address"
          placeholder="Street Address"
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          onChange={(e) => setState(e.target.value)}
        />
      </section>

      <section>
        <h2>Describe your place to guests</h2>
        <p>
          Mention the best features of your space, any special amenities like
          fast wifi or parking, and what you love about the neighborhood.
        </p>
        <textarea
          placeholder="Please write at least 30 characters"
          name="description"
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </section>

      <section>
        <h2>Create a title for your spot</h2>
        <p>
          Catch guests&apos; attention with a spot title that highlights what
          makes your place special.
        </p>
        <input
          type="text"
          name="title"
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
        <input
          type="number"
          name="price"
          placeholder="Price per night (USD)"
          onChange={(e) => setPrice(e.target.value)}
        />
      </section>

      <section>
        <h2>Liven up your spot with photos</h2>
        <p>Submit a link to at least one photo to publish your spot.</p>
        {images.map((image, index) => (
          <input
            key={index}
            type="text"
            name={`image-${index}`}
            placeholder={index === 0 ? "Preview Image URL" : "Image URL"}
            value={image}
            onChange={(e) => updateImage(index, e.target.value)}
          />
        ))}
      </section>

      <button type="submit">Create Spot</button>
    </form>
  );
}

export default NewSpotForm;
