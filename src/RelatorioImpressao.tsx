
import React, { useMemo } from 'react';
import { checklistCreche, checklistEscola, ItemVerificacao, RiscoNivel } from './diligenciaConfig';
import logo from '/logo-camara.png';

interface RelatorioImpressaoProps {
  data: any;
}

interface RespostaItem {
  conforme: boolean | null;
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
    const respostas = data.respostas as Record<string, RespostaItem>;
    const nomeUnidade = data.nomeCreche || data.nomeEscola || 'Sem Nome';
    const tipo = data.tipificacao || 'Escola';

    // Agrupar por seção
    const secoesMap: Record<string, { titulo: string; itens: ItemAnalise[] }> = {};

    checklist.forEach(item => {
      if (!secoesMap[item.secao]) {
        secoesMap[item.secao] = { titulo: item.secao, itens: [] };
      }
      const resposta = respostas[item.id] || null;
      const conforme = !resposta || resposta.conforme === null || 
        (item.logicaInvertida ? resposta.conforme === false : resposta.conforme === true);
      
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

    return { nomeUnidade, tipo, secoes, totalItens, totalConformes, percentualGeral, naoConformidades, dataVistoria };
  }, [data]);

  if (!analise) return null;

  const { nomeUnidade, tipo, secoes, totalItens, totalConformes, percentualGeral, naoConformidades, dataVistoria } = analise;

  const getStatusLabel = (pct: number) => {
    if (pct >= 80) return '✅ Adequado';
    if (pct >= 50) return '⚠️ Parcialmente Adequado';
    return '❌ Inadequado';
  };

