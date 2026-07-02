import React from "react";
import Layout from "./../components/Layouts/Layout";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";
const Contact = () => {
  return (
    // <Layout title={"contact us - Aranya"}>
    <Layout
  title={"Contact Aranya | Get in Touch"}
  description={"Have questions or bulk orders? Contact Aranya for premium biodegradable and eco-friendly products."}
  keywords={"contact aranya, get in touch, biodegradable, bulk orders, eco-friendly contact"}
  author={"Krishna Kumar"}
>

      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/contactus.jpg"
            alt="contactus"
            style={{ width: "100%" }}
            loading="lazy"
          />
        </div>
        <div className="col-md-4">
          <h1 className="bg-dark p-2 text-white text-center">CONTACT US</h1>
          <p className="text-justify mt-2">
            any query and info about product feel free to call anytime we 24X7 available.
          </p>
          <p className="mt-3">
            <BiMailSend /> : www.help@aranya.com
          </p>
          <p className="mt-3">
            <BiPhoneCall /> : 012-3456789
          </p>
          <p className="mt-3">
            <BiSupport /> : 1800-0000-0000 (toll free)
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;