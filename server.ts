import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
app.use(express.json({ limit: "15mb" }));

const PORT = 3000;

// Initialize Gemini API Client
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("Warning: GEMINI_API_KEY environment variable is not set. Ensure it is configured in Secrets.");
}

const ai = new GoogleGenAI({
  apiKey: apiKey || "",
  httpOptions: {
    headers: {
      "User-Agent": "dnd-ai-game",
    },
  },
});

// A healthy check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// JSON Schema for adventure outcomes
const adventureResponseSchema = {
  type: Type.OBJECT,
  properties: {
    storyText: {
      type: Type.STRING,
      description: "The narrative description of what happens in this scene, the results of the player's choice, and the new setup. Write in rich, immersive prose."
    },
    options: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          text: { type: Type.STRING, description: "A distinct, engaging choice for the player." }
        },
        required: ["id", "text"]
      },
      description: "A list of 2 to 4 choices of what the player can do next."
    },
    inventory: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "The full updated list of inventory items the player holds after this event. Be logical - items can be gained, lost, or consumed."
    },
    currentQuest: {
      type: Type.STRING,
      description: "The current primary quest/objective, updated reflecting any changes in the narrative."
    },
    detailedVisualPrompt: {
      type: Type.STRING,
      description: "A very detailed, artistic description of this scene, characters, and environment to serve as an image generator prompt. It must explicitly include details of the setting and visual character consistency to match the chosen art style."
    },
    sceneTitle: {
      type: Type.STRING,
      description: "A short, atmospheric title for this scene (e.g., 'The Whisper Grotto')."
    },
    ambientTone: {
      type: Type.STRING,
      description: "The emotional tone of this scene (e.g., mysterious, epic, tense, peaceful, eerie) for UI color adaptation."
    }
  },
  required: ["storyText", "options", "inventory", "currentQuest", "detailedVisualPrompt", "sceneTitle", "ambientTone"]
};

// POST Route: Start a new adventure
app.post("/api/adventure/start", async (req, res) => {
  try {
    const { setting, artStyle, characterDetails } = req.body;

    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API key is not configured in the application environment." });
    }

    const systemInstruction = `You are an elite Choose-Your-Own-Adventure game master. 
Your goal is to build an infinite, rich, text-based interactive adventure.
The user specifies a SETTING, an ART STYLE for the visuals, and CHARACTER DETAILS.

Core directives:
1. Choices must genuinely alter the plot. There are no pre-determined outcomes.
2. Track the inventory and quest states. Update them automatically when items are found, earned, given, or used/consumed in the story.
3. Every scene MUST include a highly descriptive "detailedVisualPrompt" that:
   - Employs the specified ART STYLE: ${artStyle}.
   - Keeps the character design consistent throughout the journey by describing physical details, clothing, or prominent items explicitly, matching: ${characterDetails}.
   - Focuses on a single cohesive scene representing the narrative.
4. Output strictly valid JSON conforming exactly to the requested schema.`;

    const prompt = `Start a brand new adventure.
Setting: ${setting}
Art Style: ${artStyle}
Character Details: ${characterDetails}

Initialize the story, set up the initial scenario, describe the beginning environment, provide initial choices, initialize the inventory (give 1 initial logical starting item relative to the background), and define the starting quest.
Conform exactly to the JSON output schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: adventureResponseSchema,
        temperature: 1.0,
      }
    });

    if (!response.text) {
      throw new Error("Empty response from AI engine");
    }

    const data = JSON.parse(response.text.trim());
    res.json(data);
  } catch (error: any) {
    console.error("Error starting adventure:", error);
    res.status(500).json({ error: error.message || "Failed to start adventure." });
  }
});

// POST Route: Next step in the adventure
app.post("/api/adventure/next", async (req, res) => {
  try {
    const { 
      setting, 
      artStyle, 
      characterDetails, 
      history, 
      chosenOption, 
      inventory, 
      currentQuest 
    } = req.body;

    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API key is not configured in the application environment." });
    }

    const systemInstruction = `You are an elite Choose-Your-Own-Adventure game master.
The user is in a stateful, infinite choose-your-own-adventure game.
The current settings are:
- Setting: ${setting}
- Art Style: ${artStyle}
- Character Details: ${characterDetails}

Core directives:
1. Progress the story logically based on the player's action (chosenOption).
2. The choice must genuinely alter the narrative path. Let actions have real consequences (both positive and risky!).
3. Update the inventory logically. If they use an item, remove it. If they find one, add it.
4. Update the current quest/objective if appropriate.
5. Create a highly detailed visual prompt for the scene. Always incorporate the chosen art style (${artStyle}) and keep the character design consistent (${characterDetails}).
6. Return structured JSON conforming to the schema.`;

    const prompt = `
=== STORY HISTORY ===
${history.slice(-6).map((h: any) => `Scene: ${h.sceneTitle}\nNarrative: ${h.storyText}\nChoice Made: ${h.choiceMade}`).join("\n\n")}

=== CURRENT GAME STATE ===
- Inventory: [${(inventory || []).join(", ")}]
- Current Quest: "${currentQuest}"
- Chosen Action: "${chosenOption}"

Describe the outcome of this action and the next scene. Update the inventory and quest appropriately. Create the next options. Ensure alignment with the JSON output schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: adventureResponseSchema,
        temperature: 1.0,
      }
    });

    if (!response.text) {
      throw new Error("Empty response from AI engine");
    }

    const data = JSON.parse(response.text.trim());
    res.json(data);
  } catch (error: any) {
    console.error("Error progressing adventure:", error);
    res.status(500).json({ error: error.message || "Failed to progress adventure." });
  }
});

// POST Route: Generate scene image real-time
app.post("/api/adventure/image", async (req, res) => {
  try {
    const { detailedVisualPrompt, artStyle } = req.body;

    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API key is not configured." });
    }

    console.log("Generating image with prompt:", detailedVisualPrompt);

    // Call real-time image generator using gemini-2.5-flash-image
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            text: `${detailedVisualPrompt}. Masterpiece, high-fidelity, highly detailed, capturing the exact requested atmosphere: ${artStyle}`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    });

    let base64Image = "";

    if (response?.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Image = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!base64Image) {
      throw new Error("No image data returned from generator.");
    }

    res.json({ imageUrl: base64Image, isFallback: false });
  } catch (error: any) {
    console.error("Image generation error, failing over gracefully:", error.message);
    
    // Provide a beautiful fallback visual URL using Picsum with seeds to maintain visual flow
    // Seed it based on the prompt so it changes when scenes change but stays cached for the same scene
    const seed = encodeURIComponent(req.body.detailedVisualPrompt?.slice(0, 30) || "adventure");
    const fallbackUrl = `https://picsum.photos/seed/${seed}/800/450?blur=1`;

    res.json({ 
      imageUrl: fallbackUrl, 
      isFallback: true, 
      error: error.message || "Image generation failed" 
    });
  }
});

// Vite & Static file serving setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
