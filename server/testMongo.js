import mongoose from "mongoose";

const uri = "mongodb+srv://ayushsharma192004_db_user:Oo9Bfs7lmt3fWTag@cluster0.zyeygik.mongodb.net/HearMeOutDB?retryWrites=true&w=majority";

mongoose.connect(uri)  // No extra options
  .then(() => {
    console.log("MongoDB connected successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
