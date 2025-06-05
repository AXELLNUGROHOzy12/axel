const axios = require("axios")

module.exports = (app) => {
  async function OpenAiGpt(text) {
    try {
      const response = await axios.get(`https://api.nekorinn.my.id/ai/gpt-turbo?text=${encodeURIComponent(text)}`, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      })

      if (!response.data || !response.data.result) {
        throw new Error("Invalid response from OpenAI GPT API")
      }

      return response.data.result
    } catch (err) {
      throw new Error("Failed to fetch from OpenAI GPT API: " + err.message)
    }
  }

  app.get("/ai/openaigpt", async (req, res) => {
    const { text, apikey } = req.query

    if (!text) {
      return res.json({ status: false, error: "Text is required" })
    }

    if (!apikey || !global.apikey.includes(apikey)) {
      return res.json({ status: false, error: "Invalid or missing API key" })
    }

    try {
      const result = await OpenAiGpt(text)
      res.status(200).json({
        status: true,
        result,
      })
    } catch (error) {
      res.status(500).json({ status: false, error: error.message })
    }
  })
          }
    
