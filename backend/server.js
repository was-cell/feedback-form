// // backend/server.js
// const express = require("express"); 
// const path = require("path");     
// const app = express();            
// const PORT = 3000;                 

// // ✅ 1. Middleware to serve static files from 'public' folder
// app.use(express.static(path.join(__dirname, "../public")));

// // ✅ 2. Middleware to read form data (url-encoded)
// app.use(express.urlencoded({ extended: true }));

// // ✅ 3. POST route to receive form data
// app.post("/submit", (req, res) => {
//   const { email, password, contact, message } = req.body;

//   console.log("📥 New Feedback Received:");
//   console.log("Email:", email);
//   console.log("Password:", password);
//   console.log("Contact:", contact);
//   console.log("Message:", message);

//   res.send(`<h2 style="text-align:center;">Thank you, ${email}!<br>Your feedback has been received.</h2>`);
// });

// // ✅ 4. Start the server
// app.listen(PORT, () => {
//   console.log(`🚀 Server is running at http://localhost:${PORT}`);
// }); 



// ✅ backend/server.js
const express = require("express");              
const path = require("path");                    
const mongoose = require("mongoose");          
const app = express();                          
const PORT = 3000;                              

// ✅ 1. MongoDB Connection (Mongoose se)
mongoose.connect("mongodb://0.0.0.0/feedbackDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected successfully!"))
.catch((err) => console.error("❌ MongoDB connection failed:", err));

// ✅ 2. Feedback Schema and Model
const feedbackSchema = new mongoose.Schema({
  email: String,
  password: String,
  contact: String,
  message: String
});

const Feedback = mongoose.model("Feedback", feedbackSchema); 
// "Feedback" collection ka model ban gaya, yahi database me document save karega

// ✅ 3. Middleware to serve static files (jaise HTML, CSS)
app.use(express.static(path.join(__dirname, "../public")));

// ✅ 4. Middleware to read form data from POST request
app.use(express.urlencoded({ extended: true }));

// ✅ 5. POST route to receive form data and save it to MongoDB
app.post("/submit", async (req, res) => {
  const { email, password, contact, message } = req.body;

  try {
    // ➕ MongoDB me new document save kar rahe hain
    const newFeedback = new Feedback({ email, password, contact, message });
    await newFeedback.save(); // ⏳ Wait karta hai jab tak save complete na ho

    console.log("📥 New Feedback Saved to MongoDB:");
    console.log(newFeedback);

    res.send(`<h2 style="text-align:center;">Thank you, ${email}!<br>Your feedback has been saved.</h2>`);
  } catch (err) {
    console.error("❌ Error saving feedback:", err);
    res.status(500).send("Something went wrong!");
  }
});

// ✅ 6. Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
