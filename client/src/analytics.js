import ReactGA from "react-ga4";

const trackingID = "G-XXXXXXX"; // replace with your Measurement ID

export const initGA = () => {
  ReactGA.initialize(trackingID);
};

export const trackPageview = (page) => {
  ReactGA.send({ hitType: "pageview", page });
};
