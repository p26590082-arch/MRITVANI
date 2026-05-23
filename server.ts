import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { ai } from "./src/lib/gemini.ts";
import { Modality, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API to get stories
  app.get("/api/stories", (req, res) => {
    // We send back 50 story placeholders
    const stories = Array.from({ length: 55 }, (_, i) => ({
      id: `story-${i + 1}`,
      title: getPlaceholderTitle(i),
      category: getCategory(i),
      icon: getIcon(i),
    }));
    res.json(stories);
  });

  // API to generate/fetch full story content
  app.post("/api/story/content", async (req, res) => {
    const { id, title, language } = req.body;
    try {
      const prompt = `Write a scary horror story in ${language === 'hi' ? 'Hindi' : 'English'}. 
      The story id is ${id} and the theme title is "${title}". 
      IMPORTANT: Change the character names to sound very scary and horror-like (e.g., Damion, Elara the Pale, Karka, etc., or scary sounding Hindi names for ${language === 'hi'}).
      Make the story approximately 400-600 words.
      Format the output in Markdown.`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          temperature: 0.8,
        }
      });

      res.json({ content: result.text });
    } catch (error: any) {
      console.error("Story gen error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API for TTS
  app.post("/api/tts", async (req, res) => {
    const { text, language } = req.body;
    try {
      // Use shorter text if it's too long for TTS in one go
      const trimmedText = text.substring(0, 1000); 
      
      const prompt = `Convert the following ${language === 'hi' ? 'Hindi' : 'English'} story segment to audio narration. Narrate it in a creepy, slow, and atmospheric horror style:
      
      ${trimmedText}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: language === 'hi' ? 'Kore' : 'Charon' },
            },
          },
        },
      });

      const part = response.candidates?.[0]?.content?.parts?.[0];
      const base64Audio = part?.inlineData?.data;
      const mimeType = part?.inlineData?.mimeType || "audio/pcm;rate=24000";

      if (base64Audio) {
        res.json({ audio: base64Audio, mimeType });
      } else {
        res.status(500).json({ error: "Failed to generate audio" });
      }
    } catch (error: any) {
      console.error("TTS error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

function getPlaceholderTitle(i: number) {
  const titles = [
    "The Whispering Closet", "Midnight Footsteps", "Eyes in the Mirror", "The Weeping Willow",
    "Shadows of the Attic", "The Vanishing Hitchhiker", "Hollow Creek", "The Red Room",
    "Unheard Screams", "The Doll's Revenge", "A Graveyard Appointment", "The Cursed Diary",
    "Whispers in the Dark", "The Black Cat's Curse", "Phantom of the Opera House", "The Haunted Portrait",
    "Screams of the Silent", "The Ghostly Bride", "The Secret of the Cellar", "Night of the Howling",
    "The Foggy Bridge", "Shadows on the Wall", "The Dead Man's Clock", "Cries from the Woods",
    "The Blood-Red Moon", "Ghostly Giggles", "The Haunting of Hill House", "The Poltergeist's Prank",
    "The Silent Library", "The Giggling Ghost", "The Darkest Night", "The Phantom Rider",
    "The Creeping Terror", "The Demon's Doorway", "The Curse of the Mummy", "Screams of the Banshee",
    "The Haunted Lighthouse", "Phantom of the Lake", "The Shadow in the Corner", "The Cursed Mirror",
    "The Whispering Woods", "Night of the Living Dead", "The Haunted Asylum", "Shadowy Figures",
    "The Ghostly Train", "The Secret of the Tomb", "The Blood-Stained Floor", "The Haunting of the Old Mill",
    "Cries in the Night", "The Ghost Bride's Curse", "The Shadow's Whisper", "The Cursed Amulet",
    "The Haunted Carnival", "The Phantom of the Museum", "The Night of the Gargoyles"
  ];
  return titles[i] || `Horror Tale #${i + 1}`;
}

function getCategory(i: number) {
  const cats = ["Supernatural", "Urban Legend", "Psychological", "Ghost Story", "Possession", "Slaughter"];
  return cats[i % cats.length];
}

function getIcon(i: number) {
  const icons = ["ghost", "skull", "flame", "moon", "eye", "wind"];
  return icons[i % icons.length];
}

startServer();
