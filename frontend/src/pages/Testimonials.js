import React, { useEffect, useState } from "react";
import { fetchTestimonials } from "../services/testimonialService";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetchTestimonials()
      .then((response) => {
        setTestimonials(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the testimonials!", error);
      });
  }, []);

  return (
    <div>
      <h2>Testimonials</h2>
      <ul>
        {testimonials.map((testimonial) => (
          <li key={testimonial.id}>
            <h3>{testimonial.author}</h3>
            <p>{testimonial.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Testimonials;
