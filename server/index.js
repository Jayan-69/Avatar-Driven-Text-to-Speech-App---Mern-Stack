const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Multiple TTS API integration with fallback options
const axios = require('axios');

app.post('/generate-speech', async (req, res) => {
    const { text, voice } = req.body;
    if (!text || !voice) {
        return res.status(400).json({ error: 'Text and voice are required.' });
    }
    
    try {
        // Primary option: VoiceRSS API
        const apiKey = '8c247fd383ee4034a202245672890926';
        const language = 'en-us';
        const voiceMap = {
            male: 'John',
            female: 'Mary'
        };
        const voiceName = voiceMap[voice] || 'John';
        
        // Create URLs for both primary and fallback services
        const voiceRssUrl = `https://api.voicerss.org/?key=${apiKey}&hl=${language}&v=${voiceName}&src=${encodeURIComponent(text)}`;
        
        // Fallback option: Free TTS API
        const freeTtsVoice = voice === 'male' ? 'en_us_001' : 'en_us_002';
        const fallbackUrl = `https://tiktok-tts.weilnet.workers.dev/api/generation?text=${encodeURIComponent(text)}&voice=${freeTtsVoice}`;
        
        // Always provide both URLs but alternate which one is primary based on API status
        let primaryProvider = 'voicerss';
        let primaryUrl = voiceRssUrl;
        let secondaryUrl = fallbackUrl;

        // Simple check for VoiceRSS - we'll use fallback anyway if it fails
        try {
            await axios.head(voiceRssUrl, { timeout: 1500 });
            console.log('VoiceRSS API check succeeded');
        } catch (err) {
            console.log('VoiceRSS API check failed, switching to fallback as primary');
            primaryProvider = 'freettsapi';
            primaryUrl = fallbackUrl;
            secondaryUrl = voiceRssUrl;
        }
        
        // Return both URLs to client for maximum reliability
        return res.json({ 
            audioUrl: primaryUrl,
            fallbackUrl: secondaryUrl,
            provider: primaryProvider
        });
    } catch (error) {
        console.error('Error generating speech:', error);
        return res.status(500).json({ error: 'Speech generation failed' });
    }
});

app.get('/', (req, res) => {
    res.send('Avatar-Driven TTS App Backend');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
