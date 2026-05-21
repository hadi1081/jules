require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

let ai;
if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

app.post('/api/tutor/chat', async (req, res) => {
    try {
        const { message, className, subject, stream } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!ai) {
            console.warn("GEMINI_API_KEY not configured. Returning fallback response.");
            return res.json({
                reply: `(Offline Mode) You asked about ${subject} in ${className}. Your message was: "${message}"`
            });
        }

        const systemInstruction = `You are an Expert Bangladeshi Academic Tutor.
You are tutoring a student in ${className}.
The subject they are asking about is ${subject}.
${stream ? `Their stream/sector is ${stream}.` : ''}

CRITICAL INSTRUCTIONS:
- Adapt your tone, complexity, and language strictly to the student's level.
- For primary school students (Classes 1-5), explain concepts in simple, child-friendly terms, using analogies they can understand. Primary language should be English but you can use Bangla terms if helpful.
- For higher classes (Classes 9-12), explain using appropriate academic formulas, terminology, and structured reasoning.
- Keep your answers encouraging, polite, and educational.
- Do not provide answers that are outside of the curriculum for this subject.
- Format your response in clean Markdown.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
            config: {
                systemInstruction: systemInstruction,
            }
        });

        res.json({ reply: response.text });
    } catch (error) {
        console.error("Error in /api/tutor/chat:", error);
        res.status(500).json({ error: 'Internal server error processing chat' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
