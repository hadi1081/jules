require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Initialize Google OAuth Client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Initialize Gemini API
let ai;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

// ----------------------------------------------------
// AUTHENTICATION ROUTES
// ----------------------------------------------------

// Local Login (Mock Implementation)
app.post('/api/auth/local/login', (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Mock successful login
        res.json({
            success: true,
            user: {
                id: 'local_' + Date.now(),
                email: email,
                name: email.split('@')[0],
                authType: 'local'
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: 'Internal server error during login' });
    }
});

// Local Signup (Mock Implementation)
app.post('/api/auth/local/signup', (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        // Mock successful signup
        res.json({
            success: true,
            user: {
                id: 'local_' + Date.now(),
                email: email,
                name: name,
                authType: 'local'
            }
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: 'Internal server error during signup' });
    }
});

// Google Login Verification
app.post('/api/auth/google', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ error: 'Google token is required' });
        }

        // If client ID is missing/mocked, simulate a successful login for development purposes
        if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === 'your_google_oauth_client_id_here') {
            console.warn("GOOGLE_CLIENT_ID not configured. Simulating Google Login.");
            return res.json({
                success: true,
                user: {
                    id: 'google_mock_123',
                    email: 'student@example.com',
                    name: 'Google Student',
                    authType: 'google',
                    picture: 'https://ui-avatars.com/api/?name=Google+Student&background=random'
                }
            });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        res.json({
            success: true,
            user: {
                id: payload.sub,
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
                authType: 'google'
            }
        });
    } catch (error) {
        console.error("Google auth error:", error);
        res.status(401).json({ error: 'Invalid Google token' });
    }
});

// ----------------------------------------------------
// CHAT ROUTE
// ----------------------------------------------------

app.post('/api/tutor/chat', async (req, res) => {
    try {
        const { message, className, subject, stream, user } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!className || !subject) {
            return res.status(400).json({ error: 'Context (className, subject) is missing' });
        }

        const studentName = user && user.name ? user.name : "Student";

        if (!ai) {
            console.warn("GEMINI_API_KEY not configured. Returning fallback response.");
            return res.json({
                reply: `*(Offline Mode)* Hello ${studentName}! You asked about **${subject}** in **${className}**. I'm currently in offline mode, but I received your message:\n\n> "${message}"`
            });
        }

        const systemInstruction = `You are a Friendly Expert Bangladeshi Academic Tutor.
You are tutoring a student named ${studentName} who is in ${className}.
The subject they are studying right now is ${subject}.
${stream ? `Their stream/sector is ${stream}.` : ''}

CRITICAL INSTRUCTIONS:
- Act strictly as an expert, friendly academic tutor specializing in the Bangladesh National Curriculum (NCTB).
- Adapt your tone, complexity, and language strictly to the student's level.
- For primary school students (Class 1 to 5): Explain concepts in simple, child-friendly terms. Use analogies they can easily understand. You MUST use simple Bangla terms where helpful to make the student comfortable, though you can mix English and Bangla. Keep it extremely encouraging and simple.
- For Junior Secondary (Class 6-8): Use clear, intermediate-level explanations. Maintain an encouraging and structured tone.
- For higher classes (Class 9-12): Explain using appropriate academic formulas, rigorous terminology, and structured reasoning. Adapt to their specific stream (Science, Commerce, Arts) if provided.
- Do not provide answers that are outside of the curriculum for this subject.
- Format your response in clean Markdown (use bolding, bullet points, and code blocks if needed).`;

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
        res.status(500).json({ error: 'Internal server error processing chat. Please try again later.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
