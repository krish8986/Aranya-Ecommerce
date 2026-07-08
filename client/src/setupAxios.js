import axios from "axios";

if (process.env.REACT_APP_API) {
    axios.defaults.baseURL = process.env.REACT_APP_API;
}