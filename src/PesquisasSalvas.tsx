
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from './firebaseConfig';
import { collection, getDocs, Timestamp, doc, deleteDoc } from 'firebase/firestore';

interface Pesquisa {
  id: string;
  nome: string;
  tipo: 'Creche' | 'Escola';
  data: string;
  timestamp: Timestamp;
}

export default function PesquisasSalvas() {
  const [pesquisas, setPesquisas] = useState<Pesquisa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);

  const fetchPesquisas = async () => {
    setLoading(true);
    setError(null);
    try {
      const diligenciasRef = collection(db, 'diligencias');
      const diligenciasSnapshot = await getDocs(diligenciasRef);
      
      const todasPesquisas = diligenciasSnapshot.docs.map(doc => {
        const data = doc.data();
        const tipo = data.tipificacao === 'Creche' ? 'Creche' : 'Escola';
        const nome = data.nomeCreche || data.nomeEscola || 'Sem Nome';
        
        return {
          id: doc.id,
          nome,
          tipo: tipo as 'Creche' | 'Escola',
          data: data.timestamp?.toDate().toLocaleDateString('pt-BR') || 'Data não disponível',
          timestamp: data.timestamp
        };
      });
      todasPesquisas.sort((a, b) => {
        if (a.timestamp && b.timestamp) {
          return b.timestamp.toMillis() - a.timestamp.toMillis();
        }
        return 0;
      });

      setPesquisas(todasPesquisas);
    } catch (err) {
      console.error("Erro ao buscar pesquisas:", err);
      setError('Falha ao carregar os dados. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPesquisas();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'diligencias', id));
      setPesquisas(pesquisas.filter(p => p.id !== id));
    } catch (error) {
      console.error("Erro ao excluir pesquisa:", error);
      setError("Falha ao excluir a pesquisa. Por favor, tente novamente.");
    } finally {
      setConfirmingDelete(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto bg-background text-text-primary">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-text-primary">📝 Pesquisas Salvas</h1>
      
      {loading && <p className="text-center text-text-secondary">Carregando pesquisas...</p>}
      {error && 
        <div className="text-center p-4 my-4 text-red-300 bg-red-900/50 rounded-lg">
          <p>{error}</p>
        </div>
      }

      {!loading && !error && (
        <div className="space-y-4">
          {pesquisas.length === 0 ? (
            <div className="text-center p-6 sm:p-10 border-2 border-dashed border-gray-600 rounded-lg bg-card">
                <h2 className="text-xl font-semibold text-text-primary">Nenhuma pesquisa foi encontrada</h2>
                <p className="text-text-secondary mt-2">Você já pode começar a fazer novas avaliações.</p>
                <Link to="/" className="mt-6 inline-block bg-primary text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:brightness-90 transition-colors">
                    Ir para a Página Inicial
                </Link>
            </div>
          ) : (
            pesquisas.map((pesquisa) => (
              <div key={pesquisa.id} className="border border-gray-700 rounded-lg p-4 shadow-sm flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-card hover:brightness-110 transition-all">
                <Link to={`/pesquisa/${pesquisa.id}`} className="flex-grow w-full">
                  <div className="flex items-center">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-primary/20 text-primary`}>
                      {pesquisa.tipo}
                    </span>
                    <h2 className="text-lg font-semibold ml-4 text-text-primary truncate">{pesquisa.nome}</h2>
                  </div>
                  <div className="text-sm text-text-secondary mt-2">Realizada em: {pesquisa.data}</div>
                </Link>
                <div className="flex items-center space-x-2 self-end md:self-center">
                  {confirmingDelete === pesquisa.id ? (
                    <>
                      <button
                        onClick={() => handleDelete(pesquisa.id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded transition-colors text-sm whitespace-nowrap"
                      >
                        Confirmar Exclusão
                      </button>
                      <button
                        onClick={() => setConfirmingDelete(null)}
                        className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-3 rounded transition-colors text-sm"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmingDelete(pesquisa.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                      aria-label={`Excluir pesquisa de ${pesquisa.nome}`}
                    >
                      Excluir
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
