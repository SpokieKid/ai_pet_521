const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { messages, model, frequency_penalty, max_tokens, presence_penalty, stop, stream, temperature, top_p, logprobs, top_logprobs } = req.body;

  try {
    const response = await axios.post('https://api.deepseek.com/chat/completions', {
      messages,
      model,
      frequency_penalty,
      max_tokens,
      presence_penalty,
      stop,
      stream,
      temperature,
      top_p,
      logprobs,
      top_logprobs
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_KEY}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(error.response ? error.response.status : 500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
