const axios = require("axios")

module.exports = (app) => {
  app.get("/imagecreator/ba-logo", async (req, res) => {
    const { apikey, textL, textR } = req.query

    if (!global.apikey.includes(apikey)) {
      return res.json({ status: false, error: "Apikey invalid" })
    }

    if (!textL || !textR) {
      return res.status(400).json({
        status: false,
        message:
          "Parameter textL dan textR wajib diisi. Contoh: /imagecreator/ba-logo?apikey=jarrv3&textL=Blue&textR=Archive",
      })
    }

    try {
      const apiUrl = `https://api.nekorinn.my.id/maker/ba-logo?textL=${encodeURIComponent(textL)}&textR=${encodeURIComponent(textR)}`
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
        message: "Gagal membuat BA logo",
        error: err.message,
      })
    }
  })
}
