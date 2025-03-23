const express = require('express');
const googleTTS = require('google-tts-api');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
 
app.use(express.static(path.join(__dirname, 'public')));

 
app.get('/audio', async (req, res) => {
    const texto = req.query.texto;
    
 
    const urlAudio = googleTTS.getAudioUrl(texto, {
        lang: 'pt',
        slow: false,
        host: 'https://translate.google.com',
    });

    try {
  
        const audioResponse = await axios.get(urlAudio, { responseType: 'arraybuffer' });
        
      
        res.set('Content-Type', 'audio/mpeg');
        res.send(audioResponse.data);
    } catch (error) {
        console.error('Erro ao obter o áudio:', error);
        res.status(500).send('Erro ao gerar áudio');
    }
});
 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

 
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
