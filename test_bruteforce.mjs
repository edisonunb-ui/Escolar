(async () => {
    const variants = [
        'drwg0adxt', 'dzwg0adxt', 'dzwgoadxt', 'dzwghadxt', 'dzwghadao', 
        'drwgOadxt', 'dzwgOadxt', 'dzwgoadxt', 'dzw80adxt', 'drwg0adxt',
        'diwg0adxt', 'dxwg0adxt', 'dzwg0adxt'
    ];
    
    const UPLOAD_PRESET = 'fotos_diligencias';
    const dummyImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

    for (const CLOUD_NAME of variants) {
        try {
            const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
            const formData = new FormData();
            formData.append('file', dummyImage);
            formData.append('upload_preset', UPLOAD_PRESET);

            const response = await fetch(url, { method: 'POST', body: formData });
            const data = await response.json();
            
            if (data.error && data.error.message.includes('Unknown API key')) {
                // Cloud name doesn't exist
                console.log(`[${CLOUD_NAME}] -> INVÁLIDO (Unknown API key)`);
            } else if (data.error) {
                // Cloud name exists, but maybe preset is wrong or signed
                console.log(`[${CLOUD_NAME}] -> Existe! Erro específico:`, data.error.message);
            } else {
                console.log(`[${CLOUD_NAME}] -> VÁLIDO E FUNCIONAL! URL:`, data.secure_url);
            }
        } catch(e) {
            console.error(`[${CLOUD_NAME}] -> ERRO REDE:`, e.message);
        }
    }
})();
