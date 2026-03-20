
import React, { useMemo } from 'react';
import { checklistCreche, checklistEscola, ItemVerificacao, RiscoNivel } from './diligenciaConfig';

// --- TIPOS E INTERFACES ---
interface RelatorioProps {
  data: any; // Dados da diligência salvos no Firestore
}

interface RespostaItem {
  conforme: boolean | null;
  observacao: string;
  fotos: string[];
}

interface NaoConformidade {
  item: ItemVerificacao;
  observacao: string;
  fotos: string[];
}

interface AnaliseSecao {
  titulo: string;
  conformidade: number; // Percentual de 0 a 100
  naoConformidades: NaoConformidade[];
  riscoMaximo: RiscoNivel;
  status: 'Adequada' | 'Inadequada' | 'Parcialmente Adequada';
}


// --- FUNÇÕES DE CÁLCULO E ANÁLISE ---

const getRiscoValue = (risco: RiscoNivel): number => {
  const mapaRisco: Record<RiscoNivel, number> = {
    'Nenhum': 0,
    'Baixo': 1,
    'Médio': 2,
    'Alto': 3,
    'Crítico': 4,
  };
  return mapaRisco[risco] || 0;
};

const getStatusGeral = (conformidade: number, risco: RiscoNivel): '✅ Adequado' | '⚠️ Parcialmente adequado' | '❌ Inadequado' => {
  if (risco === 'Crítico' || conformidade < 50) return '❌ Inadequado';
  if (risco === 'Alto' || conformidade < 80) return '⚠️ Parcialmente adequado';
  return '✅ Adequado';
}

const getStatusSecao = (conformidade: number, risco: RiscoNivel): 'Adequada' | 'Parcialmente Adequada' | 'Inadequada' => {
  if (risco === 'Crítico' || risco === 'Alto' || conformidade < 60) return 'Inadequada';
  if (conformidade < 90) return 'Parcialmente Adequada';
  return 'Adequada';
}

// --- COMPONENTES DE UI DO RELATÓRIO ---

const getRiscoClass = (risco: RiscoNivel) => {
    const riskColorMap: Record<RiscoNivel, string> = {
        'Crítico': 'bg-red-700 text-white',
        'Alto': 'bg-red-500 text-white',
        'Médio': 'bg-yellow-500 text-black',
        'Baixo': 'bg-blue-500 text-white',
        'Nenhum': 'bg-gray-200 text-black'
    };
    return `px-2 py-1 text-xs font-bold rounded-full ${riskColorMap[risco]}`;
}

const RelatorioHeader: React.FC<{ title: string }> = ({ title }) => (
    <h2 className="text-xl font-bold text-primary border-b-2 border-primary pb-2 mb-4 mt-8 print:text-lg">{title}</h2>
);

const ResumoItem: React.FC<{ label: string, value: React.ReactNode, valueClassName?: string }> = ({ label, value, valueClassName = '' }) => (
    <div className="mb-2 print:text-sm">
        <span className="font-semibold text-gray-600">{label}:</span>
        <span className={`ml-2 ${valueClassName}`}>{value}</span>
    </div>
);

// --- COMPONENTE PRINCIPAL ---

