import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

//protected Routes token base
export const requireSignIn = async (req, res, next) => {
    try {
        const decode = JWT.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        );
        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
    }
};



//admin access
export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (user.role !== 1) {
            return res.status(401).send({
                success: false,
                message: "unAuthorized Access",
            });
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            error,
            message: "Error in admin middleware",
        });
    }
};


//B2B Access Middleware-----

export const requireB2B = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (user.userType !== "B2B") {
            return res.status(403).json({
                success: false,
                message: "B2B Access only"
            });
        }else{
            next();
        }
    }catch (error) {
        console.error("B2B Middleware Error:", error);
        res.status(500).json({ 
            success: false,
            message: "Error in B2B Middleware", error
        });
    }
};

