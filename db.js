const { default: mongoose } = require("mongoose");

module.exports = () => {
  const connectionParams = {
    useNewUrlParser: true,
  };

  try {
    mongoose.connect(
      "mongodb+srv://smg:admin@cluster0.q0hgdmv.mongodb.net/smg?retryWrites=true&w=majority",
      connectionParams
    );
    console.log("Connected to DB successfully");
  } catch (error) {
    console.log(error);
    console.log("could not connect to DB");
  }
};
