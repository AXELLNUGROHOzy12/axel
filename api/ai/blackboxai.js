const axios = require("axios")

module.exports = (app) => {
  async function BlackboxAI(text, imageUrl = "", sessionid = "") {
    try {
      let apiUrl = `https://api.nekorinn.my.id/ai/blackbox?text=${encodeURIComponent(text)}`

      // Tambahkan parameter opsional jika ada
      if (imageUrl) {
        apiUrl += `&imageUrl=${encodeURIComponent(imageUrl)}`
      }

      if (sessionid) {
        apiUrl += `&sessionid=${encodeURIComponent(sessionid)}`
      }

      const response = await axios.get(apiUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      })

      if (!response.data) {
        throw new Error("Invalid response from BlackBox AI API")
      }

      return response.data
    } catch (err) {
      throw new Error("Failed to fetch from BlackBox AI API: " + err.message)
    }
  }

  app.get("/ai/blackboxai", async (req, res) => {
    const { text, apikey, imageUrl, sessionid } = req.query

    if (!text) {
      return res.json({ status: false, error: "Text is required" })
    }

    if (!apikey || !global.apikey.includes(apikey)) {
      return res.json({ status: false, error: "Invalid or missing API key" })
    }

    try {
      const result = await BlackboxAI(text, imageUrl, sessionid)
      res.status(200).json({
        status: true,
        result,
      })
    } catch (error) {
      res.status(500).json({ status: false, error: error.message })
    }
  })
          }
        
