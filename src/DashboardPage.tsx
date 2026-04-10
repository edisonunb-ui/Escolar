
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

interface DiligenciaResumo {
  id: string;
  nome: string;
  tipo: 'Creche' | 'Escola';
  data: string;
  timestamp?: any;
}

export default function DashboardPage() {
  const [diligencias, setDiligencias] = useState<DiligenciaResumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiligencias = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'diligencias'));
        const lista = snapshot.docs.map(docSnap => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            nome: d.nomeCreche || d.nomeEscola || 'Sem Nome',
            tipo: (d.tipificacao === 'Creche' ? 'Creche' : 'Escola') as 'Creche' | 'Escola',
            data: d.timestamp?.toDate().toLocaleDateString('pt-BR') || 'Data não disponível',
            timestamp: d.timestamp
          };
        });

        // Ordenar por data decrescente (mais recente primeiro)
        lista.sort((a, b) => {
          const timeA = a.timestamp?.toMillis() || 0;
          const timeB = b.timestamp?.toMillis() || 0;
          return timeB - timeA;
        });

        setDiligencias(lista);
      } catch (err) {
        console.error("Erro ao buscar diligências:", err);
        setError('Falha ao carregar os dados.');
      } finally {
        setLoading(false);
      }
    };
    fetchDiligencias();
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto bg-background text-text-primary">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-text-primary">📊 Dashboard de Relatórios</h1>

      {loading && <p className="text-center text-text-secondary">Carregando diligências...</p>}
      {error && (
        <div className="text-center p-4 my-4 text-red-300 bg-red-900/50 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {diligencias.length === 0 ? (
            <div className="text-center p-6 sm:p-10 border-2 border-dashed border-gray-600 rounded-lg bg-card">
              <h2 className="text-xl font-semibold text-text-primary">Nenhuma diligência encontrada</h2>
              <p className="text-text-secondary mt-2">Realize avaliações para gerar relatórios.</p>
              <Link to="/pesquisa" className="mt-6 inline-block bg-primary text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:brightness-90 transition-colors">
                Iniciar Avaliação
              </Link>
            </div>
          ) : (
            diligencias.map(d => (
              <Link
                key={d.id}
                to={`/relatorio/${d.id}`}
                className="block border border-gray-700 rounded-lg p-4 shadow-sm bg-card hover:brightness-110 transition-all"
              >
                <div className="flex items-center">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/20 text-primary">
                    {d.tipo}
                  </span>
                  <h2 className="text-lg font-semibold ml-4 text-text-primary truncate">{d.nome}</h2>
                </div>
                <div className="text-sm text-text-secondary mt-2">Realizada em: {d.data}</div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
