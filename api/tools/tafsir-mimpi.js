const axios = require("axios")

module.exports = (app) => {
  app.get("/tools/tafsir-mimpi", async (req, res) => {
    try {
      const { apikey, mimpi } = req.query

      if (!global.apikey.includes(apikey)) {
        return res.json({ status: false, error: "Apikey invalid" })
      }

      if (!mimpi) {
        return res.json({ status: false, error: "Parameter 'mimpi' is required" })
      }

      const apiUrl = `https://api.nekorinn.my.id/primbon/tafsir-mimpi?mimpi=${encodeURIComponent(mimpi)}`

      const response = await axios.get(apiUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      })

      if (!response.data) {
        throw new Error("Invalid response from Tafsir Mimpi API")
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