export default function Relatorio({ data }: RelatorioProps) {

  const analise = useMemo(() => {
    if (!data || !data.respostas) return null;

    const checklist = data.tipificacao === 'Creche' ? checklistCreche : checklistEscola;
    const respostas = data.respostas as Record<string, RespostaItem>;

    const todasNaoConformidades: NaoConformidade[] = [];
    let totalItens = checklist.length;
    let totalItensConformes = 0;

    checklist.forEach(item => {
      const resposta = respostas[item.id];
      // Considera conforme se a resposta não existir ou for explicitamente conforme
      const isConforme = !resposta || resposta.conforme === true;
      
      if (isConforme) {
          totalItensConformes++;
      } else {
          todasNaoConformidades.push({
              item,
              observacao: resposta.observacao,
              fotos: resposta.fotos || [],
          });
      }
    });

    const conformidadeGeral = totalItens > 0 ? (totalItensConformes / totalItens) * 100 : 100;
    
    const riscoGeral = todasNaoConformidades.reduce((maxRisco, nc) => {
        return getRiscoValue(nc.item.riscoNaoConforme) > getRiscoValue(maxRisco) ? nc.item.riscoNaoConforme : maxRisco;
    }, 'Nenhum' as RiscoNivel);

    const statusGeral = getStatusGeral(conformidadeGeral, riscoGeral);

    const analisePorSecao = checklist.reduce((acc, item) => {
        if (!acc[item.secao]) {
            acc[item.secao] = {
                titulo: item.secao,
                totalItens: 0,
                conformidades: 0,
                naoConformidades: [],
            };
        }
        acc[item.secao].totalItens++;
        const resposta = respostas[item.id];
        const isConforme = !resposta || resposta.conforme === true;

        if (isConforme) {
            acc[item.secao].conformidades++;
        } else {
            acc[item.secao].naoConformidades.push({ item, observacao: resposta.observacao, fotos: resposta.fotos || [] });
        }
        return acc;
    }, {} as any);

    const secoesProcessadas: AnaliseSecao[] = Object.values(analisePorSecao).map((s: any) => {
        const conformidade = s.totalItens > 0 ? (s.conformidades / s.totalItens) * 100 : 100;
        const riscoMaximo = s.naoConformidades.reduce((max: RiscoNivel, nc: NaoConformidade) => (
            getRiscoValue(nc.item.riscoNaoConforme) > getRiscoValue(max) ? nc.item.riscoNaoConforme : max
        ), 'Nenhum');

        return {
            titulo: s.titulo,
            conformidade,
            naoConformidades: s.naoConformidades,
            riscoMaximo,
            status: getStatusSecao(conformidade, riscoMaximo),
        };
    });

    return {
        conformidadeGeral,
        riscoGeral,
        statusGeral,
        principaisProblemas: todasNaoConformidades
          .sort((a, b) => getRiscoValue(b.item.riscoNaoConforme) - getRiscoValue(a.item.riscoNaoConforme))
          .slice(0, 3),
        naoConformidadesOrdenadas: todasNaoConformidades
          .sort((a, b) => getRiscoValue(b.item.riscoNaoConforme) - getRiscoValue(a.item.riscoNaoConforme)),
        secoes: secoesProcessadas,
        data,
    };
  }, [data]);

  if (!analise) {
    return <div className="p-8 text-center text-gray-500 bg-white">Dados insuficientes para gerar o relatório.</div>;
  }
  
  const { conformidadeGeral, riscoGeral, statusGeral, principaisProblemas, naoConformidadesOrdenadas, secoes } = analise;

  return (
    <div className="p-4 sm:p-8 bg-white text-gray-800 font-sans print:p-2">
      <div className="max-w-4xl mx-auto">

        <header className="text-center mb-10 border-b-4 border-gray-800 pb-4">
            <h1 className="text-3xl font-bold uppercase print:text-2xl">Relatório de Diligência Técnica</h1>
            <p className="text-lg text-gray-600 print:text-base">{analise.data.nomeCreche || analise.data.nomeEscola}</p>
        </header>
        
        {/* 1. Identificação da Diligência */}
        <RelatorioHeader title="1. Identificação da Diligência" />
        <ResumoItem label="Instituição" value={<strong>{analise.data.nomeCreche || analise.data.nomeEscola}</strong>} />
        <ResumoItem label="Tipo" value={analise.data.tipificacao} />
        <ResumoItem label="Data da Vistoria" value={new Date(analise.data.timestamp?.toDate() || Date.now()).toLocaleDateString('pt-BR')} />
        <ResumoItem label="Responsável pela Vistoria" value={"(Nome do Responsável)"} />
        <ResumoItem label="Órgão" value="Câmara Municipal" />

        {/* 2. Objetivo da Vistoria */}
        <RelatorioHeader title="2. Objetivo da Vistoria" />
        <p className="text-gray-700 italic print:text-sm">
            Avaliar as condições estruturais, operacionais e de segurança da instituição de ensino, a fim de identificar não conformidades,
            diagnosticar riscos e fornecer recomendações técnicas para subsidiar a fiscalização e a tomada de decisão pelo poder público.
        </p>
        
        {/* 3. Resumo Executivo */}
        <RelatorioHeader title="3. Resumo Executivo" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg">
            <div>
                <ResumoItem label="Status Geral" value={statusGeral} valueClassName="font-bold text-lg" />
                <ResumoItem label="Índice Geral de Conformidade" value={`${conformidadeGeral.toFixed(1)}%`} valueClassName="font-bold text-lg" />
                <ResumoItem label="Risco Identificado" value={<span className={getRiscoClass(riscoGeral)}>{riscoGeral}</span>} />
            </div>
            <div>
                <p className="font-semibold text-gray-600">Principais Problemas Encontrados:</p>
                <ul className="list-disc list-inside text-sm text-red-600">
                    {principaisProblemas.length > 0 ? principaisProblemas.map(p => (
                        <li key={p.item.id}>{p.item.texto} <span className="font-bold">({p.item.riscoNaoConforme})</span></li>
                    )) : <li>Nenhum problema de alto impacto encontrado.</li>}
                </ul>
            </div>
        </div>

        {/* 4. Classificação por Área */}
        <RelatorioHeader title="4. Classificação por Área" />
        <div className="space-y-4">
            {secoes.map(sec => (
                <div key={sec.titulo} className="p-3 border rounded-lg">
                    <h3 className="font-bold text-lg">{sec.titulo}</h3>
                    <ResumoItem label="Situação" value={sec.status} valueClassName={sec.status === 'Inadequada' ? 'font-bold text-red-600' : ''} />
                    <ResumoItem label="Problemas Encontrados" value={`${sec.naoConformidades.length} item(s)`} />
                    <ResumoItem label="Grau de Risco da Seção" value={<span className={getRiscoClass(sec.riscoMaximo)}>{sec.riscoMaximo}</span>} />
                </div>
            ))}
        </div>

        {/* 5. Não Conformidades */}
        <RelatorioHeader title="5. Não Conformidades" />
        <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="border p-2 text-left">Item</th>
                        <th className="border p-2 text-left">Problema</th>
                        <th className="border p-2 text-left">Gravidade</th>
                        <th className="border p-2 text-left">Ação Recomendada</th>
                    </tr>
                </thead>
                <tbody>
                    {naoConformidadesOrdenadas.map(nc => (
                        <tr key={nc.item.id} className="break-inside-avoid">
                            <td className="border p-2 font-semibold">{nc.item.secao}</td>
                            <td className="border p-2">{nc.item.texto}</td>
                            <td className="border p-2"><span className={getRiscoClass(nc.item.riscoNaoConforme)}>{nc.item.riscoNaoConforme}</span></td>
                            <td className="border p-2 text-red-700">{nc.observacao || '(Nenhuma ação descrita)'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* 6. Registro Fotográfico */}
        <RelatorioHeader title="6. Registro Fotográfico" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-1">
          {naoConformidadesOrdenadas.filter(nc => nc.fotos && nc.fotos.length > 0).map(nc => (
            <div key={nc.item.id} className="p-2 border rounded-lg break-inside-avoid">
              <p className="font-bold text-sm mb-2">{nc.item.texto}</p>
              <div className="grid grid-cols-2 gap-2">
                {nc.fotos.map((foto, index) => (
                    <a key={index} href={foto} target="_blank" rel="noopener noreferrer">
                        <img src={foto} alt={`Foto ${index + 1} para ${nc.item.id}`} className="w-full h-auto rounded-md shadow-md" />
                    </a>
                ))}
              </div>
              <p className="text-xs italic text-gray-600 mt-2"><strong>Observação:</strong> {nc.observacao}</p>
            </div>
          ))}
        </div>

        {/* 7. Recomendações */}
        <RelatorioHeader title="7. Recomendações" />
        <div className="space-y-3">
            <div className="break-inside-avoid">
                <h4 className="font-bold text-red-700">Ações Imediatas (Risco Crítico)</h4>
                <ul className="list-disc list-inside text-sm">
                    {naoConformidadesOrdenadas.filter(nc => nc.item.riscoNaoConforme === 'Crítico').map(nc => <li key={nc.item.id}>{nc.item.texto}: <strong>{nc.observacao}</strong></li>)}
                </ul>
            </div>
            <div className="break-inside-avoid">
                <h4 className="font-bold text-red-500">Curto Prazo (Risco Alto)</h4>
                <ul className="list-disc list-inside text-sm">
                    {naoConformidadesOrdenadas.filter(nc => nc.item.riscoNaoConforme === 'Alto').map(nc => <li key={nc.item.id}>{nc.item.texto}: <strong>{nc.observacao}</strong></li>)}
                </ul>
            </div>
             <div className="break-inside-avoid">
                <h4 className="font-bold text-yellow-600">Melhoria Contínua (Risco Médio/Baixo)</h4>
                <ul className="list-disc list-inside text-sm">
                    {naoConformidadesOrdenadas.filter(nc => ['Médio', 'Baixo'].includes(nc.item.riscoNaoConforme)).map(nc => <li key={nc.item.id}>{nc.item.texto}: <strong>{nc.observacao}</strong></li>)}
                </ul>
            </div>
        </div>
        
        {/* 8. Conclusão Técnica */}
        <RelatorioHeader title="8. Conclusão Técnica" />
        <p className="text-gray-700 print:text-sm">
            Com base na análise, a unidade apresenta condições <strong>{statusGeral.split(' ')[1].toLowerCase()}</strong>. 
            O índice de conformidade de <strong>{conformidadeGeral.toFixed(1)}%</strong> e a presença de não conformidades de risco <strong>{riscoGeral}</strong> indicam
            a necessidade de intervenção {riscoGeral === 'Crítico' || riscoGeral === 'Alto' ? 'prioritária e urgente' : 'para melhoria contínua'}.
            Recomenda-se o seguimento rigoroso das ações corretivas listadas.
        </p>

        {/* 9. Responsável e Assinatura */}
        <div className="mt-20 text-center print:mt-12">
            <div className="inline-block border-t-2 border-gray-700 px-10 py-2">
                <p className="font-bold">{"(Nome do Responsável)"}</p>
                <p className="text-sm">Responsável pela Vistoria</p>
                <p className="text-sm">Câmara Municipal</p>
            </div>
        </div>
      </div>
    </div>
  );
}
