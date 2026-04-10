
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebaseConfig';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { schoolNames, unidadesEnsino } from './escolas';
import logo from '/logo-camara.png';
import { checklistEscola, ItemVerificacao } from './diligenciaConfig';
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
  nomeEscola: string;
  nomeDiretor: string;
  totalAlunos: number | string;
  alunosFrequentando: number | string;
  evasao: number | string;
  prestacaoContas: string;
  tipificacaoUnidade: string;
  regiao: string;
  endereco: string;
  bairro: string;
  telefone: string;
  respostas: Record<string, RespostaItem>;
  fotosGerais: Record<string, string[]>;
  quadroFuncional: Record<string, { quantidade: string; vinculo: string; observacao: string }>;
  equipeTecnica: Record<string, { quantidade: string; vinculo: string; observacao: string }>;
  perguntasDescritivas: Record<string, string>;
  avaliacaoAluno: Record<string, string>;
  adequacoesPNAE: string;
}

// --- Props ---
interface QuestionarioEscolarProps {
  initialData?: any;
  isReadOnly?: boolean;
}

// --- Funções Utilitárias ---
const sanitizeForPath = (name: string) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-');

const getInitialAnswers = (data: any = {}): Record<string, RespostaItem> => {
  const respostas: Record<string, RespostaItem> = {};
  checklistEscola.forEach(item => {
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
                            placeholder="* Ação recomendada / Justificativa"
                            rows={2}
                            disabled={disabled}
                        />
                    )}
                    {(!disabled || (resposta.fotos && resposta.fotos.length > 0)) && (
                        <div className="mt-2">
                             {!disabled && (
                                 <>
                                     <button type="button" onClick={() => onOpenCamera(item.id)} className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded disabled:opacity-50 no-print" disabled={disabled}>Anexar Foto</button>
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

export default function QuestionarioEscolar({ initialData, isReadOnly = false }: QuestionarioEscolarProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({ 
    nomeEscola: '', nomeDiretor: '', totalAlunos: '', alunosFrequentando: '', evasao: '', prestacaoContas: '', tipificacaoUnidade: '', regiao: '', endereco: '', bairro: '', telefone: '',
    respostas: getInitialAnswers(), 
    fotosGerais: {},
    quadroFuncional: {
        agentes: { quantidade: '', vinculo: '', observacao: '' },
        profEfetivos: { quantidade: '', vinculo: '', observacao: '' },
        profEventuais: { quantidade: '', vinculo: '', observacao: '' },
        merendeirasMat: { quantidade: '', vinculo: '', observacao: '' },
        merendeirasVesp: { quantidade: '', vinculo: '', observacao: '' },
        merendeirasNot: { quantidade: '', vinculo: '', observacao: '' },
        outros: { quantidade: '', vinculo: '', observacao: '' },
    },
    equipeTecnica: {
        assistenteSocial: { quantidade: '', vinculo: '', observacao: '' },
        psicologo: { quantidade: '', vinculo: '', observacao: '' },
        psicopedagogo: { quantidade: '', vinculo: '', observacao: '' },
        fonoaudiologo: { quantidade: '', vinculo: '', observacao: '' },
    },
    perguntasDescritivas: { freqAssisPsico: '', freqPsicoFono: '', registroAtendimentos: '', integracaoRelatorios: '' },
    avaliacaoAluno: { gostaMais: '', gostariaDiferente: '', seSenteSeguro: '', opiniaoMerenda: '', limpezaBanheiros: '' },
    adequacoesPNAE: ''
  });

  useEffect(() => {
    if (formData.nomeEscola && !isReadOnly) {
      const unidade = unidadesEnsino.find(u => u.nome === formData.nomeEscola);
      if (unidade) setFormData(prev => ({ ...prev, regiao: unidade.regiao, endereco: unidade.endereco, bairro: unidade.bairro, telefone: unidade.telefone }));
    }
  }, [formData.nomeEscola, isReadOnly]);

  const [activeSection, setActiveSection] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [currentPhotoTarget, setCurrentPhotoTarget] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [localPhotoPreviews, setLocalPhotoPreviews] = useState<Record<string, string[]>>({});
  const [localPhotosData, setLocalPhotosData] = useState<Record<string, string[]>>({});

  useEffect(() => {
    return () => { Object.values(localPhotoPreviews).flat().forEach(URL.revokeObjectURL); };
  }, [localPhotoPreviews]);

  const secoes = useMemo(() => {
      const grouped = checklistEscola.reduce((acc, item) => {
        const secao = item.secao || 'Geral';
        if (!acc[secao]) acc[secao] = { titulo: secao, subsecoes: {} };
        const subSecao = item.subSecao || 'Itens';
        if (!acc[secao].subsecoes[subSecao]) acc[secao].subsecoes[subSecao] = [];
        acc[secao].subsecoes[subSecao].push(item);
        return acc;
      }, {} as Record<string, { titulo: string; subsecoes: Record<string, ItemVerificacao[]> }>);

      const secoesOrdenadas = Object.values(grouped).map(g => ({ titulo: g.titulo, type: 'checklist', subsecoes: Object.entries(g.subsecoes).map(([subTitulo, itens]) => ({ titulo: subTitulo, itens })) }));
      return [
        { titulo: '1. Dados de Identificação e Tipificação', type: 'id', subsecoes: [] },
        { titulo: '2. Quadro Funcional e Recursos Humanos', type: 'quadro', subsecoes: secoesOrdenadas.find(s => s.titulo.includes('2.'))?.subsecoes || [] },
        ...(secoesOrdenadas.filter(s => !s.titulo.includes('2.'))),
        { titulo: '6. Perguntas Descritivas (Atuação e Registro)', type: 'descritivas', subsecoes: [] }
      ];
  }, []);

  useEffect(() => {
    if (initialData) setFormData(prev => ({ ...prev, ...initialData, respostas: getInitialAnswers(initialData) }));
  }, [initialData]);

  const handleFieldChange = (field: keyof Omit<FormData, 'respostas' | 'fotosGerais'>, value: any) => !isReadOnly && setFormData(prev => ({ ...prev, [field]: value }));
  const handleAnswerChange = (itemId: string, value: Partial<RespostaItem>) => !isReadOnly && setFormData(prev => ({ ...prev, respostas: { ...prev.respostas, [itemId]: { ...prev.respostas[itemId], ...value } } }));
  const handleOpenCamera = (targetId: string) => { setCurrentPhotoTarget(targetId); setIsCameraOpen(true); };
  const handleCapture = (dataUrl: string, blob: Blob) => {
     const previewUrl = URL.createObjectURL(blob);
     setLocalPhotoPreviews(prev => ({ ...prev, [currentPhotoTarget!]: [...(prev[currentPhotoTarget!] || []), previewUrl] }));
     setLocalPhotosData(prev => ({ ...prev, [currentPhotoTarget!]: [...(prev[currentPhotoTarget!] || []), dataUrl] }));
     setIsCameraOpen(false);
  };
  const handleSaveAndNext = async () => {
    setIsSaving(true);
    try {
      const escolaPath = sanitizeForPath(formData.nomeEscola);
      let currentDocId = formData.id;
      if (!currentDocId) {
        const docRef = await addDoc(collection(db, 'diligencias'), { tipificacao: 'Escola', ...formData, timestamp: serverTimestamp() });
        currentDocId = docRef.id;
      }
      const updatedRespostas = JSON.parse(JSON.stringify(formData.respostas));
      for (const targetId in localPhotosData) {
        const photoList = localPhotosData[targetId];
        const uploadedUrls = await Promise.all(photoList.map((photoDataUrl, index) => uploadImage(`diligencias/${escolaPath}/${currentDocId}/${targetId}-${index}.jpg`, photoDataUrl)));
        updatedRespostas[targetId].fotos = [...(updatedRespostas[targetId].fotos || []), ...uploadedUrls];
      }
      await updateDoc(doc(db, 'diligencias', currentDocId), { ...formData, id: currentDocId, respostas: updatedRespostas, timestamp: serverTimestamp() });
      if (activeSection < secoes.length - 1) setActiveSection(activeSection + 1);
      else { alert('Salvo!'); navigate('/'); }
    } catch (e) { console.error(e); alert('Erro!'); } finally { setIsSaving(false); }
  };

  const isIdentificationComplete = !!formData.nomeEscola && !!formData.nomeDiretor;

  return (
    <div className="p-2 sm:p-4 max-w-5xl mx-auto bg-gray-900 text-white print:bg-white print:text-black">
        <style>{`
            @media print {
                .print-only { display: block !important; }
                .no-print { display: none !important; }
                body { background: white !important; color: black !important; }
                .ri-header { display: flex; align-items: center; border-bottom: 1px solid #2d3748; padding-bottom: 12px; margin-bottom: 25px; width: 100%; }
                .ri-header img { height: 50px !important; margin-right: 20px; object-fit: contain; }
                .ri-header-text h1 { font-size: 18pt; color: #1a202c; font-weight: 300; }
                .ri-header-text p { font-size: 9.5pt; color: #718096; }
            }
            .print-only { display: none; }
        `}</style>
        
        <div className="print-only ri-header pt-4">
            <img src={logo} alt="Logo" />
            <div className="ri-header-text">
                <h1>Relatório de Diligência Técnica</h1>
                <p>Câmara Municipal de Ubatuba — Fiscaliza Ubatuba</p>
            </div>
            <div className="mb-4 border-b pb-2">
                <h2 className="text-xl font-bold">{formData.nomeEscola}</h2>
                <p className="text-sm text-gray-600">Data: {new Date().toLocaleDateString('pt-BR')}</p>
            </div>
        </div>

        <div className="no-print">
            {isCameraOpen && <CameraComponent onCapture={handleCapture} onClose={() => setIsCameraOpen(false)} />}
            {lightboxUrl && <div className="fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center" onClick={() => setLightboxUrl(null)}><img src={lightboxUrl} className="max-w-full max-h-full" alt="Original" /></div>}
        </div>

        <h1 className="text-xl sm:text-2xl font-bold mb-4 no-print">{isReadOnly ? `Escola: ${formData.nomeEscola}` : '🏫 Checklist Escolas'}</h1>

        {secoes.map((sec, secIndex) => (
            <div key={secIndex} className={isReadOnly || activeSection === secIndex ? 'block mb-8' : 'hidden'}>
                {sec.type === 'id' && (
                    <Section title={sec.titulo}>
                        <label className="block mb-2 text-sm font-medium">Nome da Escola *</label>
                        <select value={formData.nomeEscola} onChange={e => handleFieldChange('nomeEscola', e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" disabled={isReadOnly}><option value="">Selecione...</option>{schoolNames.map(n => <option key={n} value={n}>{n}</option>)}</select>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div><label className="block text-sm">Diretor(a)</label><input type="text" value={formData.nomeDiretor} onChange={e => handleFieldChange('nomeDiretor', e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" disabled={isReadOnly} /></div>
                            <div><label className="block text-sm">Tipificação</label><input type="text" value={formData.tipificacaoUnidade} onChange={e => handleFieldChange('tipificacaoUnidade', e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" disabled={isReadOnly} /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                           <div><label className="block text-sm">Total Alunos</label><input type="number" value={formData.totalAlunos} onChange={e => handleFieldChange('totalAlunos', e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" disabled={isReadOnly} /></div>
                           <div><label className="block text-sm">Freq. Alunos</label><input type="number" value={formData.alunosFrequentando} onChange={e => handleFieldChange('alunosFrequentando', e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" disabled={isReadOnly} /></div>
                           <div><label className="block text-sm">Evasão</label><input type="number" value={formData.evasao} onChange={e => handleFieldChange('evasao', e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" disabled={isReadOnly} /></div>
                        </div>
                    </Section>
                )}
                {sec.type === 'quadro' && (
                    <Section title={sec.titulo}>
                        <h3 className="text-white font-bold mb-2">Quadro Funcional</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="border-b border-gray-700 text-white"><th className="text-left py-2">Função</th><th className="text-center py-2">Qtd</th><th className="text-left py-2">Vínculo</th></tr></thead>
                                <tbody>
                                    {Object.entries(formData.quadroFuncional).map(([id, val]) => (
                                        <tr key={id} className="border-b border-gray-800">
                                            <td className="py-2 text-gray-300">{id}</td>
                                            <td className="py-2 text-center"><input type="text" value={val.quantidade} onChange={e => setFormData(prev => ({...prev, quadroFuncional: {...prev.quadroFuncional, [id]: {...val, quantidade: e.target.value}}}))} className="w-16 bg-gray-800 border border-gray-700 text-center" /></td>
                                            <td className="py-2"><select value={val.vinculo} onChange={e => setFormData(prev => ({...prev, quadroFuncional: {...prev.quadroFuncional, [id]: {...val, vinculo: e.target.value}}}))} className="bg-gray-800 border border-gray-700"><option value="">Sel...</option><option value="Contrato">Contrato</option><option value="Concurso">Concurso</option></select></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <h3 className="text-white font-bold mt-6 mb-2">Equipe Técnica</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="border-b border-gray-700 text-white"><th className="text-left py-2">Especialista</th><th className="text-center py-2">Qtd</th><th className="text-left py-2">Vínculo</th></tr></thead>
                                <tbody>
                                    {Object.entries(formData.equipeTecnica).map(([id, val]) => (
                                        <tr key={id} className="border-b border-gray-800">
                                            <td className="py-2 text-gray-300">{id}</td>
                                            <td className="py-2 text-center"><input type="text" value={val.quantidade} onChange={e => setFormData(prev => ({...prev, equipeTecnica: {...prev.equipeTecnica, [id]: {...val, quantidade: e.target.value}}}))} className="w-16 bg-gray-800 border border-gray-700 text-center" /></td>
                                            <td className="py-2"><select value={val.vinculo} onChange={e => setFormData(prev => ({...prev, equipeTecnica: {...prev.equipeTecnica, [id]: {...val, vinculo: e.target.value}}}))} className="bg-gray-800 border border-gray-700"><option value="">Sel...</option><option value="Contratado">Contratado</option><option value="Concursado">Concursado</option></select></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Section>
                )}
                {sec.type === 'checklist' && (
                    <Section title={sec.titulo}>
                        {sec.subsecoes.map((sub: any) => <SubSection key={sub.titulo} title={sub.titulo}>{sub.itens.map((item: any) => <VerificationItem key={item.id} item={item} resposta={formData.respostas[item.id]} localPhotos={localPhotoPreviews[item.id] || []} onChange={handleAnswerChange} onOpenCamera={handleOpenCamera} onImageClick={setLightboxUrl} disabled={isReadOnly}/>)}</SubSection>)}
                    </Section>
                )}
                {sec.type === 'descritivas' && (
                    <Section title={sec.titulo}>
                        <div className="space-y-4">
                            {Object.entries(formData.perguntasDescritivas).map(([id, val]) => (
                                <div key={id}><label className="block text-sm text-gray-400">{id}</label><textarea value={val} onChange={e => setFormData(prev => ({...prev, perguntasDescritivas: {...prev.perguntasDescritivas, [id]: e.target.value}}))} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" rows={2}/></div>
                            ))}
                        </div>
                    </Section>
                )}
                {!isReadOnly && (
                    <div className="flex justify-between mt-4 no-print">
                        <button onClick={() => setActiveSection(activeSection - 1)} disabled={activeSection === 0 || isSaving} className="px-6 py-2 bg-gray-600 text-white rounded">Anterior</button>
                        <button onClick={handleSaveAndNext} disabled={isSaving || (activeSection === 0 && !isIdentificationComplete)} className="px-6 py-2 bg-primary text-white rounded">{isSaving ? 'Salvando...' : 'Próximo'}</button>
                    </div>
                )}
            </div>
        ))}
    </div>
  );
}
