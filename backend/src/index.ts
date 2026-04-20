import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import memberRoutes from './routes/members';
import planRoutes from './routes/plan.routes';
import attendanceRoutes from "./routes/attendance.routes";
import gymRoutes from "./routes/gym.routes";

connectDB();

const app = express();
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (/^http:\/\/localhost:\d+$/.test(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Gym Management System is running');
});

// routes
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/gyms', gymRoutes);

// error fallback
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Server Error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running at PORT:${PORT}`);
});