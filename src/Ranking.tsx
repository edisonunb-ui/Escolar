
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { perguntasComLogicaInvertida } from './perguntas';

interface RankingData {
  nome: string;
  pontuacaoPercentual: number;
  numAvaliacoes: number;
}

const Medalha: React.FC<{ posicao: number }> = ({ posicao }) => {
  const medalhas: { [key: number]: string } = {
    1: '🥇',
    2: '🥈',
    3: '🥉',
  };

  if (posicao <= 3) {
    return <span className="text-2xl" role="img" aria-label={`Posição ${posicao}`}>{medalhas[posicao]}</span>;
  }
  return <span className="font-bold text-lg text-gray-500">{posicao}</span>;
};


export default function Ranking() {
  const [dadosCreches, setDadosCreches] = useState<RankingData[]>([]);
  const [dadosEscolas, setDadosEscolas] = useState<RankingData[]>([]);
  const [abaAtiva, setAbaAtiva] = useState<'creches' | 'escolas'>('creches');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calcularRanking = (dadosPesquisas: any[]): RankingData[] => {
      if (!dadosPesquisas.length) return [];

      const agregador: { [key: string]: { pontosConquistados: number, totalPerguntasRespondidas: number, numAvaliacoes: number } } = {};

      dadosPesquisas.forEach(pesquisa => {
        const nomeUnidade = pesquisa.nomeEscola || pesquisa.nomeCreche;
        if (!nomeUnidade) return;

        if (!agregador[nomeUnidade]) {
          agregador[nomeUnidade] = { pontosConquistados: 0, totalPerguntasRespondidas: 0, numAvaliacoes: 0 };
        }

        let pontosDaPesquisa = 0;
        let totalPerguntasDaPesquisa = 0;

        Object.entries(pesquisa.respostas || {}).forEach(([chave, valor]: [string, any]) => {
          if (valor && typeof valor.conforme === 'boolean') {
            totalPerguntasDaPesquisa++;
            if (perguntasComLogicaInvertida.has(chave)) {
              if (valor.conforme === false) {
                pontosDaPesquisa++;
              }
            } else {
              if (valor.conforme === true) {
                pontosDaPesquisa++;
              }
            }
          }
        });

        if (totalPerguntasDaPesquisa > 0) {
          agregador[nomeUnidade].pontosConquistados += pontosDaPesquisa;
          agregador[nomeUnidade].totalPerguntasRespondidas += totalPerguntasDaPesquisa;
          agregador[nomeUnidade].numAvaliacoes++;
        }
      });

      const ranking = Object.keys(agregador).map(nome => {
        const dados = agregador[nome];
        const pontuacaoPercentual = dados.totalPerguntasRespondidas > 0
          ? (dados.pontosConquistados / dados.totalPerguntasRespondidas) * 100
          : 0;

        return {
          nome: nome,
          pontuacaoPercentual: parseFloat(pontuacaoPercentual.toFixed(2)),
          numAvaliacoes: dados.numAvaliacoes,
        };
      });

      return ranking.sort((a, b) => b.pontuacaoPercentual - a.pontuacaoPercentual);
    };
    
    const fetchDados = async () => {
      setLoading(true);
      try {
        const diligenciasSnapshot = await getDocs(collection(db, 'diligencias'));

        const dadosCrecheDocs: any[] = [];
        const dadosEscolaDocs: any[] = [];

        diligenciasSnapshot.docs.forEach(doc => {
          const data = doc.data();
          if (data.tipificacao === 'Creche') {
            dadosCrecheDocs.push(data);
          } else {
            dadosEscolaDocs.push(data);
          }
        });

        setDadosCreches(calcularRanking(dadosCrecheDocs));
        setDadosEscolas(calcularRanking(dadosEscolaDocs));

      } catch (err) {
        console.error("Erro ao buscar dados para o ranking:", err);
        setError('Falha ao carregar os dados para o ranking.');
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  const getBarColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const renderRankingList = (dados: RankingData[]) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="grid grid-cols-12 gap-x-4 bg-gray-50 px-6 py-4 font-bold text-gray-500 text-sm uppercase tracking-wider border-b border-gray-200">
        <div className="col-span-1 text-center">Pos.</div>
        <div className="col-span-7">Unidade</div>
        <div className="col-span-4">Pontuação</div>
      </div>

      {dados.length === 0 ? (
        <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Sem dados</h3>
            <p className="mt-1 text-sm text-gray-500">Nenhuma avaliação foi encontrada para esta categoria ainda.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {dados.map((item, index) => (
            <li key={item.nome} className="grid grid-cols-12 gap-x-4 px-6 py-4 items-center transition-colors duration-200 hover:bg-gray-50">
              <div className="col-span-1 text-center">
                <Medalha posicao={index + 1} />
              </div>
              <div className="col-span-7">
                <p className="text-md font-semibold text-gray-800 truncate">{item.nome}</p>
                <p className="text-xs text-gray-500">{item.numAvaliacoes} {item.numAvaliacoes === 1 ? 'avaliação' : 'avaliações'}</p>
              </div>
              <div className="col-span-4 flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className={`${getBarColor(item.pontuacaoPercentual)} h-4 rounded-full text-white text-xs flex items-center justify-center`}
                    style={{ width: `${item.pontuacaoPercentual}%` }}
                  >
                   {item.pontuacaoPercentual >= 20 && `${item.pontuacaoPercentual.toFixed(1)}%`}
                  </div>
                </div>
                 {item.pontuacaoPercentual < 20 && <span className="ml-2 text-xs font-semibold text-gray-600">{`${item.pontuacaoPercentual.toFixed(1)}%`}</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Ranking de Conformidade</h1>
            <p className="mt-2 text-md text-gray-600">Visão geral do desempenho das unidades</p>
        </header>

        {loading && <div className="text-center text-gray-600"><div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mx-auto"></div><p className="mt-2">Carregando ranking...</p></div>}
        {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}

        {!loading && !error && (
          <div className="space-y-6">
            <div className="flex justify-center bg-white p-1.5 rounded-xl shadow-sm sticky top-4 z-10">
              <button
                onClick={() => setAbaAtiva('creches')}
                className={`w-1/2 py-2.5 text-center font-semibold rounded-lg transition-all duration-300 ${ 
                  abaAtiva === 'creches' 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-gray-500 hover:bg-blue-50'}`}
              >
                CRECHES
              </button>
              <button
                onClick={() => setAbaAtiva('escolas')}
                className={`w-1/2 py-2.5 text-center font-semibold rounded-lg transition-all duration-300 ${
                  abaAtiva === 'escolas'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-500 hover:bg-blue-50'}`}
              >
                ESCOLAS
              </button>
            </div>
            <div>
              {abaAtiva === 'creches'
                ? renderRankingList(dadosCreches)
                : renderRankingList(dadosEscolas)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
