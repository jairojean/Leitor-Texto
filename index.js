const express = require('express');
const googleTTS = require('google-tts-api');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota para gerar o áudio do texto
app.get('/audio', async (req, res) => {
    const texto = req.query.texto;
    
    // Gera a URL do áudio
    const urlAudio = googleTTS.getAudioUrl(texto, {
        lang: 'pt',
        slow: false,
        host: 'https://translate.google.com',
    });

    try {
        // Requisição para obter o áudio diretamente do Google TTS
        const audioResponse = await axios.get(urlAudio, { responseType: 'arraybuffer' });
        
        // Define o cabeçalho correto para retorno de áudio
        res.set('Content-Type', 'audio/mpeg');
        res.send(audioResponse.data);
    } catch (error) {
        console.error('Erro ao obter o áudio:', error);
        res.status(500).send('Erro ao gerar áudio');
    }
});

// Rota para servir o HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
