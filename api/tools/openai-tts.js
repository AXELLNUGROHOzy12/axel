const axios = require("axios")

module.exports = (app) => {
  app.get("/tools/openai-tts", async (req, res) => {
    try {
      const { apikey, text, voice } = req.query

      if (!global.apikey.includes(apikey)) {
        return res.json({ status: false, error: "Apikey invalid" })
      }

      if (!text) {
        return res.json({
          status: false,
          error: "Text is required",
          message: "Parameter 'text' wajib diisi untuk mengkonversi text ke speech",
        })
      }

      // Gunakan voice default "Ballad" jika tidak disediakan
      const selectedVoice = voice || "Ballad"

      const apiUrl = `https://api.nekorinn.my.id/tools/openai-tts?text=${encodeURIComponent(text)}&voice=${encodeURIComponent(selectedVoice)}`

      const response = await axios.get(apiUrl, {
        responseType: "arraybuffer",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      })

      // Set header untuk audio
      res.writeHead(200, {
        "Content-Type": "audio/mpeg",
        "Content-Length": response.data.length,
      })

      res.end(response.data)
    } catch (error) {
      res.status(500).json({
        status: false,
        error: `Error: ${error.message}`,
      })
    }
  })
          }
        
