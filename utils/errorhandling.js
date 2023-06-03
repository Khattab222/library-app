// handle catch error
let stackvar ;
export const errorHandling = (Api) => {
  return (req, res, next) => {
    Api(req, res, next).catch((err) => {
      // res.json({message:'catch error',err})
      next(new Error(err.message));
      stackvar = err.stack;
    });
  };
};

// handle global error
export const failResHandle = (err, req, res, next) => {
  if (err) {
    return res.status(err["cause"] || 500).json({
      message: "global error",
      errmsg: err.message,
      stack: err.stack,
      stackvar:stackvar
    });
  }
};
