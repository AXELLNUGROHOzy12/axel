const axios = require("axios")

module.exports = (app) => {
  app.get("/tools/ai-story-generator", async (req, res) => {
    const { apikey, prompt, length, genre } = req.query

    if (!global.apikey.includes(apikey)) {
      return res.json({ status: false, error: "Apikey invalid" })
    }

    if (!prompt) {
      return res.status(400).json({
        status: false,
        message:
          'Parameter "prompt" wajib diisi. Contoh: /tools/ai-story-generator?apikey=yourkey&prompt=A brave knight on a quest',
      })
    }

    try {
      // Using a story generation approach similar to other AI endpoints
      const storyPrompt = buildStoryPrompt(prompt, length, genre)

      // You can replace this with any AI service that supports story generation
      // For now, I'll use a generic AI endpoint approach
      const apiUrl = `https://api.nekorinn.my.id/ai/gpt-turbo?text=${encodeURIComponent(storyPrompt)}`

      const response = await axios.get(apiUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      })

      if (!response.data || !response.data.result) {
        throw new Error("Invalid response from AI Story Generator API")
      }

      // Format the story response
      const story = formatStoryResponse(response.data.result, prompt)

      res.status(200).json({
        status: true,
        result: {
          title: generateStoryTitle(prompt),
          prompt: prompt,
          genre: genre || "General",
          length: length || "Medium",
          story: story,
          word_count: story.split(" ").length,
          generated_at: new Date().toISOString(),
        },
      })
    } catch (error) {
      res.status(500).json({
        status: false,
        error: `Error generating story: ${error.message}`,
      })
    }
  })

  // Helper function to build story prompt
  function buildStoryPrompt(userPrompt, length = "medium", genre = "general") {
    const lengthInstructions = {
      short: "Write a short story (200-400 words)",
      medium: "Write a medium-length story (400-800 words)",
      long: "Write a long story (800-1200 words)",
    }

    const genreInstructions = {
      fantasy: "in the fantasy genre with magical elements",
      scifi: "in the science fiction genre with futuristic elements",
      mystery: "in the mystery genre with suspenseful elements",
      romance: "in the romance genre with emotional elements",
      horror: "in the horror genre with scary elements",
      adventure: "in the adventure genre with exciting elements",
      comedy: "in the comedy genre with humorous elements",
      drama: "in the drama genre with emotional depth",
      general: "with engaging and creative elements",
    }

    const lengthInstruction = lengthInstructions[length.toLowerCase()] || lengthInstructions["medium"]
    const genreInstruction = genreInstructions[genre.toLowerCase()] || genreInstructions["general"]

    return `${lengthInstruction} ${genreInstruction} based on this prompt: "${userPrompt}". Make it creative, engaging, and well-structured with proper paragraphs. Include dialogue and descriptive details to bring the story to life.`
  }

  // Helper function to format story response
  function formatStoryResponse(rawStory, originalPrompt) {
    // Clean up the story text
    let formattedStory = rawStory.trim()

    // Ensure proper paragraph breaks
    formattedStory = formattedStory.replace(/\n\s*\n/g, "\n\n")

    // Remove any unwanted prefixes that might come from AI response
    formattedStory = formattedStory.replace(/^(Story:|Here's a story:|Here is a story:)/i, "").trim()

    return formattedStory
  }

  // Helper function to generate story title
  function generateStoryTitle(prompt) {
    // Extract key words from prompt to create a title
    const words = prompt.split(" ").filter((word) => word.length > 3)
    const keyWords = words.slice(0, 3).map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())

    return keyWords.length > 0 ? keyWords.join(" ") : "Generated Story"
  }
        }
        
