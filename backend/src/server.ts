import app from "./app";
import { createServer } from "http";
import { initSocket } from "./lib/socket";

const PORT = process.env.PORT || 4000;

const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
