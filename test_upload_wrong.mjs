(async () => {
    try {
        const url = `https://api.cloudinary.com/v1_1/INVALID_CLOUD_1234/image/upload`;
        const formData = new FormData();
        formData.append('file', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
        formData.append('upload_preset', 'fotos_diligencias');

        const response = await fetch(url, { method: 'POST', body: formData });
        const data = await response.json();
        console.error("ERRO INVALID CLOUD:", JSON.stringify(data, null, 2));
    } catch(e) {
        console.error(e);
    }
})();
