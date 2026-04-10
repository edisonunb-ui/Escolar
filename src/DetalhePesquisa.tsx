
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, DocumentData, deleteDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import QuestionarioCreche from './QuestionarioCreche';
import QuestionarioEscolar from './QuestionarioEscolar';
import RelatorioImpressao from './RelatorioImpressao';

export default function DetalhePesquisa() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pesquisa, setPesquisa] = useState<DocumentData | null>(null);
  const [tipoPesquisa, setTipoPesquisa] = useState<'Creche' | 'Escola' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [viewMode, setViewMode] = useState<'quest' | 'report'>('quest');

  useEffect(() => {
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

    if (!id) return;

    const fetchPesquisa = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'diligencias', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setPesquisa({ id: docSnap.id, ...data });
          setTipoPesquisa(data.tipificacao === 'Creche' ? 'Creche' : 'Escola');
        } else {
          setError('Nenhum documento encontrado com este ID.');
        }
      } catch (err) {
        console.error("Erro ao buscar documento:", err);
        setError('Falha ao carregar os dados da pesquisa.');
      } finally {
        setLoading(false);
      }
    };

    fetchPesquisa();
  }, [id]);

  const handlePrint = () => {
    setTimeout(() => {
        window.print();
    }, 500);
  };

  const handleDelete = async () => {
    if (!id || !tipoPesquisa) {
      setError("Não foi possível identificar a pesquisa para exclusão.");
      return;
    }

    try {
      await deleteDoc(doc(db, 'diligencias', id));
      navigate('/pesquisas-salvas');
    } catch (err) {
      console.error("Erro ao excluir pesquisa:", err);
      setError("Falha ao excluir a pesquisa. Por favor, tente novamente.");
    } finally {
      setConfirmingDelete(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto bg-background rounded-lg shadow">
        {/* Estilos de impressão agora centralizados no print.css */}

      {loading && <p className="text-center text-text-secondary no-print">Carregando dados...</p>}
      {error && (
        <div className="text-center p-4 my-4 text-red-300 bg-red-900/50 rounded-lg no-print">
            <p>{error}</p>
            <Link to="/pesquisas-salvas" className="text-primary hover:underline mt-4 inline-block">Voltar para Pesquisas Salvas</Link>
        </div>
      )}

      {pesquisa && (
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 no-print gap-4 pb-4 border-b border-gray-700">
            {/* Seletor de Visualização */}
            <div className="flex bg-gray-800 p-1 rounded-xl self-start">
                <button 
                  onClick={() => setViewMode('quest')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'quest' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                >
                  📋 Questionário
                </button>
                <button 
                  onClick={() => setViewMode('report')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'report' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                >
                  📑 Relatório Técnico
                </button>
            </div>

            {confirmingDelete ? (
              <div className="flex gap-2 justify-end">
                <button 
                  onClick={handleDelete} 
                  className="px-4 py-2 bg-red-600 text-white rounded-lg shadow font-semibold hover:bg-red-700 transition w-full sm:w-auto"
                >
                  Confirmar Exclusão
                </button>
                <button 
                  onClick={() => setConfirmingDelete(false)} 
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition w-full sm:w-auto"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2 justify-end">
                <button 
                  onClick={() => setConfirmingDelete(true)}
                  className="px-6 py-2 bg-red-600/20 text-red-400 border border-red-900/50 rounded-lg shadow font-semibold hover:bg-red-900/30 transition w-full sm:w-auto"
                >
                  Excluir
                </button>
                <button 
                  onClick={handlePrint} 
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg shadow font-semibold hover:bg-gray-600 transition w-full sm:w-auto"
                >
                  {isMobile ? 'Imprimir PDF' : 'Imprimir / Salvar PDF'}
                </button>
              </div>
            )}
          </div>

          {viewMode === 'quest' ? (
            <div className="no-print">
              {tipoPesquisa === 'Creche' && 
                <QuestionarioCreche initialData={pesquisa} isReadOnly={true} />}
              
              {tipoPesquisa === 'Escola' && 
                <QuestionarioEscolar initialData={pesquisa} isReadOnly={true} />}
            </div>
          ) : (
            <div className="bg-gray-800 p-2 sm:p-8 rounded-2xl overflow-hidden border border-gray-700 no-print">
                <RelatorioImpressao data={pesquisa} />
            </div>
          )}

          {/* Relatório profissional ativado APENAS para a impressão do SO */}
          <div className="hidden print:block">
              <RelatorioImpressao data={pesquisa} />
          </div>
        </div>
      )}
    </div>
  );
}
