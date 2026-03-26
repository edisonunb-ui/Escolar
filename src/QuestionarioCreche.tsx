
import React, { useState, useEffect, useMemo } from 'react';
import { db } from './firebaseConfig';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { crecheNames } from './escolas';
import { checklistCreche, ItemVerificacao } from './diligenciaConfig';
import CameraComponent from './CameraComponent';
import { uploadImage } from './firebaseStorage';

// --- Tipos de Dados ---
interface RespostaItem {
  conforme: boolean | null;
  observacao: string;
  fotos: string[];
}

interface FormData {
  id?: string;
  nomeCreche: string;
  nomeDiretor: string;
  totalAlunos: number | string;
  alunosFrequentando: number | string;
  evasao: number | string;
  prestacaoContas: string;
  respostas: Record<string, RespostaItem>;
  fotosGerais: Record<string, string[]>;
}

// --- Props ---
interface QuestionarioCrecheProps {
  initialData?: any;
  isReadOnly?: boolean;
}

// --- Funções Utilitárias ---
const sanitizeForPath = (name: string) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-');

const getInitialAnswers = (data: any = {}): Record<string, RespostaItem> => {
  const respostas: Record<string, RespostaItem> = {};
  checklistCreche.forEach(item => {
    respostas[item.id] = {
      conforme: data.respostas?.[item.id]?.conforme ?? null,
      observacao: data.respostas?.[item.id]?.observacao || '',
      fotos: data.respostas?.[item.id]?.fotos || [],
    };
  });
  return respostas;
};

// --- Componentes de UI ---
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="border border-gray-700 rounded-2xl shadow overflow-hidden mb-6">
        <h2 className="text-lg sm:text-xl font-semibold bg-gray-800 text-white p-3 no-print">{title}</h2>
        <div className="p-3 sm:p-4 space-y-6">{children}</div>
    </section>
);

const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mt-4 border-t border-gray-700 pt-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-300 mb-2">{title}</h3>
        {children}
    </div>
);

