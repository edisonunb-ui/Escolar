
export type RiscoNivel = 'Nenhum' | 'Baixo' | 'Médio' | 'Alto' | 'Crítico';

export interface ItemVerificacao {
  id: string;
  texto: string;
  secao: string;
  subSecao?: string;
  riscoNaoConforme: RiscoNivel;
  logicaInvertida?: boolean; // true se o "check" no toggle significa "não conforme"
  obsObrigatoria?: boolean;  // true se a observação é obrigatória em caso de não conformidade
  fotoObrigatoria?: boolean; // true se a foto é obrigatória em caso de não conformidade
}

export const checklistCreche: ItemVerificacao[] = [
  // 4. Avaliação Estrutural e Segurança
  // 4.1. Acesso, Entrada e Segurança
  {
    id: 'cre-est-travas-protecao',
    texto: 'Os portões de acesso e áreas externas possuem travas/proteção para impedir que as crianças abram sozinhas?',
    secao: '4. Avaliação Estrutural e Segurança',
    subSecao: '4.1. Acesso, Entrada e Segurança',
    riscoNaoConforme: 'Alto',
  },
  {
    id: 'cre-est-piso-externo',
    texto: 'O piso das áreas externas (pátio, playground) é adequado para quedas (emborrachado, grama)?',
    secao: '4. Avaliação Estrutural e Segurança',
    subSecao: '4.1. Acesso, Entrada e Segurança',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'cre-est-cercas-muros',
    texto: 'A escola possui cercas/muros adequados e sem pontos de escalada?',
    secao: '4. Avaliação Estrutural e Segurança',
    subSecao: '4.1. Acesso, Entrada e Segurança',
    riscoNaoConforme: 'Alto',
  },
  {
    id: 'cre-est-rampa-acesso',
    texto: 'Existe rampa de acesso para cadeirantes (ABNT NBR 9050)?',
    secao: '4. Avaliação Estrutural e Segurança',
    subSecao: '4.1. Acesso, Entrada e Segurança',
    riscoNaoConforme: 'Alto',
  },
  {
    id: 'cre-est-protecao-tomadas',
    texto: 'Proteção de Tomadas/Quinas: Estão devidamente protegidas em todas as áreas?',
    secao: '4. Avaliação Estrutural e Segurança',
    subSecao: '4.1. Acesso, Entrada e Segurança',
    riscoNaoConforme: 'Crítico',
  },
  {
    id: 'cre-est-cameras',
    texto: 'A unidade possui câmeras de monitoramento?',
    secao: '4. Avaliação Estrutural e Segurança',
    subSecao: '4.1. Acesso, Entrada e Segurança',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'cre-est-vigilancia',
    texto: 'Existe vigilância presencial ou terceirizada?',
    secao: '4. Avaliação Estrutural e Segurança',
    subSecao: '4.1. Acesso, Entrada e Segurança',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'cre-est-portoes-trancados',
    texto: 'Controle de acesso: Os portões permanecem trancados durante o período letivo?',
    secao: '4. Avaliação Estrutural e Segurança',
    subSecao: '4.1. Acesso, Entrada e Segurança',
    riscoNaoConforme: 'Alto',
  },

  // 4.2. Salas de Atividades e Berçários
  {
    id: 'cre-sala-paredes-estado',
    texto: 'As paredes das salas estão em bom estado (sem rachaduras, infiltrações, mofo)?',
    secao: '4. Avaliação Estrutural e Segurança',
    subSecao: '4.2. Salas de Atividades e Berçários',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'cre-sala-piso-adequado',
    texto: 'O piso das salas é liso, lavável e possui colchonetes/tapetes adequados?',
    secao: '4. Avaliação Estrutural e Segurança',
    subSecao: '4.2. Salas de Atividades e Berçários',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'cre-sala-telhado-estado',
    texto: 'O telhado/forro está em bom estado (sem vazamentos/goteiras)?',
    secao: '4. Avaliação Estrutural e Segurança',
    subSecao: '4.2. Salas de Atividades e Berçários',
    riscoNaoConforme: 'Alto',
  },
  {
    id: 'cre-sala-vent-ilum',
    texto: 'Há ventilação e iluminação (natural/artificial) suficientes e adequadas?',
    secao: '4. Avaliação Estrutural e Segurança',
    subSecao: '4.2. Salas de Atividades e Berçários',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'cre-sala-mobiliario',
    texto: 'Mobiliário: Berços e trocadores estão em bom estado e seguem as normas?',
    secao: '4. Avaliação Estrutural e Segurança',
    subSecao: '4.2. Salas de Atividades e Berçários',
    riscoNaoConforme: 'Alto',
  },
  {
    id: 'cre-sala-sono-repouso',
    texto: 'A Sala de Sono/Repouso é um ambiente calmo, escuro e silencioso?',
    secao: '4. Avaliação Estrutural e Segurança',
    subSecao: '4.2. Salas de Atividades e Berçários',
    riscoNaoConforme: 'Baixo',
  },

  // 4.3. Banheiros e Área de Higiene (Fraldário)
  {
    id: 'cre-banh-fraldario-sep',
    texto: 'A área de troca (fraldário) é separada e higienizada imediatamente após o uso?',
    secao: '4. Avaliação Estrutural e Segurança',
    subSecao: '4.3. Banheiros e Área de Higiene (Fraldário)',
    riscoNaoConforme: 'Alto',
  },
  {
    id: 'cre-banh-tamanho-adequado',
    texto: 'Existem vasos sanitários e pias em tamanho e altura adequados para a faixa etária?',
    secao: '4. Avaliação Estrutural e Segurança',
    subSecao: '4.3. Banheiros e Área de Higiene (Fraldário)',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'cre-banh-insumos-troca',
    texto: 'Há pia com sabonete líquido, papel-toalha e lixeira com pedal na área de troca?',
    secao: '4. Avaliação Estrutural e Segurança',
    subSecao: '4.3. Banheiros e Área de Higiene (Fraldário)',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'cre-banh-limpeza',
    texto: 'Os banheiros estão limpos, desinfetados e sem odores?',
    secao: '4. Avaliação Estrutural e Segurança',
    subSecao: '4.3. Banheiros e Área de Higiene (Fraldário)',
    riscoNaoConforme: 'Alto',
  },

  // 5. Avaliação da Cozinha e Alimentação
  // 5.1. Refeitório e Área de Consumo
  {
    id: 'cre-ali-possui-refeitorio',
    texto: 'A Creche possui refeitório/área de alimentação separada?',
    secao: '5. Avaliação da Cozinha e Alimentação',
    subSecao: '5.1. Refeitório e Área de Consumo',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'cre-ali-cadeiras-estatura',
    texto: 'As cadeiras de alimentação (cadeirões) condizem com a idade e estatura das crianças?',
    secao: '5. Avaliação da Cozinha e Alimentação',
    subSecao: '5.1. Refeitório e Área de Consumo',
    riscoNaoConforme: 'Alto',
  },
  {
    id: 'cre-ali-cadeiras-estado',
    texto: 'As cadeiras de alimentação (cadeirões) ou mesas e cadeiras estão em bom estado?',
    secao: '5. Avaliação da Cozinha e Alimentação',
    subSecao: '5.1. Refeitório e Área de Consumo',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'cre-refeitorio-paredes-teto-piso',
    texto: 'As paredes, teto e piso do refeitório estão em bom estado (sem infiltrações/danos)?',
    secao: '5. Avaliação da Cozinha e Alimentação',
    subSecao: '5.1. Refeitório e Área de Consumo',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'cre-refeitorio-eletrica',
    texto: 'A parte elétrica do refeitório está em bom estado (sem fios expostos)?',
    secao: '5. Avaliação da Cozinha e Alimentação',
    subSecao: '5.1. Refeitório e Área de Consumo',
    riscoNaoConforme: 'Alto',
  },

  // 5.2. Cozinha (Higiene e Conformidade)
  {
    id: 'cre-ali-cozinha-estrutura',
    texto: 'Estrutura: Pisos, paredes e teto são lisos, laváveis e sem rachaduras/mofo?',
    secao: '5. Avaliação da Cozinha e Alimentação',
    subSecao: '5.2. Cozinha (Higiene e Conformidade)',
    riscoNaoConforme: 'Alto',
  },
  {
    id: 'cre-cozinha-eletrica',
    texto: 'A parte elétrica da cozinha está em bom estado (sem fios expostos)?',
    secao: '5. Avaliação da Cozinha e Alimentação',
    subSecao: '5.2. Cozinha (Higiene e Conformidade)',
    riscoNaoConforme: 'Crítico',
  },
  {
    id: 'cre-cozinha-balanca-estado',
    texto: 'Balança: Existe balança para conferência dos alimentos e ela está em bom estado/funcionando?',
    secao: '5. Avaliação da Cozinha e Alimentação',
    subSecao: '5.2. Cozinha (Higiene e Conformidade)',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'cre-ali-cardapio-nutri',
    texto: 'Conformidade: Segue o cardápio planejado pela nutricionista e adequado à faixa etária?',
    secao: '5. Avaliação da Cozinha e Alimentação',
    subSecao: '5.2. Cozinha (Higiene e Conformidade)',
    riscoNaoConforme: 'Crítico',
  },
  {
    id: 'cre-ali-cardapio-presencial',
    texto: 'No ato da visita, a alimentação ofertada às crianças CONDIA com o cardápio?',
    secao: '5. Avaliação da Cozinha e Alimentação',
    subSecao: '5.2. Cozinha (Higiene e Conformidade)',
    riscoNaoConforme: 'Alto',
  },
  {
    id: 'cre-ali-conferencia-estoque',
    texto: 'Conferência: A quantidade em estoque CONDIZ com as notas fiscais de entrega?',
    secao: '5. Avaliação da Cozinha e Alimentação',
    subSecao: '5.2. Cozinha (Higiene e Conformidade)',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'cre-ali-qualidade-validade',
    texto: 'Qualidade/Validade: É vedada a presença de produto vencido ou deteriorado?',
    secao: '5. Avaliação da Cozinha e Alimentação',
    subSecao: '5.2. Cozinha (Higiene e Conformidade)',
    riscoNaoConforme: 'Crítico',
  },

  // 2. Quadro Funcional e Recursos Humanos
  {
    id: 'cre-rh-proporcao',
    texto: 'A proporção de cuidadores/professores por criança está de acordo com a legislação?',
    secao: '2. Quadro Funcional e Recursos Humanos',
    riscoNaoConforme: 'Alto',
  },
  {
    id: 'cre-sala-exclusiva-especialistas',
    texto: 'Existe sala exclusiva para atendimento dos Assistentes Sociais e psicólogos que resguardem o sigilo profissional?',
    secao: '2. Quadro Funcional e Recursos Humanos',
    riscoNaoConforme: 'Médio',
  },

  // 6. Áreas Específicas e Infraestrutura
  {
    id: 'cre-inf-playground',
    texto: 'Área Externa/Playground: Possui brinquedos seguros, certificados e adequados à idade?',
    secao: '6. Áreas Específicas e Infraestrutura',
    riscoNaoConforme: 'Alto',
  },
  {
    id: 'cre-inf-sala-amamentacao',
    texto: 'Sala de Amamentação: O espaço oferece privacidade, conforto e higiene?',
    secao: '6. Áreas Específicas e Infraestrutura',
    riscoNaoConforme: 'Baixo',
  },

  // 7. Cuidado, Interação e Desenvolvimento
  {
    id: 'cre-des-interacao',
    texto: 'Interação: Os cuidadores interagem de forma carinhosa, atenciosa e estimulante?',
    secao: '7. Cuidado, Interação e Desenvolvimento',
    riscoNaoConforme: 'Crítico',
  },
  {
    id: 'cre-des-rotina',
    texto: 'Rotina: A rotina diária é organizada, previsível e respeita o ritmo individual?',
    secao: '7. Cuidado, Interação e Desenvolvimento',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'cre-des-materiais',
    texto: 'Materiais: Oferece brinquedos e materiais pedagógicos seguros e estimulantes?',
    secao: '7. Cuidado, Interação e Desenvolvimento',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'cre-des-higiene-frequencia',
    texto: 'Higiene: As trocas de fraldas/banhos são feitos com frequência e cuidado?',
    secao: '7. Cuidado, Interação e Desenvolvimento',
    riscoNaoConforme: 'Alto',
  },

  // 3. Gestão Financeira e APM/CAE
  {
    id: 'cre-fin-apm-ativa',
    texto: 'Associação de Pais e Mestres (APM) está formalmente constituída e ativa?',
    secao: '3. Gestão Financeira e APM/CAE',
    riscoNaoConforme: 'Alto',
  },
  {
    id: 'cre-fin-apm-conta',
    texto: 'As contribuições dos pais à APM são feitas por meio de conta bancária específica?',
    secao: '3. Gestão Financeira e APM/CAE',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'cre-fin-apm-contas',
    texto: 'A APM realiza prestação de contas periódica aos associados?',
    secao: '3. Gestão Financeira e APM/CAE',
    riscoNaoConforme: 'Alto',
  },
  {
    id: 'cre-fin-apm-atas',
    texto: 'A escola mantém as atas das reuniões com a APM arquivadas e acessíveis?',
    secao: '3. Gestão Financeira e APM/CAE',
    riscoNaoConforme: 'Baixo',
  },
  {
    id: 'cre-fin-cae-membros',
    texto: 'O Conselho de Alimentação Escolar (CAE) possui membros em exercício?',
    secao: '3. Gestão Financeira e APM/CAE',
    riscoNaoConforme: 'Alto',
  },
];