  return (
    <div className="relatorio-impressao">
      <style>{`
        .relatorio-impressao {
          display: none;
        }

        @media print {
          /* Esconder header, nav e conteúdo de tela */
          body > #root > * > header,
          body > #root > * > main > * > .no-print,
          body > #root > * > main > * > .screen-only {
            display: none !important;
          }

          body, html {
            background: #fff !important;
          }

          .relatorio-impressao {
            display: block !important;
            position: relative;
            width: 100%;
            background: #fff !important;
          }

          /* Reset geral para impressão */
          .relatorio-impressao, .relatorio-impressao * {
            color: #1a1a1a !important;
            background: #fff !important;
            font-family: 'Segoe UI', 'Arial', sans-serif !important;
          }

          .relatorio-impressao {
            padding: 15mm 15mm 20mm 15mm;
            font-size: 11pt;
            line-height: 1.5;
          }

          .ri-header {
            display: flex;
            align-items: center;
            gap: 16px;
            border-bottom: 3px solid #1a365d;
            padding-bottom: 12px;
            margin-bottom: 20px;
          }

          .ri-header img {
            width: 70px;
            height: auto;
          }

          .ri-header-text {
            flex: 1;
          }

          .ri-header-text h1 {
            font-size: 16pt;
            font-weight: 800;
            color: #1a365d !important;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .ri-header-text p {
            font-size: 10pt;
            color: #4a5568 !important;
            margin: 2px 0 0 0;
          }

          .ri-section-title {
            font-size: 12pt;
            font-weight: 700;
            color: #1a365d !important;
            border-bottom: 2px solid #2b6cb0;
            padding-bottom: 4px;
            margin: 24px 0 12px 0;
            page-break-after: avoid;
          }

          .ri-info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px 24px;
            margin-bottom: 16px;
          }

          .ri-info-item {
            display: flex;
            gap: 6px;
            font-size: 10pt;
          }

          .ri-info-label {
            font-weight: 600;
            color: #4a5568 !important;
            min-width: 140px;
          }

          .ri-info-value {
            font-weight: 400;
          }

          .ri-resumo-box {
            border: 2px solid #2b6cb0;
            border-radius: 6px;
            padding: 12px 16px;
            margin: 12px 0 20px 0;
            page-break-inside: avoid;
          }

          .ri-resumo-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 12px;
            text-align: center;
          }

          .ri-resumo-item {
            padding: 8px;
          }

          .ri-resumo-item .ri-big-number {
            font-size: 20pt;
            font-weight: 800;
            line-height: 1.2;
          }

          .ri-resumo-item .ri-label {
            font-size: 8pt;
            color: #718096 !important;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .ri-bar-container {
            background: #e2e8f0 !important;
            height: 12px;
            border-radius: 6px;
            margin-top: 8px;
            overflow: hidden;
          }

          .ri-bar-fill {
            height: 100%;
            border-radius: 6px;
            background: #2b6cb0 !important;
          }

          /* Tabelas */
          .ri-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9pt;
            margin: 8px 0 16px 0;
          }

          .ri-table th {
            background: #edf2f7 !important;
            font-weight: 700;
            text-align: left;
            padding: 6px 8px;
            border: 1px solid #cbd5e0;
            color: #2d3748 !important;
            font-size: 8pt;
            text-transform: uppercase;
          }

          .ri-table td {
            padding: 5px 8px;
            border: 1px solid #e2e8f0;
            vertical-align: top;
          }

          .ri-table tr {
            page-break-inside: avoid;
          }

          .ri-conforme { color: #276749 !important; font-weight: 600; }
          .ri-nao-conforme { color: #c53030 !important; font-weight: 600; }

          /* Seção de conformidade por área */
          .ri-secao-card {
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 8px 12px;
            margin-bottom: 8px;
            page-break-inside: avoid;
          }

          .ri-secao-card h4 {
            font-size: 10pt;
            font-weight: 700;
            margin: 0 0 4px 0;
          }

          .ri-secao-card .ri-secao-stats {
            display: flex;
            gap: 16px;
            font-size: 9pt;
          }

          /* Fotos */
          .ri-fotos-section {
            page-break-before: auto;
          }

          .ri-foto-group {
            page-break-inside: avoid;
            margin-bottom: 12px;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 8px;
          }

          .ri-foto-group h4 {
            font-size: 9pt;
            font-weight: 600;
            margin: 0 0 6px 0;
          }

          .ri-foto-grid {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }

          .ri-foto-grid img {
            width: 180px;
            height: auto;
            border-radius: 4px;
            border: 1px solid #cbd5e0;
          }

          .ri-footer {
            margin-top: 40px;
            text-align: center;
            border-top: 2px solid #1a365d;
            padding-top: 16px;
            page-break-inside: avoid;
          }

          .ri-footer .ri-assinatura {
            display: inline-block;
            border-top: 1px solid #4a5568;
            padding-top: 6px;
            min-width: 250px;
            margin-top: 50px;
          }

          .ri-objetivo {
            font-style: italic;
            font-size: 10pt;
            color: #4a5568 !important;
            margin: 8px 0;
          }
        }
      `}</style>

      {/* === CABEÇALHO === */}
      <div className="ri-header">
        <img src={logo} alt="Brasão da Câmara Municipal" />
        <div className="ri-header-text">
          <h1>Relatório de Diligência Técnica</h1>
          <p>Câmara Municipal de Ubatuba — Fiscaliza Ubatuba</p>
        </div>
      </div>

      {/* === 1. IDENTIFICAÇÃO === */}
      <h2 className="ri-section-title">1. Identificação da Diligência</h2>
      <div className="ri-info-grid">
        <div className="ri-info-item">
          <span className="ri-info-label">Instituição:</span>
          <span className="ri-info-value"><strong>{nomeUnidade}</strong></span>
        </div>
        <div className="ri-info-item">
          <span className="ri-info-label">Tipo:</span>
          <span className="ri-info-value">{tipo}</span>
        </div>
        <div className="ri-info-item">
          <span className="ri-info-label">Data da Vistoria:</span>
          <span className="ri-info-value">{dataVistoria}</span>
        </div>
        <div className="ri-info-item">
          <span className="ri-info-label">Diretor(a):</span>
          <span className="ri-info-value">{data.nomeDiretor || '—'}</span>
        </div>
        <div className="ri-info-item">
          <span className="ri-info-label">Total de Alunos:</span>
          <span className="ri-info-value">{data.totalAlunos || '—'}</span>
        </div>
        <div className="ri-info-item">
          <span className="ri-info-label">Frequentando:</span>
          <span className="ri-info-value">{data.alunosFrequentando || '—'}</span>
        </div>
        <div className="ri-info-item">
          <span className="ri-info-label">Evasão:</span>
          <span className="ri-info-value">{data.evasao || '—'}</span>
        </div>
        <div className="ri-info-item">
          <span className="ri-info-label">Prestação de Contas:</span>
          <span className="ri-info-value">{data.prestacaoContas || '—'}</span>
        </div>
      </div>

      {/* === 2. OBJETIVO === */}
      <h2 className="ri-section-title">2. Objetivo da Vistoria</h2>
      <p className="ri-objetivo">
        Avaliar as condições estruturais, operacionais e de segurança da instituição de ensino, 
        a fim de identificar não conformidades, diagnosticar riscos e fornecer recomendações técnicas 
        para subsidiar a fiscalização e a tomada de decisão pelo poder público.
      </p>

      {/* === 3. RESUMO EXECUTIVO === */}
      <h2 className="ri-section-title">3. Resumo Executivo</h2>
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
        <div className="ri-bar-container">
          <div className="ri-bar-fill" style={{ width: `${percentualGeral}%` }}></div>
        </div>
      </div>

      {/* === 4. CONFORMIDADE POR ÁREA === */}
      <h2 className="ri-section-title">4. Conformidade por Área</h2>
      {secoes.map((sec) => (
        <div key={sec.titulo} className="ri-secao-card">
          <h4>{sec.titulo}</h4>
          <div className="ri-secao-stats">
            <span>Conformidade: <strong>{sec.percentual.toFixed(0)}%</strong></span>
            <span className="ri-conforme">✓ {sec.conformes} conforme(s)</span>
            <span className="ri-nao-conforme">✗ {sec.naoConformes} não conforme(s)</span>
          </div>
          <div className="ri-bar-container">
            <div className="ri-bar-fill" style={{ width: `${sec.percentual}%` }}></div>
          </div>
        </div>
      ))}

      {/* === 5. DETALHAMENTO COMPLETO === */}
      <h2 className="ri-section-title">5. Detalhamento dos Itens Avaliados</h2>
      {secoes.map(sec => (
        <React.Fragment key={sec.titulo}>
          <h4 style={{ fontSize: '10pt', fontWeight: 700, margin: '12px 0 4px 0' }}>{sec.titulo}</h4>
          <table className="ri-table">
            <thead>
              <tr>
                <th style={{ width: '55%' }}>Item de Verificação</th>
                <th style={{ width: '10%' }}>Situação</th>
                <th style={{ width: '10%' }}>Risco</th>
                <th style={{ width: '25%' }}>Observação</th>
              </tr>
            </thead>
            <tbody>
              {sec.itens.map(({ item, resposta, conforme }) => (
                <tr key={item.id}>
                  <td>{item.texto}</td>
                  <td className={conforme ? 'ri-conforme' : 'ri-nao-conforme'}>
                    {conforme ? '✓ Conforme' : '✗ Não Conforme'}
                  </td>
                  <td>{!conforme ? getRiscoLabel(item.riscoNaoConforme) : '—'}</td>
                  <td>{resposta?.observacao || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </React.Fragment>
      ))}

      {/* === 6. NÃO CONFORMIDADES CRÍTICAS === */}
      {naoConformidades.length > 0 && (
        <>
          <h2 className="ri-section-title">6. Não Conformidades Identificadas</h2>
          <table className="ri-table">
            <thead>
              <tr>
                <th>Área</th>
                <th>Problema Identificado</th>
                <th>Grau de Risco</th>
                <th>Observação / Ação Recomendada</th>
              </tr>
            </thead>
            <tbody>
              {naoConformidades
                .sort((a, b) => {
                  const riskOrder: Record<RiscoNivel, number> = { 'Crítico': 4, 'Alto': 3, 'Médio': 2, 'Baixo': 1, 'Nenhum': 0 };
                  return (riskOrder[b.item.riscoNaoConforme] || 0) - (riskOrder[a.item.riscoNaoConforme] || 0);
                })
                .map(nc => (
                  <tr key={nc.item.id}>
                    <td><strong>{nc.secao}</strong></td>
                    <td>{nc.item.texto}</td>
                    <td>{getRiscoLabel(nc.item.riscoNaoConforme)}</td>
                    <td>{nc.resposta?.observacao || '(Nenhuma observação)'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}

      {/* === 7. REGISTRO FOTOGRÁFICO === */}
      {(() => {
        const itensComFotos = naoConformidades.filter(nc => nc.resposta?.fotos && nc.resposta.fotos.length > 0);
        if (itensComFotos.length === 0) return null;
        return (
          <>
            <h2 className="ri-section-title">7. Registro Fotográfico</h2>
            <div className="ri-fotos-section">
              {itensComFotos.map(nc => (
                <div key={nc.item.id} className="ri-foto-group">
                  <h4>{nc.secao} — {nc.item.texto}</h4>
                  <div className="ri-foto-grid">
                    {nc.resposta!.fotos.map((foto, index) => (
                      <img key={index} src={foto} alt={`Foto ${index + 1}`} />
                    ))}
                  </div>
                  {nc.resposta?.observacao && (
                    <p style={{ fontSize: '8pt', fontStyle: 'italic', marginTop: '4px' }}>
                      <strong>Obs:</strong> {nc.resposta.observacao}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        );
      })()}

      {/* === RODAPÉ / ASSINATURA === */}
      <div className="ri-footer">
        <div className="ri-assinatura">
          <p style={{ fontWeight: 600, margin: 0 }}>Responsável pela Vistoria</p>
          <p style={{ fontSize: '9pt', margin: 0 }}>Câmara Municipal de Ubatuba</p>
          <p style={{ fontSize: '9pt', margin: 0 }}>{dataVistoria}</p>
        </div>
      </div>
    </div>
  );
}
