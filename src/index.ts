import express from "express";
import dotenv from "dotenv";
import { StreamChat } from "stream-chat";

dotenv.config();

const { PORT, STREAM_API_KEY, STREAM_API_SECRET } = process.env;
const client = StreamChat.getInstance(STREAM_API_KEY!, STREAM_API_SECRET);

const app = express();
app.use(express.json());

app.post("/generate-stream-token", async (req, res) => {
  const { email, id } = req.body;

  if (!email || !id) {
    return res.status(400).json({
      message: "Invalid credentials.",
    });
  }

  const now = Math.floor(Date.now() / 1000);
  const dayInSeconds = 86400;
  const monthInSecs = 30 * dayInSeconds;
  const exp = now + monthInSecs;

  // Create user in Stream Chat
  await client.upsertUser({
    id,
    email,
    name: email,
  });

  // Create token for user
  const token = client.createToken(id, exp, now);

  return res.json({
    token,
    user: {
      id,
      email,
    },
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
