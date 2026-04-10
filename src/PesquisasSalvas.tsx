import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from './firebaseConfig';
import { collection, getDocs, Timestamp } from 'firebase/firestore';

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
  const [abaAtiva, setAbaAtiva] = useState<'creches' | 'escolas'>('creches');

  const fetchPesquisas = async () => {
    setLoading(true);
    setError(null);
    try {
      const diligenciasRef = collection(db, 'diligencias');
      const diligenciasSnapshot = await getDocs(diligenciasRef);
      
      const todasPesquisas = diligenciasSnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        const tipo = data.tipificacao === 'Creche' ? 'Creche' : 'Escola';
        const nome = data.nomeCreche || data.nomeEscola || 'Sem Nome';
        
        return {
          id: docSnap.id,
          nome,
          tipo: tipo as 'Creche' | 'Escola',
          data: data.timestamp?.toDate().toLocaleDateString('pt-BR') || 'Data não disponível',
          timestamp: data.timestamp
        };
      });
      todasPesquisas.sort((a, b) => {
        const timeA = a.timestamp?.toMillis() || 0;
        const timeB = b.timestamp?.toMillis() || 0;
        return timeB - timeA;
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

  const pesquisasCreches = pesquisas.filter(p => p.tipo === 'Creche');
  const pesquisasEscolas = pesquisas.filter(p => p.tipo === 'Escola');
  const listaAtiva = abaAtiva === 'creches' ? pesquisasCreches : pesquisasEscolas;
  const labelAtiva = abaAtiva === 'creches' ? 'creches' : 'escolas';

  const renderList = (lista: Pesquisa[]) => (
    <div className="space-y-4">
      {lista.length === 0 ? (
        <div className="text-center p-6 sm:p-10 border-2 border-dashed border-gray-600 rounded-lg bg-card">
            <h2 className="text-xl font-semibold text-text-primary">Nenhuma avaliação de {labelAtiva} encontrada</h2>
            <p className="text-text-secondary mt-2">Você já pode começar a fazer novas avaliações.</p>
            <Link to="/pesquisa" className="mt-6 inline-block bg-primary text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:brightness-90 transition-colors">
                Iniciar Avaliação
            </Link>
        </div>
      ) : (
        lista.map((pesquisa) => (
          <div key={pesquisa.id} className="border border-gray-700 rounded-lg p-4 shadow-sm flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-card hover:brightness-110 transition-all">
            <Link to={`/pesquisa/${pesquisa.id}`} className="flex-grow w-full">
              <div className="flex items-center">
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/20 text-primary">
                  {pesquisa.tipo}
                </span>
                <h2 className="text-lg font-semibold ml-4 text-text-primary truncate">{pesquisa.nome}</h2>
              </div>
              <div className="text-sm text-text-secondary mt-2">Realizada em: {pesquisa.data}</div>
            </Link>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto bg-background text-text-primary">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-text-primary">📝 Avaliações Salvas</h1>
      
      {loading && <p className="text-center text-text-secondary">Carregando pesquisas...</p>}
      {error && 
        <div className="text-center p-4 my-4 text-red-300 bg-red-900/50 rounded-lg">
          <p>{error}</p>
        </div>
      }

      {!loading && !error && (
        <div className="space-y-6">
          {/* Abas Creches / Escolas */}
          <div className="flex justify-center bg-card p-1.5 rounded-xl shadow-sm sticky top-4 z-10">
            <button
              onClick={() => { setAbaAtiva('creches'); }}
              className={`w-1/2 py-2.5 text-center font-semibold rounded-lg transition-all duration-300 ${
                abaAtiva === 'creches'
                  ? 'bg-primary text-white shadow'
                  : 'text-text-secondary hover:bg-gray-700'
              }`}
            >
              CRECHES ({pesquisasCreches.length})
            </button>
            <button
              onClick={() => { setAbaAtiva('escolas'); }}
              className={`w-1/2 py-2.5 text-center font-semibold rounded-lg transition-all duration-300 ${
                abaAtiva === 'escolas'
                  ? 'bg-primary text-white shadow'
                  : 'text-text-secondary hover:bg-gray-700'
              }`}
            >
              ESCOLAS ({pesquisasEscolas.length})
            </button>
          </div>

          {renderList(listaAtiva)}
        </div>
      )}
    </div>
  );
}
