import React,{ useState } from "react"
import Layout from "./../../components/Layouts/Layout";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";

const ForgetPassword = () => {
    const [email,setemail] = useState("");
    const [newPassword,setNewPassword] = useState("");
    const [answer, setAnswer] = useState("");

    const navigate = useNavigate();
    //form function---
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/forget-password`,
              { email, newPassword, answer }
          );
          if(res && res.data.success) {
              toast.success(res.data && res.data.message);

              navigate("/login");
          } else{
           toast.error(res.data.message);
          }
      } catch (error) {
          console.log(error)
          toast.error("something went wrong");
      }
    };
    return (
        // <Layout title={"Forget Password - Aranya"}>
        <Layout
  title={"Forget Password | Aranya"}
  description={"Login or create your Aranya account for easy shopping of eco-friendly products."}
  keywords={"login aranya, register aranya, eco-friendly shopping"}
  author={"Krishna Kumar"}
>

              <div className=" form-container ">
                 <form onSubmit={handleSubmit}>
                  <h4 className="title">Reset Password</h4>
              <div class="mb-3">
                <input type="email" value={email} onChange={(e) => setemail(e.target.value)} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="E-Mail" required/>
  </div>
  <div class="mb-3">
  <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter your favorite sport name" required/>
  </div>
  <div class="mb-3">
   <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} 
ass="form-control" id="exampleInputPassword1" placeholder="New Password" required/>
  </div>
 <button type="submit" className="btn btn-primary">Reset Password</button>
</form> 
  </div>
        </Layout>
    );
};

export default ForgetPassword;