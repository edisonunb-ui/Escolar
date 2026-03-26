/**
 * Este arquivo inicialmente enviava fotos para o Firebase Storage.
 * Como o Firebase Storage exige faturamento no plano Spark para o bucket padrão em alguns casos,
 * migramos o envio de fotos de forma 100% gratuita para o Cloudinary usando a REST API pública.
 */

export const uploadImage = async (path: string, imageDataUrl: string): Promise<string> => {
  const CLOUD_NAME = 'drwg0sdat';
  const UPLOAD_PRESET = 'fotos_diligências';
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  try {
    console.log(`Iniciando upload para Cloudinary...`);

    const formData = new FormData();
    formData.append('file', imageDataUrl);
    formData.append('upload_preset', UPLOAD_PRESET);

    // Opcional: tenta usar o começo do path como pasta no Cloudinary
    const destFolder = path.includes('/') ? path.split('/')[0] : 'diligencias';
    formData.append('folder', destFolder);

    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro da API do Cloudinary:", errorData);
      throw new Error(errorData.error?.message || 'Falha ao enviar a imagem para o Cloudinary.');
    }

    const data = await response.json();
    console.log('Upload para o Cloudinary concluído com sucesso!', data.secure_url);

    // Retorna a URL final da imagem hospedada
    return data.secure_url;
  } catch (error: any) {
    console.error("Erro CRÍTICO no upload da imagem:", error);
    throw new Error(error.message || 'Falha ao enviar a imagem para o servidor.');
  }
};
