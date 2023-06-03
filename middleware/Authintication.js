import userModel from "../DB/models/user.models.js";
import { tokenFunction } from "../utils/tokenfunction.js";

export const auth = () => {
  return async (req,res,next) => {
    const {authorization} = req.headers;

    try {
        if(!authorization){
            return res.status(401).json({message: 'No token provided'})
          }else{
              if (!authorization.startsWith(process.env.TOKEN_PRIFIX)) {
                  return res.json({message:'wrong token prefix'})
              }
              const token = authorization.split('__')[1];
              const decoded= tokenFunction({payload:token , generate:false});
              console.log(decoded.id)
              if(!decoded || !decoded.id){
                  return res.status(401).json({message: 'Invalid token'})
              }
              const user = await userModel.findById(decoded.id);
              if(!user){
                  return res.status(401).json({message: 'user not exist any more'})
              }else{
                  req.user = user;
                  next();
              }
          }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'error from authentication'})
    }
   
  }
  
}
