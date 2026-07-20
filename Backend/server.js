import app from "./src/app.js";
import { config } from "./src/config/config.js";
import connectToMongoDB from "./src/config/db.js";

const PORT = config.PORT || 3000;

// Start the server and connect to MongoDB
const startServer = async () => {
  try {
    await connectToMongoDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error.message);
    process.exit(1);
  }
};

startServer();
