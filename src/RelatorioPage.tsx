
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import Relatorio from './Relatorio';

function RelatorioPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('ID da diligência não fornecido.');
      setLoading(false);
      return;
    }

    const fetchDiligencia = async () => {
      try {
        const docRef = doc(db, 'diligencias', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Nenhuma diligência encontrada com este ID.');
        }
      } catch (err) {
        console.error("Erro ao buscar diligência:", err);
        setError('Falha ao carregar os dados da diligência.');
      } finally {
        setLoading(false);
      }
    };

    fetchDiligencia();
  }, [id]);

  if (loading) {
    return <div className="text-center p-8">Carregando relatório...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return <Relatorio data={data} />;
}

export default RelatorioPage;
