import React, { useEffect, useState } from "react";
import { fetchContactInquiries } from "../services/aboutService";

const ContactInquiries = () => {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    fetchContactInquiries()
      .then((response) => {
        setInquiries(response.data);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the contact inquiries!",
          error
        );
      });
  }, []);

  return (
    <div>
      <h2>Contact Inquiries</h2>
      <ul>
        {inquiries.map((inquiry) => (
          <li key={inquiry.id}>
            <h3>{inquiry.name}</h3>
            <p>{inquiry.email}</p>
            <p>{inquiry.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactInquiries;
