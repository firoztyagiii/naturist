const app = require("./app");
const mongoose = require("mongoose");

const init = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://naturist:123454321%40%23@cluster0.n1nxw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
    );
    app.listen(process.env.PORT, () => {
      console.log("Connected and listening to 1000");
    });
  } catch (err) {
    console.log(err);
  }
};

init();
