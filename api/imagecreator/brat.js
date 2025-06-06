const axios = require("axios")
const cheerio = require("cheerio")
const FormData = require("form-data")

async function generateBrat(text, mode = "white") {
  try {
    // First request to get the CSRF token and cookies
    const initialResponse = await axios.get("https://bratgenerator.net/id", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    // Extract cookies from the response
    const cookies = initialResponse.headers["set-cookie"]
      ? initialResponse.headers["set-cookie"].map((cookie) => cookie.split(";")[0]).join("; ")
      : ""

    // Extract CSRF token from the HTML
    const $ = cheerio.load(initialResponse.data)
    const csrfToken = $('meta[name="csrf-token"]').attr("content")

    if (!csrfToken) {
      throw new Error("Failed to extract CSRF token")
    }

    // Prepare form data for the POST request
    const formData = new FormData()
    formData.append("text", text)
    formData.append("mode", mode === "green" ? "green" : "white") // Default to white if not specified
    formData.append("_token", csrfToken)

    // Make the POST request to generate the brat image
    const generateResponse = await axios.post("https://bratgenerator.net/id/generate", formData, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Cookie: cookies,
        "X-CSRF-TOKEN": csrfToken,
        ...formData.getHeaders(),
      },
      responseType: "arraybuffer",
    })

    return generateResponse.data
  } catch (error) {
    console.error("Error generating brat image:", error)
    throw error
  }
}

module.exports = (app) => {
  app.get("/imagecreator/brat", async (req, res) => {
    try {
      const { apikey, text, mode } = req.query

      if (!global.apikey.includes(apikey)) {
        return res.json({ status: false, error: "Apikey invalid" })
      }

      if (!text) {
        return res.json({ status: false, error: "Text is required" })
      }

      const imageBuffer = await generateBrat(text, mode)

      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": imageBuffer.length,
      })

      res.end(imageBuffer)
    } catch (error) {
      res.status(500).json({
        status: false,
        error: `Error: ${error.message}`,
      })
    }
  })

  app.get("/imagecreator/bratvideo", async (req, res) => {
    try {
      const { apikey, text } = req.query

      if (!global.apikey.includes(apikey)) {
        return res.json({ status: false, error: "Apikey invalid" })
      }

      // For now, we'll return an error since the new API doesn't support video
      return res.status(501).json({
        status: false,
        error: "Brat video feature is currently unavailable with the new API",
      })
    } catch (error) {
      res.status(500).json({
        status: false,
        error: `Error: ${error.message}`,
      })
    }
  })
}
