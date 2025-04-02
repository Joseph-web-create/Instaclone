import app from "./src/app.js";
import connectToDb from "./src/config/database.js";

const port = process.env.PORT || 4500;

if (!port) {
  throw new Error("please there is a port number provided");
}

//initialize server
connectToDb()
  .then(() => {
    startServer();
  })
  .catch((err) => {
    console.error("Invalid database connection", err);
  });

function startServer() {
  app.listen(port, () => {
    console.log(`Server is connected to port ${port}`);
  });
}