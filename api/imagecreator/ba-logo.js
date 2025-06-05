const axios = require("axios");

module.exports = (app) => {
  async function generateBxLogo(textL, textR, apikey) {
    try {
      const response = await axios.get(`https://api.nekorinn.my.id/maker/ba-logo?textL=${encodeURIComponent(textL)}&textR=${encodeURIComponent(textR)}&apikey=${apikey}`, {
        headers: {
          "User -Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      if (!response.data || !response.data.result) {
        throw new Error("Invalid response from BxLogo API");
      }

      return response.data.result; // Assuming the result contains the image URL
    } catch (err) {
      throw new Error("Failed to fetch from BxLogo API: " + err.message);
    }
  }

  app.get("/maker/ba-logo", async (req, res) => {
    const { textL, textR, apikey } = req.query;

    if (!textL || !textR) {
      return res.json({ status: false, error: "Both textL and textR are required" });
    }

    if (!apikey || !global.apikey.includes(apikey)) {
      return res.json({ status: false, error: "Invalid or missing API key" });
    }

    try {
      const result = await generateBxLogo(textL, textR, apikey);
      res.status(200).json({
        status: true,
        result,
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
        
