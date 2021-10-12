module.exports = (err, req, res, next) => {
  // err.msg = err.message;

  // let message = [];
  // if (err.name === "ValidationError") {
  //   for (key in err.errors) {
  //     message.push(err.errors[key].message);
  //   }
  // } else if (err.name === "CastError") {
  //   message.push(`Invalid ID ${err.value}`);
  // }

  // const errorCode = err.errorCode ? err.errorCode : 404;
  // const errorMessage = err.isOperational ? err.msg : message.join(", ");

  // res.status(errorCode).json({
  //   status: err.status ? err.status : "Fail",
  //   message: errorMessage ? errorMessage : "Something went wrong!",
  // });
  res.send(err);
};