export const checklistEscola: ItemVerificacao[] = [
  // 4. Avaliação Estrutural
  // 4.1. Acesso, Entrada e Segurança
  {
    id: 'est-rampa-acesso',
    texto: 'Existe rampa de acesso para cadeirantes (ABNT NBR 9050)?',
    secao: '4. Avaliação Estrutural',
    subSecao: '4.1. Acesso, Entrada e Segurança',
    riscoNaoConforme: 'Alto',
  },
  {
    id: 'est-corrimao-duplo',
    texto: 'A rampa possui corrimãos duplos e piso antiderrapante?',
    secao: '2. Avaliação Estrutural',
    subSecao: '2.1. Acesso, Entrada e Segurança',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'est-calcada-estado',
    texto: 'A calçada em frente à escola está em bom estado (sem buracos/obstáculos)?',
    secao: '2. Avaliação Estrutural',
    subSecao: '2.1. Acesso, Entrada e Segurança',
    riscoNaoConforme: 'Baixo',
  },
  {
    id: 'est-portoes-cercas',
    texto: 'Os portões e cercas estão em boas condições e com trancas funcionando?',
    secao: '2. Avaliação Estrutural',
    subSecao: '2.1. Acesso, Entrada e Segurança',
    riscoNaoConforme: 'Alto',
  },
  {
    id: 'est-muros-adequados',
    texto: 'A escola possui cercas/muros adequados em toda a extensão para segurança?',
    secao: '2. Avaliação Estrutural',
    subSecao: '2.1. Acesso, Entrada e Segurança',
    riscoNaoConforme: 'Alto',
  },
  {
    id: 'est-nome-visivel',
    texto: 'O nome da escola é visível e legível na fachada?',
    secao: '2. Avaliação Estrutural',
    subSecao: '2.1. Acesso, Entrada e Segurança',
    riscoNaoConforme: 'Baixo',
  },
  {
    id: 'est-eletrica-entrada',
    texto: 'A parte elétrica da entrada está em bom estado (sem fios expostos/gambiarra)?',
    secao: '2. Avaliação Estrutural',
    subSecao: '2.1. Acesso, Entrada e Segurança',
    riscoNaoConforme: 'Crítico',
    fotoObrigatoria: true,
  },
  {
    id: 'est-extintores-emergencia',
    texto: 'Segurança Geral: Há extintores suficientes/em dia, saídas de emergência desobstruídas e kit de primeiros socorros completo?',
    secao: '2. Avaliação Estrutural',
    subSecao: '2.1. Acesso, Entrada e Segurança',
    riscoNaoConforme: 'Crítico',
  },
  {
    id: 'est-cameras',
    texto: 'A unidade possui câmeras de monitoramento?',
    secao: '2. Avaliação Estrutural',
    subSecao: '2.1. Acesso, Entrada e Segurança',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'est-vigilancia',
    texto: 'Existe vigilância presencial ou terceirizada?',
    secao: '2. Avaliação Estrutural',
    subSecao: '2.1. Acesso, Entrada e Segurança',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'est-portoes-trancados',
    texto: 'Controle de acesso: Os portões permanecem trancados durante o período letivo?',
    secao: '2. Avaliação Estrutural',
    subSecao: '2.1. Acesso, Entrada e Segurança',
    riscoNaoConforme: 'Alto',
  },

  // 4.2. Salas de Aula (Estrutura e Mobiliário)
  {
    id: 'inf-paredes-estado',
    texto: 'As paredes estão em bom estado (sem rachaduras, infiltrações, mofo)?',
    secao: '4. Avaliação Estrutural',
    subSecao: '4.2. Salas de Aula (Estrutura e Mobiliário)',
    riscoNaoConforme: 'Médio',
    fotoObrigatoria: true,
  },
  {
    id: 'inf-telhado-estado',
    texto: 'O telhado/forro está em bom estado (sem vazamentos/goteiras)?',
    secao: '4. Avaliação Estrutural',
    subSecao: '4.2. Salas de Aula (Estrutura e Mobiliário)',
    riscoNaoConforme: 'Alto',
    fotoObrigatoria: true,
  },
  {
    id: 'inf-pisos-estado',
    texto: 'Os pisos estão em bom estado, sem rachaduras, buracos ou partes soltas?',
    secao: '4. Avaliação Estrutural',
    subSecao: '4.2. Salas de Aula (Estrutura e Mobiliário)',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'inf-eletrica-salas',
    texto: 'A parte elétrica está em bom estado e fiação embutida?',
    secao: '4. Avaliação Estrutural',
    subSecao: '4.2. Salas de Aula (Estrutura e Mobiliário)',
    riscoNaoConforme: 'Crítico',
    fotoObrigatoria: true,
  },
  {
    id: 'inf-vent-ilum-salas',
    texto: 'Há ventilação e iluminação (natural/artificial) suficientes e adequadas?',
    secao: '4. Avaliação Estrutural',
    subSecao: '4.2. Salas de Aula (Estrutura e Mobiliário)',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'inf-carteiras-estado',
    texto: 'As carteiras e cadeiras estão em bom estado (sem danos) e são adequadas para a idade/estatura dos alunos?',
    secao: '4. Avaliação Estrutural',
    subSecao: '4.2. Salas de Aula (Estrutura e Mobiliário)',
    riscoNaoConforme: 'Médio',
    fotoObrigatoria: true,
  },
  {
    id: 'inf-lousas-estado',
    texto: 'As lousas estão em boas condições de uso e fixadas de forma segura?',
    secao: '4. Avaliação Estrutural',
    subSecao: '4.2. Salas de Aula (Estrutura e Mobiliário)',
    riscoNaoConforme: 'Baixo',
  },

  // 4.3. Banheiros (Higiene e Acessibilidade)
  {
    id: 'banh-paredes-teto-piso',
    texto: 'As paredes, teto e piso dos banheiros estão em bom estado (sem infiltrações/danos)?',
    secao: '4. Avaliação Estrutural',
    subSecao: '4.3. Banheiros (Higiene e Acessibilidade)',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'banh-limpeza-higiene',
    texto: 'Os banheiros estão limpos, desinfetados e sem odores (rotina de limpeza)?',
    secao: '4. Avaliação Estrutural',
    subSecao: '4.3. Banheiros (Higiene e Acessibilidade)',
    riscoNaoConforme: 'Alto',
  },
  {
    id: 'banh-insumos-basicos',
    texto: 'Há papel higiênico, sabonete e toalhas/secadores disponíveis?',
    secao: '4. Avaliação Estrutural',
    subSecao: '4.3. Banheiros (Higiene e Acessibilidade)',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'banh-vasos-pias-func',
    texto: 'Os vasos sanitários e pias estão em bom funcionamento (sem vazamentos/entupimentos)?',
    secao: '4. Avaliação Estrutural',
    subSecao: '4.3. Banheiros (Higiene e Acessibilidade)',
    riscoNaoConforme: 'Alto',
    fotoObrigatoria: true,
  },
  {
    id: 'banh-adaptado-pcd',
    texto: 'Existem sanitários e pias adaptados para PCD (barras de apoio, espaço)?',
    secao: '4. Avaliação Estrutural',
    subSecao: '4.3. Banheiros (Higiene e Acessibilidade)',
    riscoNaoConforme: 'Alto',
  },
  {
    id: 'banh-portas-trancas',
    texto: 'As portas das cabines fecham e possuem trancas internas funcionando?',
    secao: '4. Avaliação Estrutural',
    subSecao: '4.3. Banheiros (Higiene e Acessibilidade)',
    riscoNaoConforme: 'Baixo',
  },

  // 5. Avaliação da Cozinha e Refeitório (Alimentação Escolar)
  // 5.1. Refeitório (Área de Consumo)
  {
    id: 'ali-possui-refeitorio',
    texto: 'A Escola possui refeitório?',
    secao: '5. Avaliação da Cozinha e Refeitório',
    subSecao: '5.1. Refeitório (Área de Consumo)',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'ali-refeitorio-mobil-adequado',
    texto: 'As mesas e cadeiras do refeitório condizem com a idade e estatura dos alunos?',
    secao: '5. Avaliação da Cozinha e Refeitório',
    subSecao: '5.1. Refeitório (Área de Consumo)',
    riscoNaoConforme: 'Baixo',
  },
  {
    id: 'ali-refeitorio-limpeza',
    texto: 'A área de consumação está limpa, sem materiais em desuso e presença de animais?',
    secao: '5. Avaliação da Cozinha e Refeitório',
    subSecao: '5.1. Refeitório (Área de Consumo)',
    riscoNaoConforme: 'Alto',
    fotoObrigatoria: true,
  },
  {
    id: 'ali-refeitorio-paredes-teto-piso',
    texto: 'As paredes, teto e piso do refeitório estão em bom estado (sem infiltrações/danos)?',
    secao: '5. Avaliação da Cozinha e Refeitório',
    subSecao: '5.1. Refeitório (Área de Consumo)',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'ali-refeitorio-eletrica',
    texto: 'A parte elétrica do refeitório está em bom estado (sem fios expostos)?',
    secao: '5. Avaliação da Cozinha e Refeitório',
    subSecao: '5.1. Refeitório (Área de Consumo)',
    riscoNaoConforme: 'Alto',
  },

  // 5.2. Cozinha (Estrutura, Higiene e Conformidade)
  {
    id: 'ali-cozinha-estrutura',
    texto: 'Estrutura: Pisos, paredes e teto são lisos, laváveis, íntegros e sem rachaduras?',
    secao: '5. Avaliação da Cozinha e Refeitório',
    subSecao: '5.2. Cozinha (Estrutura, Higiene e Conformidade)',
    riscoNaoConforme: 'Alto',
    fotoObrigatoria: true,
  },
  {
    id: 'ali-cozinha-ventilacao',
    texto: 'Ventilação: Há exaustores/coifas funcionando e telas milimétricas nas aberturas?',
    secao: '5. Avaliação da Cozinha e Refeitório',
    subSecao: '5.2. Cozinha (Estrutura, Higiene e Conformidade)',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'ali-cozinha-equipamentos',
    texto: 'Equipamentos: Mobiliário e equipamentos (fogão, geladeira) em bom estado e quantidade suficiente?',
    secao: '5. Avaliação da Cozinha e Refeitório',
    subSecao: '5.2. Cozinha (Estrutura, Higiene e Conformidade)',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'ali-cozinha-balanca',
    texto: 'Há balança para conferência dos alimentos na entrega e ela está em bom estado/funcionando?',
    secao: '5. Avaliação da Cozinha e Refeitório',
    subSecao: '5.2. Cozinha (Estrutura, Higiene e Conformidade)',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'ali-cozinha-eletrica',
    texto: 'A parte elétrica da cozinha está em bom estado (sem fios expostos ou gambiarras)?',
    secao: '5. Avaliação da Cozinha e Refeitório',
    subSecao: '5.2. Cozinha (Estrutura, Higiene e Conformidade)',
    riscoNaoConforme: 'Crítico',
    fotoObrigatoria: true,
  },
  {
    id: 'ali-cozinha-lixo',
    texto: 'Acondicionamento de Resíduos: Recipiente com tampa, pedal, saco plástico e afastado da manipulação?',
    secao: '5. Avaliação da Cozinha e Refeitório',
    subSecao: '5.2. Cozinha (Estrutura, Higiene e Conformidade)',
    riscoNaoConforme: 'Alto',
  },
  {
    id: 'ali-conformidade-cardapio',
    texto: 'Conformidade do Cardápio: A Escola segue o cardápio planejado pela Sessão de Alimentação Escolar?',
    secao: '5. Avaliação da Cozinha e Refeitório',
    subSecao: '5.2. Cozinha (Estrutura, Higiene e Conformidade)',
    riscoNaoConforme: 'Crítico',
  },
  {
    id: 'ali-alimento-visita-cardapio',
    texto: 'No ato da visita, a alimentação ofertada aos alunos estava conforme o cardápio apresentado?',
    secao: '5. Avaliação da Cozinha e Refeitório',
    subSecao: '5.2. Cozinha (Estrutura, Higiene e Conformidade)',
    riscoNaoConforme: 'Crítico',
    fotoObrigatoria: true,
  },
  {
    id: 'ali-conferencia-estoque',
    texto: 'Conferência de Estoque: A quantidade de alimentos em estoque condiz com as notas fiscais?',
    secao: '5. Avaliação da Cozinha e Refeitório',
    subSecao: '5.2. Cozinha (Estrutura, Higiene e Conformidade)',
    riscoNaoConforme: 'Alto',
  },
  {
    id: 'ali-qualidade-validade',
    texto: 'Qualidade/Validade: É vedada a presença de produto com prazo de validade vencido ou deteriorado?',
    secao: '5. Avaliação da Cozinha e Refeitório',
    subSecao: '5.2. Cozinha (Estrutura, Higiene e Conformidade)',
    riscoNaoConforme: 'Crítico',
    logicaInvertida: true,
    fotoObrigatoria: true,
  },

  // 7. Áreas Específicas e Infraestrutura
  {
    id: 'inf-sala-professores',
    texto: 'Sala dos Professores: Possui estrutura e equipamentos adequados?',
    secao: '7. Áreas Específicas e Infraestrutura',
    riscoNaoConforme: 'Baixo',
  },
  {
    id: 'inf-biblioteca-acervo',
    texto: 'Biblioteca: Possui estrutura e acervo adequado?',
    secao: '7. Áreas Específicas e Infraestrutura',
    riscoNaoConforme: 'Baixo',
  },
  {
    id: 'inf-lab-informatica',
    texto: 'Laboratório de Informática: Possui estrutura e computadores funcionando?',
    secao: '7. Áreas Específicas e Infraestrutura',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'inf-lab-ciencias',
    texto: 'Laboratório de Ciências: Possui materiais e segurança adequados?',
    secao: '7. Áreas Específicas e Infraestrutura',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'inf-quadra-esportes',
    texto: 'Quadra Poliesportiva: O piso e equipamentos estão em boas condições?',
    secao: '7. Áreas Específicas e Infraestrutura',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'inf-sala-recursos',
    texto: 'Sala de Recursos: Possui estrutura e materiais específicos adequados?',
    secao: '7. Áreas Específicas e Infraestrutura',
    riscoNaoConforme: 'Alto',
  },
  {
    id: 'inf-sala-exclusiva-especialistas',
    texto: 'Existe sala exclusiva para atendimento dos Assistentes Sociais e psicólogos que resguardem o sigilo profissional?',
    secao: '2. Quadro Funcional e Recursos Humanos',
    riscoNaoConforme: 'Médio',
  },

  // 3. Gestão Financeira e APM/CAE
  {
    id: 'fin-apm-constituida',
    texto: 'Associação de Pais e Mestres (APM) está formalmente constituída e ativa?',
    secao: '3. Gestão Financeira e APM/CAE',
    riscoNaoConforme: 'Alto',
  },
  {
    id: 'fin-apm-conta-especifica',
    texto: 'As contribuições dos pais à APM são feitas por meio de conta bancária específica?',
    secao: '3. Gestão Financeira e APM/CAE',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'fin-apm-prestacao-contas',
    texto: 'A APM realiza prestação de contas periódicas aos associados?',
    secao: '3. Gestão Financeira e APM/CAE',
    riscoNaoConforme: 'Alto',
  },
  {
    id: 'fin-apm-atas-arquivadas',
    texto: 'A escola mantém as atas das reuniões com a APM arquivadas e acessíveis?',
    secao: '3. Gestão Financeira e APM/CAE',
    riscoNaoConforme: 'Baixo',
  },
  {
    id: 'fin-cae-membros-exercicio',
    texto: 'O Conselho de Alimentação Escolar (CAE) possui membros em exercício?',
    secao: '3. Gestão Financeira e APM/CAE',
    riscoNaoConforme: 'Alto',
  },
];

