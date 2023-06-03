// generate token , decode token

import jwt from "jsonwebtoken";
export const tokenFunction = ({
  payload = {} || "",
  signature = process.env.TOKEN_SIGNATURE,
  // expiresIn = 120,
  generate = true,
}) => {

  if (typeof payload == "object" && generate) {
    if (Object.keys(payload).length) {
   
      const token = jwt.sign(payload, signature);
      return token;
    }
    return false;
  }


  if (typeof payload == "string" && !generate) {
    if (payload == "") {
      return false;
    }
    const decode = jwt.verify(payload, signature);
    return decode;
  }
};