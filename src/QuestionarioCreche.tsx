
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebaseConfig';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { crecheNames, unidadesEnsino } from './escolas';
import logo from '/logo-camara.png';
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
  regiao: string;
  endereco: string;
  bairro: string;
  telefone: string;
  respostas: Record<string, RespostaItem>;
  fotosGerais: Record<string, string[]>;
  tipificacaoUnidade: string;
  quadroFuncionalCreche: Record<string, { quantidade: string; vinculo: string; observacao: string }>;
  observacoesCreche: {
    gerais: string;
    adequacoes: string;
    orientacoesCAE: string;
  };
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
                    {(!disabled || resposta.observacao) && (
                        <textarea
                            value={resposta.observacao}
                            onChange={e => onChange(item.id, { observacao: e.target.value })}
                            className="w-full p-2 border border-gray-600 bg-gray-900 rounded mt-1 text-sm text-white" 
                            placeholder="Ação recomendada / Justificativa"
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

export default function QuestionarioCreche({ initialData, isReadOnly = false }: QuestionarioCrecheProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({ 
    nomeCreche: '', nomeDiretor: '', totalAlunos: '', alunosFrequentando: '', evasao: '', prestacaoContas: '', tipificacaoUnidade: 'Creche', regiao: '', endereco: '', bairro: '', telefone: '',
    respostas: getInitialAnswers(), 
    fotosGerais: {},
    quadroFuncionalCreche: {
        berçário: { quantidade: '', vinculo: '', observacao: '' },
        miniGrupos: { quantidade: '', vinculo: '', observacao: '' },
        profEfetivos: { quantidade: '', vinculo: '', observacao: '' },
        merendeiras: { quantidade: '', vinculo: '', observacao: '' },
        outros: { quantidade: '', vinculo: '', observacao: '' },
    },
    observacoesCreche: { gerais: '', adequacoes: '', orientacoesCAE: '' }
  });

  useEffect(() => {
    if (formData.nomeCreche && !isReadOnly) {
      const unidade = unidadesEnsino.find(u => u.nome === formData.nomeCreche);
      if (unidade) setFormData(prev => ({ ...prev, regiao: unidade.regiao, endereco: unidade.endereco, bairro: unidade.bairro, telefone: unidade.telefone }));
    }
  }, [formData.nomeCreche, isReadOnly]);

  const [activeSection, setActiveSection] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [currentPhotoTarget, setCurrentPhotoTarget] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [localPhotoPreviews, setLocalPhotoPreviews] = useState<Record<string, string[]>>({});
  const [localPhotosData, setLocalPhotosData] = useState<Record<string, string[]>>({});

  const secoes = useMemo(() => {
      const grouped = checklistCreche.reduce((acc, item) => {
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
        { titulo: '8. Observações e Adequações', type: 'observacoes', subsecoes: [] }
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
      const crechePath = sanitizeForPath(formData.nomeCreche);
      let currentDocId = formData.id;
      if (!currentDocId) {
        const docRef = await addDoc(collection(db, 'diligencias'), { tipificacao: 'Creche', ...formData, timestamp: serverTimestamp() });
        currentDocId = docRef.id;
      }
      const updatedRespostas = JSON.parse(JSON.stringify(formData.respostas));
      for (const targetId in localPhotosData) {
        const photoList = localPhotosData[targetId];
        const uploadedUrls = await Promise.all(photoList.map((photoDataUrl, index) => uploadImage(`diligencias/${crechePath}/${currentDocId}/${targetId}-${index}.jpg`, photoDataUrl)));
        updatedRespostas[targetId].fotos = [...(updatedRespostas[targetId].fotos || []), ...uploadedUrls];
      }
      await updateDoc(doc(db, 'diligencias', currentDocId), { ...formData, id: currentDocId, respostas: updatedRespostas, timestamp: serverTimestamp() });
      if (activeSection < secoes.length - 1) setActiveSection(activeSection + 1);
      else { alert('Salvo!'); navigate('/'); }
    } catch (e) { console.error(e); alert('Erro!'); } finally { setIsSaving(false); }
  };

  const isIdentificationComplete = !!formData.nomeCreche && !!formData.nomeDiretor;

  return (
    <div className="p-2 sm:p-4 max-w-5xl mx-auto bg-gray-900 text-white print:bg-white print:text-black">
        <style>{`
            @media print {
                .print-only { display: block !important; }
                .no-print { display: none !important; }
                body { background: white !important; }
                .ri-header { display: flex; align-items: center; border-bottom: 1px solid #2d3748; padding-bottom: 12px; margin-bottom: 25px; width: 100%; }
                .ri-header img { height: 50px !important; margin-right: 20px; object-fit: contain; }
                .ri-header-text h1 { font-size: 18pt; color: #1a202c; font-weight: 300; }
                .ri-header-text p { font-size: 9.5pt; color: #718096; }
            }
            .print-only { display: none; }
        `}</style>
        
        <div className="hidden print:flex ri-header pt-4">
            <img src={logo} alt="Logo" />
            <div className="ri-header-text">
                <h1>Relatório de Diligência Técnica</h1>
                <p>Câmara Municipal de Ubatuba — Fiscaliza Ubatuba</p>
            </div>
            <div className="mb-4 border-b pb-2">
                <h2 className="text-xl font-bold">{formData.nomeCreche}</h2>
                <p className="text-sm text-gray-600">Data: {new Date().toLocaleDateString('pt-BR')}</p>
            </div>
        </div>

        <div className="no-print">
            {isCameraOpen && <CameraComponent onCapture={handleCapture} onClose={() => setIsCameraOpen(false)} />}
            {lightboxUrl && <div className="fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center" onClick={() => setLightboxUrl(null)}><img src={lightboxUrl} className="max-w-full max-h-full" alt="Original" /></div>}
        </div>

        <h1 className="text-xl sm:text-2xl font-bold mb-4 no-print">{isReadOnly ? `Creche: ${formData.nomeCreche}` : '👶 Checklist Creches'}</h1>

        {secoes.map((sec, secIndex) => (
            <div key={secIndex} className={isReadOnly || activeSection === secIndex ? 'block mb-8' : 'hidden'}>
                {sec.type === 'id' && (
                    <Section title={sec.titulo}>
                        <label className="block mb-2 text-sm font-medium">Nome da Creche *</label>
                        <select value={formData.nomeCreche} onChange={e => handleFieldChange('nomeCreche', e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" disabled={isReadOnly}><option value="">Selecione...</option>{crecheNames.map(n => <option key={n} value={n}>{n}</option>)}</select>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div><label className="block text-sm">Diretor(a)</label><input type="text" value={formData.nomeDiretor} onChange={e => handleFieldChange('nomeDiretor', e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" disabled={isReadOnly} /></div>
                            <div><label className="block text-sm">Tipificação</label><select value={formData.tipificacaoUnidade} onChange={e => handleFieldChange('tipificacaoUnidade', e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" disabled={isReadOnly}><option value="Creche">Creche</option><option value="Pré-Escola">Pré-Escola</option></select></div>
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
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="border-b border-gray-700"><th className="text-left py-2">Função</th><th className="text-center py-2">Qtd</th><th className="text-left py-2">Vínculo</th><th className="text-left py-2">OBS</th></tr></thead>
                                <tbody>
                                    {Object.entries(formData.quadroFuncionalCreche).map(([id, val]) => (
                                        <tr key={id} className="border-b border-gray-800">
                                            <td className="py-2">{id}</td>
                                            <td className="py-2 text-center"><input type="text" value={val.quantidade} onChange={e => setFormData(prev => ({...prev, quadroFuncionalCreche: {...prev.quadroFuncionalCreche, [id]: {...val, quantidade: e.target.value}}}))} className="w-16 bg-gray-800 border border-gray-700 text-center" /></td>
                                            <td className="py-2"><select value={val.vinculo} onChange={e => setFormData(prev => ({...prev, quadroFuncionalCreche: {...prev.quadroFuncionalCreche, [id]: {...val, vinculo: e.target.value}}}))} className="bg-gray-800 border border-gray-700"><option value="">Sel...</option><option value="Contrato">Contrato</option><option value="Concurso">Concurso</option></select></td>
                                            <td className="py-2"><input type="text" value={val.observacao} onChange={e => setFormData(prev => ({...prev, quadroFuncionalCreche: {...prev.quadroFuncionalCreche, [id]: {...val, observacao: e.target.value}}}))} className="w-full bg-gray-800 border border-gray-700" /></td>
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
                {sec.type === 'observacoes' && (
                    <Section title={sec.titulo}>
                        <div className="space-y-4">
                            <div><label className="block text-blue-400">Observações Gerais</label><textarea value={formData.observacoesCreche.gerais} onChange={e => setFormData(prev => ({...prev, observacoesCreche: {...prev.observacoesCreche, gerais: e.target.value}}))} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" rows={3}/></div>
                            <div><label className="block text-red-400">Adequações Prioritárias</label><textarea value={formData.observacoesCreche.adequacoes} onChange={e => setFormData(prev => ({...prev, observacoesCreche: {...prev.observacoesCreche, adequacoes: e.target.value}}))} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" rows={3}/></div>
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
