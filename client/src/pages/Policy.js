import React from "react";
import Layout from "./../components/Layouts/Layout";

const Policy = () => {
  return (
    <Layout title={"Privacy Policy- Aranya"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/policy.webp"
            alt="contactus"
            style={{ width: "100%" }}
            loading="lazy"
          />
        </div>
        <div className="col-md-4">
          <p>We collect only essential information to process your orders.</p>
          <p>Your personal data is stored securely and kept confidential.</p>
          <p>Payment details are handled by trusted, secure payment providers.</p>
          <p>We never sell or rent your personal information.</p>
          <p>Cookies help improve your browsing experience and website performance.</p>
          <p>Information is shared only with trusted delivery and service partners.</p>
          <p>You can request to update or delete your personal data anytime.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;