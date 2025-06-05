const axios = require("axios")

module.exports = (app) => {
  app.get("/imagecreator/ilogo", async (req, res) => {
    const { apikey, title, slogan, industry } = req.query

    if (!global.apikey.includes(apikey)) {
      return res.json({ status: false, error: "Apikey invalid" })
    }

    if (!title || !slogan || !industry) {
      return res.status(400).json({
        status: false,
        message:
          "Parameter title, slogan, dan industry wajib diisi. Contoh: /imagecreator/ilogo?apikey=jarrv3&title=TechCorp&slogan=Innovation%20First&industry=Technology",
      })
    }

    try {
      const apiUrl = `https://api.nekorinn.my.id/maker/sologo-ai?title=${encodeURIComponent(title)}&slogan=${encodeURIComponent(slogan)}&industry=${encodeURIComponent(industry)}`
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
        message: "Gagal membuat logo AI",
        error: err.message,
      })
    }
  })
    }
        
