import React,{ useState } from "react"
import Layout from "./../../components/Layouts/Layout";
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import { useAuth } from "../../context/auth";

const Login = () => {
  const [email,setemail] = useState("");
  const [password,setPassword] = useState("");
  const [auth,setAuth] = useAuth()

  const navigate = useNavigate();
  const location = useLocation();

  //form function---
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post("/api/v1/auth/login",
            { email, password }
        );
        if(res && res.data.success) {
            toast.success(res.data && res.data.message);
            setAuth({
              ...auth,
              user: res.data.user,
              token: res.data.token,
            });
            localStorage.setItem('auth',JSON.stringify(res.data));
            navigate(location.state || "/");
        } else{
         toast.error(res.data.message);
        }
    } catch (error) {
        console.log(error)
        toast.error("something went wrong");
    }
};
  return (
    // <Layout title=" Business Inquiry - Aranya">
    <Layout
  title={"Login/Register | Aranya"}
  description={"Login or create your Aranya account for easy shopping of eco-friendly products."}
  keywords={"login aranya, register aranya, eco-friendly shopping"}
  author={"Krishna Kumar"}
>
    <div className=" form-container ">
     <form onSubmit={handleSubmit}>
      <h4 className="title">Business Inquiry Login</h4>
    <div class="mb-3">
     <input type="email" value={email} onChange={(e) => setemail(e.target.value)} class="form-control" 
id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="E-Mail" required/>
    </div>
    <div class="mb-3">
     <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} 
class="form-control" id="exampleInputPassword1" placeholder="Password" required/>
    </div>
  <div className="mb-3">
   <button type="button" className="btn btn-primary" onClick={() => {navigate("/forget-password")}}>Forget Password</button>
  </div>
   <button type="submit" className="btn btn-primary">Login</button>
 </form> 
    </div>
</Layout>
  )
}

export default Login