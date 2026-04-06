
import React, { useMemo } from 'react';
import { checklistCreche, checklistEscola, ItemVerificacao, RiscoNivel } from './diligenciaConfig';
import logo from '/logo-camara.png';

interface RelatorioImpressaoProps {
  data: any;
}

interface RespostaItem {
  conforme: string | boolean | null;
  observacao: string;
  fotos: string[];
}

interface ItemAnalise {
  item: ItemVerificacao;
  resposta: RespostaItem | null;
  conforme: boolean;
}

interface SecaoAnalise {
  titulo: string;
  itens: ItemAnalise[];
  conformes: number;
  naoConformes: number;
  percentual: number;
}

const getRiscoLabel = (risco: RiscoNivel): string => {
  const map: Record<RiscoNivel, string> = {
    'Nenhum': '—',
    'Baixo': '🟢 Baixo',
    'Médio': '🟡 Médio',
    'Alto': '🟠 Alto',
    'Crítico': '🔴 Crítico',
  };
  return map[risco] || risco;
};

export default function RelatorioImpressao({ data }: RelatorioImpressaoProps) {
  const analise = useMemo(() => {
    if (!data || !data.respostas) return null;

    const checklist = data.tipificacao === 'Creche' ? checklistCreche : checklistEscola;
    const respostas = data.respostas as Record<string, any>;
    const nomeUnidade = data.nomeCreche || data.nomeEscola || 'Sem Nome';
    const tipo = data.tipificacao || 'Escola';

    // Agrupar por seção
    const secoesMap: Record<string, { titulo: string; itens: ItemAnalise[] }> = {};

    checklist.forEach(item => {
      if (!secoesMap[item.secao]) {
        secoesMap[item.secao] = { titulo: item.secao, itens: [] };
      }
      const respRaw = respostas[item.id];
      const conformeValue = typeof respRaw === 'object' ? respRaw?.conforme : respRaw;
      const observacao = typeof respRaw === 'object' ? respRaw?.observacao : '';
      const fotos = data.fotosGerais?.[item.id] || [];
      
      const resposta: RespostaItem = { conforme: conformeValue, observacao, fotos };
      
      // Ajuste para lidar com boolean ou string 'SIM'
      const conforme = conformeValue === 'SIM' || conformeValue === true;
      
      secoesMap[item.secao].itens.push({ item, resposta, conforme });
    });

    const secoes: SecaoAnalise[] = Object.values(secoesMap).map(sec => {
      const conformes = sec.itens.filter(i => i.conforme).length;
      const naoConformes = sec.itens.length - conformes;
      const percentual = sec.itens.length > 0 ? (conformes / sec.itens.length) * 100 : 100;
      return { ...sec, conformes, naoConformes, percentual };
    });

    const totalItens = checklist.length;
    const totalConformes = secoes.reduce((sum, s) => sum + s.conformes, 0);
    const percentualGeral = totalItens > 0 ? (totalConformes / totalItens) * 100 : 100;

    const naoConformidades = secoes.flatMap(s => 
      s.itens.filter(i => !i.conforme).map(i => ({ ...i, secao: s.titulo }))
    );

    const dataVistoria = data.timestamp?.toDate
      ? data.timestamp.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
      : 'Data não disponível';

    return { nomeUnidade, tipo, secoes, totalItens, totalConformes, percentualGeral, naoConformidades, dataVistoria, checklist };
  }, [data]);

  if (!analise) return null;

  const { nomeUnidade, tipo, secoes, totalItens, totalConformes, percentualGeral, naoConformidades, dataVistoria, checklist } = analise;

  const getStatusLabel = (pct: number) => {
    if (pct >= 80) return '✅ Adequado';
    if (pct >= 50) return '⚠️ Parcialmente Adequado';
    return '❌ Inadequado';
  };

  const isCreche = data.tipificacao === 'Creche';

  return (
    <div className="relatorio-impressao">
      <style>{`
        .relatorio-impressao { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          color: #1a202c; 
          background: white; 
          padding: 30px; 
          border-radius: 8px; 
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          max-width: 210mm;
          margin: 0 auto;
        }
        @media print {
          .relatorio-impressao { display: block !important; padding: 20mm; background: white; box-shadow: none; border-radius: 0; max-width: none; margin: 0; }
          .no-print { display: none !important; }
          body { background: white !important; }
        }
        .ri-header { display: flex; align-items: center; border-bottom: 2px solid #2d3748; padding-bottom: 15px; margin-bottom: 20px; }
        .ri-header img { height: 60px; margin-right: 20px; }
        .ri-header-text h1 { font-size: 18pt; margin: 0; color: #2d3748; }
        .ri-header-text p { font-size: 10pt; margin: 0; color: #718096; }
        .ri-section-title { font-size: 14pt; font-weight: bold; border-bottom: 1px solid #cbd5e0; margin-top: 25px; margin-bottom: 10px; color: #2b6cb0; page-break-after: avoid; }
        .ri-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
        .ri-info-item { font-size: 10pt; }
        .ri-info-label { font-weight: bold; color: #4a5568; margin-right: 5px; }
        .ri-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 9pt; }
        .ri-table th, .ri-table td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
        .ri-table th { background-color: #f7fafc; color: #4a5568; font-weight: bold; text-transform: uppercase; font-size: 8pt; }
        .ri-conforme { color: #38a169; font-weight: bold; }
        .ri-nao-conforme { color: #e53e3e; font-weight: bold; }
        .ri-resumo-box { border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .ri-resumo-grid { display: flex; justify-content: space-around; text-align: center; }
        .ri-big-number { font-size: 20pt; font-weight: bold; color: #2d3748; }
        .ri-label { font-size: 8pt; color: #718096; text-transform: uppercase; }
        .ri-foto-group { margin-bottom: 20px; page-break-inside: avoid; }
        .ri-foto-grid { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
        .ri-foto-grid img { width: 48%; border-radius: 4px; border: 1px solid #e2e8f0; }
        .ri-footer { margin-top: 50px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        .ri-assinatura { border-top: 1px solid #2d3748; display: inline-block; padding-top: 10px; min-width: 300px; margin-top: 40px; }
      `}</style>
      
      {/* Botão de Impressão no Topo (apenas tela) */}
      <div className="no-print flex justify-end mb-6">
          <button 
            onClick={() => window.print()} 
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg font-bold transition-all transform hover:scale-105"
          >
            <span>🖨️</span> Imprimir / Gerar PDF
          </button>
      </div>

      {/* === CABEÇALHO === */}
      <div className="ri-header">
        <img src={logo} alt="Logo" />
        <div className="ri-header-text">
          <h1>Relatório de Diligência Técnica</h1>
          <p>Câmara Municipal de Ubatuba — Fiscaliza Ubatuba</p>
        </div>
      </div>

      {/* === 1. IDENTIFICAÇÃO === */}
      <h2 className="ri-section-title">1. Dados de Identificação e Tipificação</h2>
      <div className="ri-info-grid">
        <div className="ri-info-item"><span className="ri-info-label">{isCreche ? 'Creche:' : 'Escola:'}</span> {nomeUnidade}</div>
        <div className="ri-info-item"><span className="ri-info-label">Tipo:</span> {tipo} — {data.tipificacaoUnidade || '—'}</div>
        <div className="ri-info-item"><span className="ri-info-label">Data:</span> {dataVistoria}</div>
        <div className="ri-info-item"><span className="ri-info-label">Diretor(a):</span> {data.nomeDiretor || '—'}</div>
        <div className="ri-info-item"><span className="ri-info-label">Região:</span> {data.regiao || '—'}</div>
        <div className="ri-info-item"><span className="ri-info-label">Telefone:</span> {data.telefone || '—'}</div>
        <div className="ri-info-item" style={{ gridColumn: 'span 2' }}><span className="ri-info-label">Endereço:</span> {data.endereco ? `${data.endereco} - ${data.bairro}` : '—'}</div>
        <div className="ri-info-item"><span className="ri-info-label">Total Alunos:</span> {data.totalAlunos || '—'}</div>
        <div className="ri-info-item"><span className="ri-info-label">Frequentando:</span> {data.alunosFrequentando || '—'}</div>
        <div className="ri-info-item"><span className="ri-info-label">Evasão:</span> {data.evasao || '—'}</div>
        <div className="ri-info-item"><span className="ri-info-label">Prestação Contas:</span> {data.prestacaoContas || '—'}</div>
      </div>

      {/* === 2. QUADRO FUNCIONAL === */}
      {isCreche ? (
          data.quadroFuncionalCreche && (
              <>
                <h2 className="ri-section-title">2. Quadro Funcional e Recursos Humanos</h2>
                <table className="ri-table">
                  <thead>
                    <tr>
                      <th style={{ width: '50%' }}>Função / Categoria</th>
                      <th style={{ width: '15%' }}>Qtd</th>
                      <th style={{ width: '35%' }}>Vínculo / Obs</th>
                    </tr>
                  </thead>
                  <tbody>
                      {[
                          { id: 'berçário', label: 'Agentes Educacionais/Cuidadores (Berçário)' },
                          { id: 'miniGrupos', label: 'Agentes Educacionais/Cuidadores (Mini-Grupos)' },
                          { id: 'profEfetivos', label: 'Professores Efetivos' },
                          { id: 'merendeiras', label: 'Merendeiras' },
                          { id: 'outros', label: 'Outros Funcionários (Limpeza, etc.)' },
                      ].map(row => (
                          <tr key={row.id}>
                              <td>{row.label}</td>
                              <td style={{ textAlign: 'center' }}>{data.quadroFuncionalCreche[row.id]?.quantidade || '0'}</td>
                              <td>{data.quadroFuncionalCreche[row.id]?.vinculo || '—'}</td>
                          </tr>
                      ))}
                  </tbody>
                </table>
                {/* Itens de checklist da seção 2 (se houver) */}
                {secoes.find(s => s.titulo.startsWith('2.'))?.itens.map(({ item, resposta, conforme }) => (
                    <div key={item.id} style={{ fontSize: '9pt', marginBottom: '5px' }}>
                         <strong>{item.texto}</strong> — <span className={conforme ? 'ri-conforme' : 'ri-nao-conforme'}>{conforme ? 'SIM' : 'NÃO'}</span> {resposta?.observacao && `(${resposta.observacao})`}
                    </div>
                ))}
              </>
          ) || null
      ) : (
        data.quadroFuncional && (
            <>
              <h2 className="ri-section-title">2. Quadro Funcional e Recursos Humanos</h2>
              <table className="ri-table">
                <thead>
                  <tr>
                    <th style={{ width: '50%' }}>Função / Categoria</th>
                    <th style={{ width: '15%' }}>Qtd</th>
                    <th style={{ width: '35%' }}>Vínculo / Obs</th>
                  </tr>
                </thead>
                <tbody>
                    {[
                        { id: 'agentes', label: 'Agentes Educacionais' },
                        { id: 'profEfetivos', label: 'Professores Efetivos' },
                        { id: 'profEventuais', label: 'Professores Eventuais' },
                        { id: 'merendeirasMat', label: 'Merendeiras (Mat)' },
                        { id: 'merendeirasVesp', label: 'Merendeiras (Vesp)' },
                        { id: 'merendeirasNot', label: 'Merendeiras (Not)' },
                        { id: 'outros', label: 'Outros Funcionários' },
                    ].map(row => (
                        <tr key={row.id}>
                            <td>{row.label}</td>
                            <td style={{ textAlign: 'center' }}>{data.quadroFuncional[row.id]?.quantidade || '0'}</td>
                            <td>{data.quadroFuncional[row.id]?.vinculo || '—'}</td>
                        </tr>
                    ))}
                </tbody>
              </table>
              <table className="ri-table">
                <thead>
                  <tr>
                    <th style={{ width: '50%' }}>Equipe Técnica</th>
                    <th style={{ width: '15%' }}>Qtd</th>
                    <th style={{ width: '35%' }}>Vínculo</th>
                  </tr>
                </thead>
                <tbody>
                    {[
                        { id: 'assistenteSocial', label: 'Assistente Social' },
                        { id: 'psicologo', label: 'Psicólogo' },
                        { id: 'psicopedagogo', label: 'Psicopedagogo' },
                        { id: 'fonoaudiologo', label: 'Fonoaudiólogo' },
                    ].map(row => (
                        <tr key={row.id}>
                            <td>{row.label}</td>
                            <td style={{ textAlign: 'center' }}>{data.equipeTecnica?.[row.id]?.quantidade || '0'}</td>
                            <td>{data.equipeTecnica?.[row.id]?.vinculo || '—'}</td>
                        </tr>
                    ))}
                </tbody>
              </table>
            </>
          ) || null
      )}

      {/* === 6. DESCRITIVAS (ESCOLA) / ÁREAS ESPECÍFICAS (CRECHE) === */}
      {!isCreche && data.perguntasDescritivas && (
        <>
          <h2 className="ri-section-title">6. Perguntas Descritivas (Atuação e Registro)</h2>
          <div style={{ fontSize: '10pt', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p><strong>Frequência (As.Soc/Psico):</strong> {data.perguntasDescritivas.freqAssisPsico || '—'}</p>
            <p><strong>Frequência (Psicoped/Fono):</strong> {data.perguntasDescritivas.freqPsicoFono || '—'}</p>
            <p><strong>Registro/Prontuários:</strong> {data.perguntasDescritivas.registroAtendimentos || '—'}</p>
            <p><strong>Integração/Relatórios:</strong> {data.perguntasDescritivas.integracaoRelatorios || '—'}</p>
          </div>
        </>
      )}

      {/* === DEMAIS CHECKLIST SECTIONS (3, 4, 5, 6, 7) === */}
      {secoes.filter(s => s.titulo.startsWith('3.') || s.titulo.startsWith('4.') || s.titulo.startsWith('5.') || s.titulo.startsWith('6.') || s.titulo.startsWith('7.')).map(secao => (
        <React.Fragment key={secao.titulo}>
          {/* Evitar duplicar a seção 6 se for escola (já tratada acima como descritiva) */}
          {!( !isCreche && secao.titulo.startsWith('6.') ) && (
              <>
                <h2 className="ri-section-title">{secao.titulo}</h2>
                <table className="ri-table">
                    <thead>
                    <tr>
                        <th style={{ width: '70%' }}>Item de Verificação</th>
                        <th style={{ width: '10%' }}>Conf.</th>
                        <th style={{ width: '20%' }}>Observações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {secao.itens.map(({ item, resposta, conforme }) => (
                        <tr key={item.id}>
                        <td>{item.texto}</td>
                        <td className={conforme ? 'ri-conforme' : 'ri-nao-conforme'}>
                            {conforme ? 'SIM' : 'NÃO'}
                        </td>
                        <td>{resposta?.observacao || '—'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
              </>
          )}
        </React.Fragment>
      ))}

      {/* === 8. RESUMO / OBSERVAÇÕES (CRECHE) === */}
      {isCreche && data.observacoesCreche && (
          <>
            <h2 className="ri-section-title">8. Observações e Adequações</h2>
            <div style={{ fontSize: '10pt', border: '1px solid #e2e8f0', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p><strong>Observações Gerais:</strong> {data.observacoesCreche.gerais || '—'}</p>
                <div style={{ padding: '8px', background: '#fff5f5', border: '1px solid #fed7d7' }}>
                    <strong>Adequações Prioritárias:</strong> {data.observacoesCreche.adequacoes || '—'}
                </div>
                <div style={{ padding: '8px', background: '#fefcbf', border: '1px solid #faf089' }}>
                    <strong>Orientação do CAE/Responsável:</strong> {data.observacoesCreche.orientacoesCAE || '—'}
                </div>
            </div>
          </>
      )}

      <h2 className="ri-section-title">{isCreche ? '9.' : '8.'} Resumo Executivo e Métricas</h2>
      <div className="ri-resumo-box">
        <div className="ri-resumo-grid">
          <div className="ri-resumo-item">
            <div className="ri-big-number">{percentualGeral.toFixed(1)}%</div>
            <div className="ri-label">Conformidade Geral</div>
          </div>
          <div className="ri-resumo-item">
            <div className="ri-big-number">{totalConformes}/{totalItens}</div>
            <div className="ri-label">Itens Conformes</div>
          </div>
          <div className="ri-resumo-item">
            <div className="ri-big-number">{getStatusLabel(percentualGeral)}</div>
            <div className="ri-label">Status Geral</div>
          </div>
        </div>
      </div>

      <h2 className="ri-section-title">{isCreche ? '10.' : '9.'} Não Conformidades Identificadas</h2>
      {naoConformidades.length > 0 ? (
          <table className="ri-table">
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Área / Item</th>
                <th style={{ width: '15%' }}>Risco</th>
                <th style={{ width: '45%' }}>Observações</th>
              </tr>
            </thead>
            <tbody>
              {naoConformidades.sort((a,b) => {
                  const r: any = { 'Crítico': 4, 'Alto': 3, 'Médio': 2, 'Baixo': 1, 'Nenhum': 0 };
                  return (r[b.item.riscoNaoConforme] || 0) - (r[a.item.riscoNaoConforme] || 0);
              }).map(nc => (
                <tr key={nc.item.id}>
                  <td><strong>{nc.item.texto}</strong><br/><small>{nc.secao}</small></td>
                  <td>{getRiscoLabel(nc.item.riscoNaoConforme)}</td>
                  <td>{nc.resposta?.observacao || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
      ) : <p style={{ fontSize: '10pt', color: '#718096' }}>Nenhuma não conformidade identificada.</p>}

      {/* === REGISTRO FOTOGRÁFICO === */}
      {(() => {
        const itensComFotos = Object.entries(data.respostas || {})
          .map(([id]: [string, any]) => ({ 
            item: checklist.find(i => i.id === id), 
            fotos: data.fotosGerais?.[id] || [] 
          }))
          .filter(x => x.item && x.fotos.length > 0);

        if (itensComFotos.length === 0) return null;
        return (
          <>
            <h2 className="ri-section-title" style={{ pageBreakBefore: 'always' }}>{isCreche ? '11.' : '10.'} Registro Fotográfico</h2>
            {itensComFotos.map(x => (
              <div key={x.item!.id} className="ri-foto-group">
                <h4 style={{ fontSize: '10pt', margin: '0 0 5px 0' }}>{x.item!.secao} — {x.item!.texto}</h4>
                <div className="ri-foto-grid">
                  {x.fotos.map((foto: string, i: number) => (
                    <img key={i} src={foto} alt="Evidência" />
                  ))}
                </div>
              </div>
            ))}
          </>
        );
      })()}

      <div className="ri-footer">
        <div className="ri-assinatura">
          <p style={{ fontWeight: 'bold' }}>Responsável pela Vistoria</p>
          <p>Câmara Municipal de Ubatuba</p>
          <p>{dataVistoria}</p>
        </div>
      </div>
    </div>
  );
}
