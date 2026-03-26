
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
       <style>
        {`
          @media print {
            body {
              background-color: #fff !important;
              color: #000 !important;
            }
            nav, .no-print, header {
              display: none !important;
            }
            main {
              padding: 0 !important;
              margin: 0 !important;
            }
            /* Esconder a visualização do questionário na impressão */
            .screen-only {
              display: none !important;
            }
          }
        `}
       </style>

      {loading && <p className="text-center text-text-secondary no-print">Carregando dados...</p>}
      {error && (
        <div className="text-center p-4 my-4 text-red-300 bg-red-900/50 rounded-lg no-print">
            <p>{error}</p>
            <Link to="/pesquisas-salvas" className="text-primary hover:underline mt-4 inline-block">Voltar para Pesquisas Salvas</Link>
        </div>
      )}

      {pesquisa && (
        <div>
          <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center mb-4 no-print gap-2">
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
                  className="px-6 py-2 bg-red-600 text-white rounded-lg shadow font-semibold hover:bg-red-700 transition w-full sm:w-auto"
                >
                  Excluir
                </button>
                {isMobile ? (
                  <p className="text-sm text-center text-text-secondary p-3 bg-card rounded-lg border border-gray-700">
                    <b>Dica:</b> Para salvar em PDF, use a opção "Compartilhar" e "Imprimir" do seu navegador.
                  </p>
                ) : (
                  <button 
                    onClick={handlePrint} 
                    className="px-6 py-2 bg-gray-700 text-white rounded-lg shadow font-semibold hover:bg-gray-600 transition w-full sm:w-auto"
                  >
                    Imprimir / Salvar PDF
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="screen-only">
            {tipoPesquisa === 'Creche' && 
              <QuestionarioCreche initialData={pesquisa} isReadOnly={true} />}
            
            {tipoPesquisa === 'Escola' && 
              <QuestionarioEscolar initialData={pesquisa} isReadOnly={true} />}
          </div>

          {/* Relatório profissional visível apenas na impressão */}
          <RelatorioImpressao data={pesquisa} />
        </div>
      )}
    </div>
  );
}
