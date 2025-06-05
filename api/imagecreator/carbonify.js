const axios = require("axios")

module.exports = (app) => {
  app.get("/imagecreator/carbonify", async (req, res) => {
    const { apikey, code } = req.query

    if (!global.apikey.includes(apikey)) {
      return res.json({ status: false, error: "Apikey invalid" })
    }

    if (!code) {
      return res.status(400).json({
        status: false,
        message:
          "Parameter code wajib diisi. Contoh: /imagecreator/carbonify?apikey=jarrv3&code=console.log('Hello World')",
      })
    }

    try {
      const apiUrl = `https://api.nekorinn.my.id/maker/carbonify?code=${encodeURIComponent(code)}`
      const response = await axios.get(apiUrl, {
        responseType: "arraybuffer",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      })

      res.set("Content-Type", "image/png")
      res.send(response.data)
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Gagal membuat carbonify code",
        error: err.message,
      })
    }
  })
  }
          
