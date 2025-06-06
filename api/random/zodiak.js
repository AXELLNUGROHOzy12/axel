const axios = require("axios")

module.exports = (app) => {
  app.get("/random/zodiak", async (req, res) => {
    try {
      const { apikey, zodiak } = req.query

      if (!global.apikey.includes(apikey)) {
        return res.json({ status: false, error: "Apikey invalid" })
      }

      if (!zodiak) {
        return res.json({
          status: false,
          error: "Parameter 'zodiak' is required",
          message:
            "Masukkan nama zodiak (contoh: aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagitarius, capricorn, aquarius, pisces)",
        })
      }

      const apiUrl = `https://api.siputzx.my.id/api/primbon/zodiak?zodiak=${encodeURIComponent(zodiak)}`

      const response = await axios.get(apiUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      })

      if (!response.data) {
        throw new Error("Invalid response from Zodiak API")
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
        
