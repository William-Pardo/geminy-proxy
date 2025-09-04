const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('API key missing');
    res.status(500).json({ error: 'API key missing' });
    return;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      console.error('Gemini API error:', data);
      res.status(response.status).json({ error: 'Gemini API error', details: data });
      return;
    }
    res.status(200).json(data);
  } catch (err) {
    console.error('Request failed:', err);
    res.status(500).json({ error: 'Gemini request failed', details: err.message });
  }
};
