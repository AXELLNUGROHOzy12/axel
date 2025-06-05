const axios = require("axios")

module.exports = (app) => {
  app.get("/imagecreator/undertext", async (req, res) => {
    try {
      const { apikey, text } = req.query

      if (!global.apikey.includes(apikey)) {
        return res.json({ status: false, error: "Apikey invalid" })
      }

      if (!text) {
        return res.json({ status: false, error: "Text is required" })
      }

      const apiUrl = `https://api.nekorinn.my.id/ephoto/3d-underwater-text?text=${encodeURIComponent(text)}`

      const response = await axios.get(apiUrl, {
        responseType: "arraybuffer",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      })

      res.writeHead(200, {
        "Content-Type": "image/png",
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
        
