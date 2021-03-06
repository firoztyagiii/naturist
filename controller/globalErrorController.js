module.exports = (err, req, res, next) => {
  // res.send(err);
  err.msg = err.message;

  let message = [];
  if (err.name === "ValidationError") {
    for (key in err.errors) {
      message.push(err.errors[key].message);
    }
  } else if (err.name === "CastError") {
    message.push(`Invalid ID ${err.value}`);
  } else if (err.name === "MulterError") {
    message.push(`${err.message}, Image field name must be "headImg" `);
  } else if (err.name === "JsonWebTokenError") {
    message.push("Invalid token!");
  } else if (err.name === "TokenExpiredError") {
    messsage.push("Token expired, Please try again");
  } else if (err.codeName === "DuplicateKey") {
    const msg = [];
    for (key in err.keyValue) {
      msg.push(`${key}: ${err.keyValue[key]} already exists!`);
    }
    message.push(msg);
  } else if (err.code == 11000 && err.name == "MongoServerError") {
    for (key in err.keyValue) {
      message.push(`${err.keyValue[key]} named tour already exists`);
    }
  }

  const errorCode = err.errorCode ? err.errorCode : 400;
  const errorMessage = err.isOperational ? err.msg : message.join(", ");

  res.status(errorCode).json({
    status: err.status ? err.status : "Fail",
    message: errorMessage ? errorMessage : "Something went wrong!",
  });
};
