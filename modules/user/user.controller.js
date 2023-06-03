import userModel from "../../DB/models/user.models.js";
import { sendEmail } from "../../services/sendEmail.js";
import cloudinary from "../../utils/cloudinary.js";
import { tokenFunction } from "../../utils/tokenfunction.js";
import { compareFunction, hashFunction } from "./../../utils/hashFunction.js";

// sign up
export const signup = async (req, res, next) => {
  const { fullname, phone, email, password } = req.body;
  console.log(req.body)
  if (!req.file) {
    return next(new Error('please select picture',{cause:400}))
  }
  const match = await userModel.find({ email });
  if (!match.length) {
    const hashedpassword = hashFunction({ payload: password });
    if (hashedpassword) {
      const newUser = new userModel({
        fullname,
        phone,
        email,
        password: hashedpassword,
        profile_pic: req.file.path
      });
      const token = tokenFunction({ payload: { id: newUser._id } });
      console.log(token);
      const confirmationLink = `${req.protocol}://${req.headers.host}/api/v1/user/confirmemail/${token}`;
      const sentEmail = await sendEmail({
        to: newUser.email,
        message: `<a href=${confirmationLink}>click to confirm </a>`,
        subject: "Confirm your email",
      });
      if (sentEmail) {
        await newUser.save();
        return res
          .status(201)
          .json({
            message: " sign up success , please confirm from your email",
          });
      } else {
        res.next(new Error("unknownerror please try again later"));
      }
    } else {
      next(new Error("Hash password fail", { cause: 400 }));
    }
  } else {
    next(new Error("email already exists", { cause: 409 }));
  }
};

// upload cloudinary 
export const uploadCloudinary = async (req, res, next) => {
  const {fullname,_id}= req.user;

  if (!req.file) {
    return next(new Error('please select picture',{cause:400}))
  }
  const image = await cloudinary.uploader.upload(req.file.path,{
    folder:`images/${fullname}/profile`
  })
  const user = await userModel.findByIdAndUpdate(_id,{
    profile_pic: image.secure_url
  })
  if (!user) {
   return  next(new Error('please try to login ', {cause:400}))
  }
  res.status(201).json({message:'successfully uploaded' , user})

}

// confirm email
export const confirmemail = async (req, res, next) => {
  const { token } = req.params;
  const decode = tokenFunction({ payload: token, generate: false });
  if (decode?.id) {
    const user = await userModel.findOneAndUpdate(
      { _id: decode.id, confirmed: false },
      { confirmed: true }
    );
    if (user) {
      return res.status(200).json({ message: "confirmation  success" });
    }
    return res.status(200).json({ message: "user already confirmed " });
  } else {
    res.next(new Error("invalid token ", { cause: 400 }));
  }
};

// login
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const emailexists = await userModel.findOne({ email });

  if (!emailexists) {
    return next(new Error("invalid email or password"));
  }

  const match = compareFunction({
    payload: password,
    Referenceddata: emailexists.password,
  });
  if (match) {
    if (emailexists.confirmed) {
      const token = tokenFunction({
        payload: {
          id: emailexists._id,
          fullname: emailexists.fullname,
          email: emailexists.email,
          phone: emailexists.phone,
          confirmed:emailexists.confirmed,
          regDate: emailexists.createdAt

        },
      });
      if (token) {
        await userModel.updateOne({_id:emailexists._id},{isLoggedIn:true})
        res.status(200).json({ message: "login success", token });
      } else {
        next(new Error("token generation failed"));
      }
    } else {
      next(new Error("please confirm activation from your email"));

      //  res.status(200).json({message:'please confirm activation from your email'})
    }
  } else {
    next(new Error("invalid email or password"));
  }
};

// forget password
export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  const emailexists = await userModel.findOne({ email });
  if (!emailexists) {
    return next(new Error("invalid email ", { cause: 400 }));
  } else {
    let forgetCode = Math.floor(1000 + Math.random() * 9000);
    const sentEmail = await sendEmail({
      to: emailexists.email,
      message: `<p >your code to reset password ${forgetCode} please ignor if u don't forget password </p>`,
      subject: "forget password code  ",
    });
    if (sentEmail) {
      const updateuser = await userModel.findByIdAndUpdate(
        emailexists._id,
        { code: forgetCode },
        { new: true }
      );
      if (updateuser) {
        res
          .status(200)
          .json({
            message: " success check your email for reset password code "
          
          });
      } else {
        next(new Error("can't send reset code please try again later "));
      }
    } else {
      res.next(new Error("unknown error please try again later"));
    }
  }
};


// reset password 
export const resetPassword = async (req,res,next) => {
  const {code,newpassword,cpass} = req.body ;
  const {userid}= req.params;
  const user = await userModel.find({_id:userid,code});
  console.log(user)
  if(!user.length){
    next(new Error("invalid id or code", {cause:400}));

  }else{
    const hashedpassword = hashFunction({ payload: newpassword });
    if (hashedpassword) {
      const updateuser = await userModel.findByIdAndUpdate(
        userid,
        { password: hashedpassword ,code: 0 }, // reset code to 0 again to invalid it after one try 
       {new:true}
      );
      if (updateuser) {

        res
        .status(200)
        .json({
            message: "success reset password try login  ",
            updateuser
          
          });
      } else {
        next(new Error("reset password fail"));
      }
    } else {
      next(new Error("unknown error please try again later"));
    }
  }


}

// changepassword
export const changePassword = async (req,res,next) => { 
  const {oldpassword,newpassword} = req.body ;
  const user = req.user;
  console.log(user)
  // const matchPassword = compareFunction({payload:oldpassword, Referenceddata:user.password});
  const matchPassword = compareFunction({
    payload: oldpassword,
    Referenceddata: user.password,
  });
  if (!matchPassword) {
  return  next(new Error('wrong old password'))
  }
  const hashNewPass = hashFunction({payload:newpassword});
  if (!hashNewPass) {
  return  next (new Error('fail hash new password'))
  }

  const changepassord = await userModel.findByIdAndUpdate(user._id,{password:hashNewPass},{new:true});
  if (changePassword) {
    res.status(200).json({message: 'password changed '})
  }else{
    next (new Error('change password failed'))
  }


}


// update profile
export const updateprofile = async (req,res,next) => {
  const {fullname,phone}= req.body ;
  const user= req.user;


  const updateuser = await userModel.findByIdAndUpdate(
    user._id,
    { fullname, phone },
    { new: true }
  );
  
  if (updateuser) {
    res
   .status(200).json({message:'update success', user:updateuser})
  }else{
    next(new Error("update profile fail"));
  }
}

// soft delete 
export const softDelete = async (req,res,next) => {
  const user= req.user;
  const deleteduUser = await userModel.findOneAndUpdate({_id:user._id,confirmed:true},
    { confirmed: false },
    { new: true })
 
  if (deleteduUser) {
    res
  .status(200).json({message:'soft delete success and user deactivated', user:deleteduUser})
  }else{
    next(new Error("user already not active"));
  }
}

// delete user 
export const deleteUser = async (req,res,next) => {
  const user= req.user;
  const deleteduUser = await userModel.findByIdAndDelete({_id:user._id})
 
  if (deleteduUser) {
    res
 .status(200).json({message:'delete success'})
  }else{
    next(new Error("delete fail "));
  }
}

// logout
export const logout = async (req,res,next) => {
  const user= req.user;
  const updateuser = await userModel.findByIdAndUpdate(
    user._id,
    { isLoggedIn: false },
    { new: true }
  );
  if (updateuser) {
    res
.status(200).json({message:'logout success'})
  }else{
    next(new Error("logout fail"));
  }
}

