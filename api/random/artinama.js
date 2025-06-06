const axios = require("axios")

module.exports = (app) => {
  app.get("/primbon/artinama", async (req, res) => {
    try {
      const { apikey, nama } = req.query

      if (!global.apikey.includes(apikey)) {
        return res.json({ status: false, error: "Apikey invalid" })
      }

      if (!nama) {
        return res.json({ status: false, error: "Parameter 'nama' is required" })
      }

      const apiUrl = `https://api.siputzx.my.id/api/primbon/artinama?nama=${encodeURIComponent(nama)}`

      const response = await axios.get(apiUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      })

      if (!response.data) {
        throw new Error("Invalid response from Arti Nama API")
      }

      res.status(200).json({
        status: true,
        result: response.data,
      })
    } catch (error) {
      res.status(500).json({
        status: false,
        error: `Error: ${error.message}`,
      })
    }
  })
    }
          
