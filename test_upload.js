const fs = require('fs');

(async () => {
    try {
        const CLOUD_NAME = 'drwg0adxt';
        const UPLOAD_PRESET = 'fotos_diligencias';
        const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
        
        console.log("Testando URL:", url);
        
        // Criar um DataURL dummy de 1x1 pixel transpartente PNG (base64)
        const dummyImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

        const formData = new FormData();
        formData.append('file', dummyImage);
        formData.append('upload_preset', UPLOAD_PRESET);

        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error("❌ ERRO DO CLOUDINARY:", data);
        } else {
            console.log("✅ SUCESSO DO CLOUDINARY:", data.secure_url);
        }
    } catch(e) {
        console.error("❌ Exceção gerada:", e);
    }
})();
