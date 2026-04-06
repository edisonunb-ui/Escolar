
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebaseConfig';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { schoolNames, unidadesEnsino } from './escolas';
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
  tipificacaoUnidade: string; // Creche, Etapa, Fundamental
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
export default function QuestionarioEscolar({ initialData, isReadOnly = false }: QuestionarioEscolarProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({ 
    nomeEscola: '', 
    nomeDiretor: '', 
    totalAlunos: '', 
    alunosFrequentando: '', 
    evasao: '', 
    prestacaoContas: '', 
    tipificacaoUnidade: '',
    regiao: '',
    endereco: '',
    bairro: '',
    telefone: '',
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
    perguntasDescritivas: {
        freqAssisPsico: '',
        freqPsicoFono: '',
        registroAtendimentos: '',
        integracaoRelatorios: '',
    },
    avaliacaoAluno: {
        gostaMais: '',
        gostariaDiferente: '',
        seSenteSeguro: '',
        opiniaoMerenda: '',
        limpezaBanheiros: '',
    },
    adequacoesPNAE: '',
  });

  // Efeito para auto-preencher dados da escola
  useEffect(() => {
    if (formData.nomeEscola && !isReadOnly) {
      const unidade = unidadesEnsino.find(u => u.nome === formData.nomeEscola);
      if (unidade) {
        setFormData(prev => ({
          ...prev,
          regiao: unidade.regiao,
          endereco: unidade.endereco,
          bairro: unidade.bairro,
          telefone: unidade.telefone
        }));
      }
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
    return () => {
      Object.values(localPhotoPreviews).flat().forEach(URL.revokeObjectURL);
    };
  }, [localPhotoPreviews]);

  const secoes = useMemo(() => {
    const grouped = checklistEscola.reduce((acc, item) => {
        const secao = item.secao || 'Geral';
        if (!acc[secao]) { acc[secao] = { titulo: secao, subsecoes: {} }; }
        const subSecao = item.subSecao || 'Itens';
        if (!acc[secao].subsecoes[subSecao]) { acc[secao].subsecoes[subSecao] = []; }
        acc[secao].subsecoes[subSecao].push(item);
        return acc;
      }, {} as Record<string, { titulo: string; subsecoes: Record<string, ItemVerificacao[]> }>);

      const secoesOrdenadas = Object.values(grouped).map(g => ({ 
        titulo: g.titulo, 
        type: 'checklist',
        subsecoes: Object.entries(g.subsecoes).map(([subTitulo, itens]) => ({ titulo: subTitulo, itens })) 
      }));

      const secoesFinal = [
        { titulo: '1. Dados de Identificação e Tipificação', type: 'id', subsecoes: [] },
        { 
          titulo: '2. Quadro Funcional e Recursos Humanos', 
          type: 'quadro', 
          subsecoes: secoesOrdenadas.find(s => s.titulo === '2. Quadro Funcional e Recursos Humanos')?.subsecoes || [] 
        },
        ...(secoesOrdenadas.filter(s => s.titulo === '3. Gestão Financeira e APM/CAE')),
        ...(secoesOrdenadas.filter(s => s.titulo === '4. Avaliação Estrutural')),
        ...(secoesOrdenadas.filter(s => s.titulo === '5. Avaliação da Cozinha e Refeitório')),
        { titulo: '6. Perguntas Descritivas (Atuação e Registro)', type: 'descritivas', subsecoes: [] },
        ...(secoesOrdenadas.filter(s => s.titulo === '7. Áreas Específicas e Infraestrutura')),
      ];

      return secoesFinal;
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ 
        ...prev, 
        ...initialData, 
        id: initialData.id, 
        respostas: getInitialAnswers(initialData),
        quadroFuncional: initialData.quadroFuncional || prev.quadroFuncional,
        equipeTecnica: initialData.equipeTecnica || prev.equipeTecnica,
        perguntasDescritivas: initialData.perguntasDescritivas || prev.perguntasDescritivas,
        avaliacaoAluno: initialData.avaliacaoAluno || prev.avaliacaoAluno,
        adequacoesPNAE: initialData.adequacoesPNAE || prev.adequacoesPNAE,
        tipificacaoUnidade: initialData.tipificacaoUnidade || prev.tipificacaoUnidade,
        regiao: initialData.regiao || prev.regiao,
        endereco: initialData.endereco || prev.endereco,
        bairro: initialData.bairro || prev.bairro,
        telefone: initialData.telefone || prev.telefone
      }));
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
    if (!formData.nomeEscola && !isReadOnly) {
        alert('Por favor, selecione uma escola antes de adicionar fotos.');
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
        if (!formData.nomeEscola || !formData.nomeDiretor || !formData.totalAlunos || !formData.alunosFrequentando || !formData.evasao || !formData.prestacaoContas) {
            alert('Por favor, preencha todos os campos de identificação para prosseguir.');
            return;
        }
    }

    if (activeSection === 1) {
        // Validação obrigatória do Quadro Funcional (seção 1 agora)
        const qf = formData.quadroFuncional;
        const camposObrigatorios = [
            { val: qf.agentes.quantidade, label: 'Agentes de Organização' },
            { val: qf.profEfetivos.quantidade, label: 'Professores Efetivos' },
            { val: qf.profEventuais.quantidade, label: 'Professores Eventuais' },
            { val: qf.merendeirasMat.quantidade, label: 'Merendeiras (Manhã)' },
            { val: qf.merendeirasVesp.quantidade, label: 'Merendeiras (Tarde)' },
            { val: qf.merendeirasNot.quantidade, label: 'Merendeiras (Noite)' },
            { val: qf.outros.quantidade, label: 'Outros Funcionários' }
        ];

        const faltando = camposObrigatorios.filter(c => c.val === '');
        if (faltando.length > 0) {
            alert(`Por favor, preencha a quantidade para: ${faltando.map(f => f.label).join(', ')}. Caso não possua, preencha com 0.`);
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
      const escolaPath = sanitizeForPath(formData.nomeEscola);
      let currentDocId = formData.id;

      if (!currentDocId) {
        const docData = { 
            nomeEscola: formData.nomeEscola, 
            timestamp: serverTimestamp(), 
            tipificacao: 'Escola',
            nomeDiretor: formData.nomeDiretor,
            totalAlunos: formData.totalAlunos,
            alunosFrequentando: formData.alunosFrequentando,
            evasao: formData.evasao,
            prestacaoContas: formData.prestacaoContas,
            regiao: formData.regiao,
            endereco: formData.endereco,
            bairro: formData.bairro,
            telefone: formData.telefone,
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
              const path = `diligencias/${escolaPath}/${currentDocId}/${fileName}`;
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
        ...formData,
        respostas: updatedRespostas,
        timestamp: serverTimestamp(),
        tipificacao: 'Escola'
      };

      await updateDoc(doc(db, 'diligencias', currentDocId), finalDataToSave);

      setFormData(prev => ({...prev, respostas: updatedRespostas}));
      setLocalPhotoPreviews({});
      setLocalPhotosData({});

      if (activeSection < secoes.length - 1) {
          setActiveSection(activeSection + 1);
      } else {
          alert('Diligência finalizada e salva com sucesso!');
          navigate('/');
      }

    } catch (error) {
      console.error("Erro ao salvar a diligência: ", error);
      alert('Ocorreu um erro ao salvar. Verifique o console para mais detalhes.');
    } finally {
      setIsSaving(false);
    }
  };

  const isIdentificationComplete = !!formData.nomeEscola && !!formData.nomeDiretor && !!formData.totalAlunos && !!formData.alunosFrequentando && !!formData.evasao && !!formData.prestacaoContas;

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
        
        <h1 className="text-xl sm:text-2xl font-bold mb-4">{isReadOnly ? `Visualizando: ${formData.nomeEscola}` : '🏫 Checklist de Conformidade — Escolas'}</h1>

        {secoes.map((sec: any, secIndex) => (
            <div key={secIndex} className={isReadOnly || activeSection === secIndex ? 'block mb-8' : 'hidden'}>
                {sec.type === 'id' && (
                    <Section title={sec.titulo}>
                        <label className="block mb-2 text-sm font-medium">Nome da Escola *</label>
                        <select name="nomeEscola" value={formData.nomeEscola} onChange={e => handleFieldChange('nomeEscola', e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-700 rounded disabled:opacity-50" disabled={isReadOnly || !!initialData}>
                            <option value="">Selecione uma escola</option>
                            {schoolNames.map(name => <option key={name} value={name}>{name}</option>)}
                        </select>

                        <div className="mt-4">
                            <label className="block mb-2 text-sm font-medium">Tipificação *</label>
                            <div className="flex gap-4 items-center text-sm">
                                {['Creche', 'Etapa', 'Fundamental'].map(t => (
                                    <label key={t} className="flex items-center gap-2">
                                        <input type="radio" value={t} checked={formData.tipificacaoUnidade === t} onChange={e => handleFieldChange('tipificacaoUnidade', e.target.value)} disabled={isReadOnly} className="h-4 w-4 bg-gray-800 border-gray-600"/> {t}
                                    </label>
                                ))}
                            </div>
                        </div>

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

                        {/* Campos auto-preenchidos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Região</p>
                                <p className="text-sm">{formData.regiao || '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Telefone</p>
                                <p className="text-sm">{formData.telefone || '—'}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-xs text-gray-500 uppercase font-bold">Endereço</p>
                                <p className="text-sm">{formData.endereco ? `${formData.endereco} - ${formData.bairro}` : '—'}</p>
                            </div>
                        </div>
                    </Section>
                )}

                {sec.type === 'checklist' && (
                     <Section title={sec.titulo}>
                        {sec.subsecoes.map((sub: any) => (
                            <SubSection key={sub.titulo} title={sub.titulo}>
                                {sub.itens.map((item: any) => (
                                    <VerificationItem key={item.id} item={item} resposta={formData.respostas[item.id]} localPhotos={localPhotoPreviews[item.id] || []} onChange={handleAnswerChange} onOpenCamera={handleOpenCamera} onImageClick={setLightboxUrl} disabled={isReadOnly}/>
                                ))}
                            </SubSection>
                        ))}
                    </Section>
                )}

                {sec.type === 'quadro' && (
                    <Section title={sec.titulo}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="py-2 px-1">Função / Vínculo</th>
                                        <th className="py-2 px-1 w-24 text-center">Quantidade</th>
                                        <th className="py-2 px-1">Vínculo Empregatício</th>
                                        <th className="py-2 px-1">Observações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { id: 'agentes', label: 'Agentes Educacionais' },
                                        { id: 'profEfetivos', label: 'Professores Efetivos' },
                                        { id: 'profEventuais', label: 'Professores Eventuais/Substitutos' },
                                        { id: 'merendeirasMat', label: 'Merendeiras - Matutino' },
                                        { id: 'merendeirasVesp', label: 'Merendeiras - Vespertino' },
                                        { id: 'merendeirasNot', label: 'Merendeiras - Noturno' },
                                        { id: 'outros', label: 'Outros Funcionários (Limpeza, Segurança, etc.)' },
                                    ].map(row => (
                                        <tr key={row.id} className="border-b border-gray-800 last:border-0">
                                            <td className="py-2 px-1">{row.label}</td>
                                            <td className="py-2 px-1 text-center">
                                                <input type="text" value={formData.quadroFuncional[row.id].quantidade} onChange={e => setFormData(prev => ({ ...prev, quadroFuncional: { ...prev.quadroFuncional, [row.id]: { ...prev.quadroFuncional[row.id], quantidade: e.target.value } } }))} className="w-16 p-1 bg-gray-800 border border-gray-700 rounded text-center" disabled={isReadOnly} />
                                            </td>
                                            <td className="py-2 px-1">
                                                <select value={formData.quadroFuncional[row.id].vinculo} onChange={e => setFormData(prev => ({ ...prev, quadroFuncional: { ...prev.quadroFuncional, [row.id]: { ...prev.quadroFuncional[row.id], vinculo: e.target.value } } }))} className="w-full p-1 bg-gray-800 border border-gray-700 rounded" disabled={isReadOnly}>
                                                    <option value="">Selecione...</option>
                                                    <option value="Contrato">Contrato</option>
                                                    <option value="Concurso">Concurso</option>
                                                </select>
                                            </td>
                                            <td className="py-2 px-1">
                                                <input type="text" value={formData.quadroFuncional[row.id].observacao} onChange={e => setFormData(prev => ({ ...prev, quadroFuncional: { ...prev.quadroFuncional, [row.id]: { ...prev.quadroFuncional[row.id], observacao: e.target.value } } }))} className="w-full p-1 bg-gray-800 border border-gray-700 rounded" placeholder="..." disabled={isReadOnly} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-8 overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="py-2 px-1">Função / Especialista</th>
                                        <th className="py-2 px-1 w-24 text-center">Quantidade</th>
                                        <th className="py-2 px-1">Vínculo Empregatício</th>
                                        <th className="py-2 px-1">Observações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { id: 'assistenteSocial', label: 'Assistente Social' },
                                        { id: 'psicologo', label: 'Psicólogo' },
                                        { id: 'psicopedagogo', label: 'Psicopedagogo' },
                                        { id: 'fonoaudiologo', label: 'Fonoaudiólogo' },
                                    ].map(row => (
                                        <tr key={row.id} className="border-b border-gray-800 last:border-0">
                                            <td className="py-2 px-1">{row.label}</td>
                                            <td className="py-2 px-1 text-center">
                                                <input type="text" value={formData.equipeTecnica[row.id].quantidade} onChange={e => setFormData(prev => ({ ...prev, equipeTecnica: { ...prev.equipeTecnica, [row.id]: { ...prev.equipeTecnica[row.id], quantidade: e.target.value } } }))} className="w-16 p-1 bg-gray-800 border border-gray-700 rounded text-center" disabled={isReadOnly} />
                                            </td>
                                            <td className="py-2 px-1">
                                                <select value={formData.equipeTecnica[row.id].vinculo} onChange={e => setFormData(prev => ({ ...prev, equipeTecnica: { ...prev.equipeTecnica, [row.id]: { ...prev.equipeTecnica[row.id], vinculo: e.target.value } } }))} className="w-full p-1 bg-gray-800 border border-gray-700 rounded" disabled={isReadOnly}>
                                                    <option value="">Selecione...</option>
                                                    <option value="Contratado">Contratado</option>
                                                    <option value="Concursado">Concursado</option>
                                                </select>
                                            </td>
                                            <td className="py-2 px-1">
                                                <input type="text" value={formData.equipeTecnica[row.id].observacao} onChange={e => setFormData(prev => ({ ...prev, equipeTecnica: { ...prev.equipeTecnica, [row.id]: { ...prev.equipeTecnica[row.id], observacao: e.target.value } } }))} className="w-full p-1 bg-gray-800 border border-gray-700 rounded" placeholder="..." disabled={isReadOnly} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Checklist items for this section (e.g. Specialists Room) */}
                        {sec.subsecoes.length > 0 && (
                            <div className="mt-8 pt-4 border-t border-gray-700">
                                {sec.subsecoes.map((sub: any) => (
                                    <SubSection key={sub.titulo} title={sub.titulo}>
                                        {sub.itens.map((item: any) => (
                                            <VerificationItem key={item.id} item={item} resposta={formData.respostas[item.id]} localPhotos={localPhotoPreviews[item.id] || []} onChange={handleAnswerChange} onOpenCamera={handleOpenCamera} onImageClick={setLightboxUrl} disabled={isReadOnly}/>
                                        ))}
                                    </SubSection>
                                ))}
                            </div>
                        )}
                    </Section>
                )}

                {sec.type === 'descritivas' && (
                    <Section title={sec.titulo}>
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium">Frequência de Atuação: Qual a frequência (dias/horas por semana) de atuação do Assistente Social e do Psicólogo na escola?</label>
                                <textarea value={formData.perguntasDescritivas.freqAssisPsico} onChange={e => setFormData(prev => ({ ...prev, perguntasDescritivas: { ...prev.perguntasDescritivas, freqAssisPsico: e.target.value } }))} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" rows={2} disabled={isReadOnly} />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium">Frequência de Atuação: Caso a escola receba Psicopedagogo e/ou Fonoaudiólogo, qual a frequência desses profissionais e qual o critério de encaminhamento dos alunos?</label>
                                <textarea value={formData.perguntasDescritivas.freqPsicoFono} onChange={e => setFormData(prev => ({ ...prev, perguntasDescritivas: { ...prev.perguntasDescritivas, freqPsicoFono: e.target.value } }))} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" rows={2} disabled={isReadOnly} />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium">Registro de Atendimentos: A escola mantém um registro individualizado (prontuário ou relatório) dos atendimentos realizados por estes profissionais?</label>
                                <textarea value={formData.perguntasDescritivas.registroAtendimentos} onChange={e => setFormData(prev => ({ ...prev, perguntasDescritivas: { ...prev.perguntasDescritivas, registroAtendimentos: e.target.value } }))} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" rows={2} disabled={isReadOnly} />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium">Integração: Os relatórios dos atendimentos são compartilhados com os professores e a coordenação pedagógica?</label>
                                <textarea value={formData.perguntasDescritivas.integracaoRelatorios} onChange={e => setFormData(prev => ({ ...prev, perguntasDescritivas: { ...prev.perguntasDescritivas, integracaoRelatorios: e.target.value } }))} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" rows={2} disabled={isReadOnly} />
                            </div>
                        </div>
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
