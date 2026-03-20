
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { app } from './firebaseConfig'; // Importa a instância do app Firebase

const storage = getStorage(app);

/**
 * Faz o upload de uma imagem em formato Data URL (base64) para o Firebase Storage.
 * 
 * @param path - O caminho no Storage onde a imagem será salva (ex: 'avaliacoes/escola-xyz/foto.jpg')
 * @param imageDataUrl - A string da imagem em formato Data URL.
 * @returns A URL de download da imagem após o upload.
 */
export const uploadImage = async (path: string, imageDataUrl: string): Promise<string> => {
  const storageRef = ref(storage, path);
  try {
    // Faz o upload da string em formato data_url
    const snapshot = await uploadString(storageRef, imageDataUrl, 'data_url');
    console.log('Uploaded a data_url string!', snapshot);

    // Pega a URL de download
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Erro no upload da imagem:", error);
    throw new Error('Falha ao enviar a imagem.');
  }
};
