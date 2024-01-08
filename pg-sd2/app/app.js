import express from "express";
import session from "express-session";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import path from "path";

const app = express();
const port = 3000;

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "verysecretkey",  // Use environment variable for security
    resave: false,
    saveUninitialized: false,  // Enhanced security
    cookie: { secure: process.env.NODE_ENV === "production" }  // Secure cookies in production
  })
);

// Set view engine and static files
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "static")));  // Dynamic path for static files

// Parse incoming JSON and URL-encoded data
app.use(express.json({ charset: "utf-8" }));
app.use(express.urlencoded({ extended: true }));

// Connect to MySQL database
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || "localhost",
  user: process.env.DATABASE_USER || "user",
  password: process.env.DATABASE_PASSWORD || "password",
  database: process.env.DATABASE_NAME || "world",
  socketPath: process.env.DATABASE_SOCKET_PATH || "/var/run/mysqld/mysqld.sock"
});

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Welcome to LetWalk" });
});

app.get("/about", (req, res) => {
  const teamMembers = [ /* ... */ ]; // Fetch team members from database or external source
  res.render("about", { title: "Team", teamMembers });
});

app.get("/login", (req, res) => {
  res.render("login");
});

// ... (other routes)

// Default export for modularity
export default app;

// Start the server
app.listen(port, async () => {
  console.log(`App listening at http://localhost:${port}`);
});

