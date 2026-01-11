import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import boardRoutes from "./routes/board.routes";
import listRoutes from "./routes/list.routes";
import taskRoutes from "./routes/task.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import { authenticate } from "./middleware/auth.middleware";
import teamRoutes from "./routes/team.routes";
import inviteRoutes from "./routes/invite.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use("/auth", authRoutes);
app.use(authenticate);
app.use(errorMiddleware);
app.use(authenticate);
app.use("/boards", boardRoutes);
app.use("/lists", listRoutes);
app.use("/tasks", taskRoutes);
app.use("/invites", inviteRoutes);
app.use("/teams", teamRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/users", userRoutes);

export default app;