const VerificationItem: React.FC<{ 
    item: ItemVerificacao; 
    resposta: RespostaItem; 
    localPhotos: string[];
    onChange: (itemId: string, value: Partial<RespostaItem>) => void; 
    onOpenCamera: (targetId: string) => void;
    onImageClick?: (url: string) => void;
    disabled?: boolean; 
}> = ({ item, resposta, localPhotos, onChange, onOpenCamera, onImageClick, disabled }) => {
    const isNaoConforme = resposta.conforme === (item.logicaInvertida ? true : false);
    const exigeJustificativa = isNaoConforme && (item.obsObrigatoria || item.fotoObrigatoria);

    return (
        <div className={`py-3 border-b border-gray-700 last:border-b-0 ${exigeJustificativa ? 'bg-red-900/20 p-2 rounded-lg' : ''}`}>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2">
                <span className="text-sm text-gray-400 leading-tight">{item.texto}</span>
                <div className="flex items-center gap-3 justify-self-start sm:justify-self-end">
                    <span className={`text-sm font-bold ${resposta.conforme === false ? 'text-red-400' : 'text-gray-500'}`}>Não</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={resposta.conforme ?? false} onChange={e => onChange(item.id, { conforme: e.target.checked })} className="sr-only peer" disabled={disabled} />
                        <div className={`w-11 h-6 bg-gray-600 rounded-full peer ${disabled ? 'cursor-not-allowed' : ''} peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full`}></div>
                    </label>
                    <span className={`text-sm font-bold ${resposta.conforme === true ? 'text-green-400' : 'text-gray-500'}`}>Sim</span>
                </div>
            </div>
            {isNaoConforme && (
                 <div className="mt-3 pt-3 pl-2 border-l-4 border-red-500">
                    <p className="text-xs text-red-400 font-semibold mb-2">Não conformidade detectada (Risco: {item.riscoNaoConforme})</p>
                    {item.obsObrigatoria && (
                        <textarea
                            value={resposta.observacao}
                            onChange={e => onChange(item.id, { observacao: e.target.value })}
                            className="w-full p-2 border border-gray-600 bg-gray-900 rounded mt-1 text-sm text-white" 
                            placeholder="* Ação recomendada / Justificativa (obrigatório)"
                            rows={2}
                            disabled={disabled}
                        />
                    )}
                    {(!disabled || (resposta.fotos && resposta.fotos.length > 0)) && (
                        <div className="mt-2">
                             {!disabled && (
                                 <>
                                     <button type="button" onClick={() => onOpenCamera(item.id)} className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded disabled:opacity-50 no-print" disabled={disabled}>Anexar Foto</button>
                                     {item.fotoObrigatoria && <p className="text-xs text-yellow-400 mt-1 inline-block ml-2 no-print">* Anexo de foto é obrigatório.</p>}
                                 </>
                             )}
                             <div className="flex gap-2 mt-2 flex-wrap">
                                 {resposta.fotos?.map(url => <img key={url} src={url} onClick={() => onImageClick?.(url)} className="w-24 h-24 rounded object-cover border border-gray-400 cursor-pointer hover:opacity-80 transition-opacity" alt="Foto anexada" />)}
                                 {localPhotos?.map((dataUrl, i) => <img key={i} src={dataUrl} onClick={() => onImageClick?.(dataUrl)} className="w-24 h-24 rounded object-cover border-2 border-blue-500 cursor-pointer hover:opacity-80 transition-opacity" alt="Preview local" />)}
                             </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// --- Componente Principal ---
export default function QuestionarioCreche({ initialData, isReadOnly = false }: QuestionarioCrecheProps) {
  const [formData, setFormData] = useState<FormData>({ nomeCreche: '', nomeDiretor: '', totalAlunos: '', alunosFrequentando: '', evasao: '', prestacaoContas: '', respostas: getInitialAnswers(), fotosGerais: {} });
  const [activeSection, setActiveSection] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [currentPhotoTarget, setCurrentPhotoTarget] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  
  const [localPhotoPreviews, setLocalPhotoPreviews] = useState<Record<string, string[]>>({});
  const [localPhotosData, setLocalPhotosData] = useState<Record<string, string[]>>({});

  useEffect(() => {
    return () => {
      Object.values(localPhotoPreviews).flat().forEach(URL.revokeObjectURL);
    };
  }, [localPhotoPreviews]);

  const secoes = useMemo(() => {
      const grouped = checklistCreche.reduce((acc, item) => {
        const secao = item.secao || 'Geral';
        if (!acc[secao]) { acc[secao] = { titulo: secao, subsecoes: {} }; }
        const subSecao = item.subSecao || 'Itens';
        if (!acc[secao].subsecoes[subSecao]) { acc[secao].subsecoes[subSecao] = []; }
        acc[secao].subsecoes[subSecao].push(item);
        return acc;
      }, {} as Record<string, { titulo: string; subsecoes: Record<string, ItemVerificacao[]> }>);

      const secoesOrdenadas = Object.values(grouped).map(g => ({ titulo: g.titulo, subsecoes: Object.entries(g.subsecoes).map(([subTitulo, itens]) => ({ titulo: subTitulo, itens })) }));
      return [{ titulo: 'Identificação da Diligência', subsecoes: [] }, ...secoesOrdenadas];
  }, []);


  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData, id: initialData.id, respostas: getInitialAnswers(initialData) });
      setLocalPhotoPreviews({});
      setLocalPhotosData({});
    }
  }, [initialData]);

  const handleFieldChange = (field: keyof Omit<FormData, 'respostas' | 'fotosGerais'>, value: any) => {
    if (isReadOnly) return;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAnswerChange = (itemId: string, value: Partial<RespostaItem>) => {
    if (isReadOnly) return;
    setFormData(prev => ({ ...prev, respostas: { ...prev.respostas, [itemId]: { ...prev.respostas[itemId], ...value } } }));
  };

  const handleOpenCamera = (targetId: string) => {
    if (!formData.nomeCreche && !isReadOnly) {
        alert('Por favor, selecione uma creche antes de adicionar fotos.');
        setActiveSection(0);
        return;
    }
    setCurrentPhotoTarget(targetId);
    setIsCameraOpen(true);
  };

  const handleCapture = (dataUrl: string, blob: Blob) => {
    if (!currentPhotoTarget) return;
    const previewUrl = URL.createObjectURL(blob);

    setLocalPhotoPreviews(prev => ({ ...prev, [currentPhotoTarget]: [...(prev[currentPhotoTarget] || []), previewUrl] }));
    setLocalPhotosData(prev => ({ ...prev, [currentPhotoTarget]: [...(prev[currentPhotoTarget] || []), dataUrl] }));

    setIsCameraOpen(false);
    setCurrentPhotoTarget(null);
  };

  const handleSaveAndNext = async () => {
    if (isSaving) return;

    if (activeSection === 0) {
        if (!formData.nomeCreche || !formData.nomeDiretor || !formData.totalAlunos || !formData.alunosFrequentando || !formData.evasao || !formData.prestacaoContas) {
            alert('Por favor, preencha todos os campos de identificação para prosseguir.');
            return;
        }
    }

    if (activeSection > 0) {
        const currentSecoes = secoes[activeSection].subsecoes.flatMap(s => s.itens);
        for (const item of currentSecoes) {
            const resposta = formData.respostas[item.id];
            const isNaoConforme = resposta?.conforme === (item.logicaInvertida ? true : false);
            if (isNaoConforme && item.obsObrigatoria && !resposta.observacao) {
                alert(`A observação para o item "${item.texto}" é obrigatória para prosseguir.`);
                return;
            }
            if (isNaoConforme && item.fotoObrigatoria && ((resposta.fotos?.length || 0) + (localPhotosData[item.id]?.length || 0) === 0)) {
                alert(`Anexar foto para o item "${item.texto}" é obrigatório para prosseguir.`);
                return;
            }
        }
    }

    setIsSaving(true);
    try {
      const crechePath = sanitizeForPath(formData.nomeCreche);
      let currentDocId = formData.id;

      if (!currentDocId) {
        const docData = { 
            nomeCreche: formData.nomeCreche, 
            timestamp: serverTimestamp(), 
            tipificacao: 'Creche',
            nomeDiretor: formData.nomeDiretor,
            totalAlunos: formData.totalAlunos,
            alunosFrequentando: formData.alunosFrequentando,
            evasao: formData.evasao,
            prestacaoContas: formData.prestacaoContas,
            respostas: formData.respostas
        };
        const docRef = await addDoc(collection(db, 'diligencias'), docData);
        currentDocId = docRef.id;
        setFormData(prev => ({ ...prev, id: currentDocId }));
      }

      const updatedRespostas = JSON.parse(JSON.stringify(formData.respostas));
      for (const targetId in localPhotosData) {
        const photoList = localPhotosData[targetId];
        if (photoList && photoList.length > 0) {
          const uploadedUrls = await Promise.all(
            photoList.map((photoDataUrl, index) => {
              const timestamp = Date.now();
              const fileName = `${sanitizeForPath(targetId)}-${timestamp}-${index}.jpg`;
              const path = `diligencias/${crechePath}/${currentDocId}/${fileName}`;
              return uploadImage(path, photoDataUrl);
            })
          );
          updatedRespostas[targetId].fotos = [
              ...(updatedRespostas[targetId].fotos || []), 
              ...uploadedUrls
          ];
        }
      }

      const finalDataToSave = {
        nomeCreche: formData.nomeCreche,
        nomeDiretor: formData.nomeDiretor,
        totalAlunos: formData.totalAlunos,
        alunosFrequentando: formData.alunosFrequentando,
        evasao: formData.evasao,
        prestacaoContas: formData.prestacaoContas,
        respostas: updatedRespostas,
        timestamp: serverTimestamp(),
        tipificacao: 'Creche'
      };

      await updateDoc(doc(db, 'diligencias', currentDocId), finalDataToSave);

      setFormData(prev => ({...prev, respostas: updatedRespostas}));
      setLocalPhotoPreviews({});
      setLocalPhotosData({});

      if (activeSection < secoes.length - 1) {
          setActiveSection(activeSection + 1);
      } else {
          alert('Diligência finalizada e salva com sucesso!');
      }

    } catch (error) {
      console.error("Erro ao salvar a diligência: ", error);
      alert('Ocorreu um erro ao salvar. Verifique o console para mais detalhes.');
    } finally {
      setIsSaving(false);
    }
  };

  const isIdentificationComplete = !!formData.nomeCreche && !!formData.nomeDiretor && !!formData.totalAlunos && !!formData.alunosFrequentando && !!formData.evasao && !!formData.prestacaoContas;

  return (
    <div className="p-2 sm:p-4 max-w-5xl mx-auto bg-gray-900 text-white">
        {isCameraOpen && <CameraComponent onCapture={handleCapture} onClose={() => setIsCameraOpen(false)} />}

        {/* Lightbox para visualizar fotos em tamanho original */}
        {lightboxUrl && (
          <div
            className="fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setLightboxUrl(null)}
          >
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute top-4 right-4 text-white text-3xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/80 transition-colors z-10"
              aria-label="Fechar"
            >
              ×
            </button>
            <img
              src={lightboxUrl}
              alt="Foto em tamanho original"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
        
        <h1 className="text-xl sm:text-2xl font-bold mb-4">{isReadOnly ? `Visualizando: ${formData.nomeCreche}` : '👶 Checklist de Conformidade — Creches'}</h1>

        {secoes.map((sec, secIndex) => (
            <div key={secIndex} className={isReadOnly || activeSection === secIndex ? 'block mb-8' : 'hidden'}>
                {secIndex === 0 ? (
                    <Section title="1. Identificação da Diligência">
                        <label className="block mb-2 text-sm font-medium">Nome da Creche *</label>
                        <select name="nomeCreche" value={formData.nomeCreche} onChange={e => handleFieldChange('nomeCreche', e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-700 rounded disabled:opacity-50" disabled={isReadOnly || !!initialData}>
                            <option value="">Selecione uma creche</option>
                            {crecheNames.map(name => <option key={name} value={name}>{name}</option>)}
                        </select>

                        <label className="block mt-4 mb-2 text-sm font-medium">Nome do(a) Diretor(a) *</label>
                        <input type="text" value={formData.nomeDiretor} onChange={e => handleFieldChange('nomeDiretor', e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-700 rounded disabled:opacity-50" disabled={isReadOnly} />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium">Total de Alunos *</label>
                                <input type="number" value={formData.totalAlunos} onChange={e => handleFieldChange('totalAlunos', e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-700 rounded disabled:opacity-50" disabled={isReadOnly} />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">Alunos Frequentando *</label>
                                <input type="number" value={formData.alunosFrequentando} onChange={e => handleFieldChange('alunosFrequentando', e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-700 rounded disabled:opacity-50" disabled={isReadOnly} />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">Evasão *</label>
                                <input type="number" value={formData.evasao} onChange={e => handleFieldChange('evasao', e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-700 rounded disabled:opacity-50" disabled={isReadOnly} />
                            </div>
                        </div>
                        
                        <label className="block mt-4 mb-2 text-sm font-medium">Periodicidade da Prestação de Contas *</label>
                        <div className="flex gap-4 items-center text-sm">
                            <label className="flex items-center gap-2"><input type="radio" value="Mensal" name="prestacaoContas" checked={formData.prestacaoContas === 'Mensal'} onChange={e => handleFieldChange('prestacaoContas', e.target.value)} disabled={isReadOnly} className="h-4 w-4 bg-gray-800 border-gray-600"/> Mensal</label>
                            <label className="flex items-center gap-2"><input type="radio" value="Trimestral" name="prestacaoContas" checked={formData.prestacaoContas === 'Trimestral'} onChange={e => handleFieldChange('prestacaoContas', e.target.value)} disabled={isReadOnly} className="h-4 w-4 bg-gray-800 border-gray-600"/> Trimestral</label>
                            <label className="flex items-center gap-2"><input type="radio" value="Semestral" name="prestacaoContas" checked={formData.prestacaoContas === 'Semestral'} onChange={e => handleFieldChange('prestacaoContas', e.target.value)} disabled={isReadOnly} className="h-4 w-4 bg-gray-800 border-gray-600"/> Semestral</label>
                        </div>
                    </Section>
                ) : (
                     <Section title={`${secIndex + 1}. ${sec.titulo}`}>
                        {sec.subsecoes.map(sub => (
                            <SubSection key={sub.titulo} title={sub.titulo}>
                                {sub.itens.map(item => (
                                    <VerificationItem key={item.id} item={item} resposta={formData.respostas[item.id]} localPhotos={localPhotoPreviews[item.id] || []} onChange={handleAnswerChange} onOpenCamera={handleOpenCamera} onImageClick={setLightboxUrl} disabled={isReadOnly}/>
                                ))}
                            </SubSection>
                        ))}
                    </Section>
                )}

                {!isReadOnly && (
                    <div className="flex justify-between mt-4">
                        <button onClick={() => setActiveSection(activeSection - 1)} disabled={activeSection === 0 || isSaving} className="px-6 py-2 bg-gray-600 text-white rounded shadow font-semibold disabled:opacity-50">
                            Anterior
                        </button>
                        <button onClick={handleSaveAndNext} disabled={isSaving || (activeSection === 0 && !isIdentificationComplete)} className="px-6 py-2 bg-primary text-white rounded shadow font-semibold disabled:opacity-50">
                            {isSaving ? 'Salvando...' : (activeSection === secoes.length - 1 ? 'Finalizar e Salvar' : 'Salvar e Próximo')}
                        </button>
                    </div>
                )}
            </div>
        ))}
    </div>
  );
}
