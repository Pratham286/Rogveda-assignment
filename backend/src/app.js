import express from 'express';
import cors from 'cors'
import vendorRoutes from "./routes/vendor.route.js";
import bookingRoutes from "./routes/booking.route.js";
import hospitalsRoutes from "./routes/hospitals.route.js";


const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);

app.use(express.json({limit : '16kb'}));

app.use(express.urlencoded({extended : true, limit : '16kb'}));

app.use(express.static("public"))

app.use("/api/vendor", vendorRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/hospitals", hospitalsRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});
export default app;