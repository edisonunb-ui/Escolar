
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
  // Seção 1: Estrutura e Segurança
  {
    id: 'est-a-seguranca-vigilancia',
    texto: 'A segurança e a vigilância da unidade escolar são realizadas por pessoal próprio ou por empresa terceirizada?',
    secao: 'Estrutura e Segurança',
    subSecao: 'Entrada e Vigilância',
    riscoNaoConforme: 'Alto',
    obsObrigatoria: false,
  },
  {
    id: 'est-b-camera-seguranca',
    texto: 'Existem câmeras de segurança instaladas e em funcionamento na unidade escolar?',
    secao: 'Estrutura e Segurança',
    subSecao: 'Entrada e Vigilância',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'est-c-controle-acesso',
    texto: 'O controle de acesso de pessoas à unidade escolar é realizado de forma adequada, com identificação e registro de visitantes?',
    secao: 'Estrutura e Segurança',
    subSecao: 'Entrada e Vigilância',
    riscoNaoConforme: 'Alto',
    obsObrigatoria: false,
  },
  {
    id: 'est-d-manutencao-geral',
    texto: 'A manutenção geral da unidade escolar (pintura, reparos, etc.) está em dia?',
    secao: 'Estrutura e Segurança',
    subSecao: 'Manutenção Predial',
    riscoNaoConforme: 'Médio',
    obsObrigatoria: false,
    fotoObrigatoria: true,
  },
  {
    id: 'est-e-condicoes-sanitarias',
    texto: 'As condições sanitárias e de higiene dos ambientes da unidade escolar (salas, banheiros, etc.) são adequadas?',
    secao: 'Estrutura e Segurança',
    subSecao: 'Higiene e Limpeza',
    riscoNaoConforme: 'Crítico',
    obsObrigatoria: false,
    fotoObrigatoria: true,
  },
  {
    id: 'est-f-dedetizacao-desratizacao',
    texto: 'A dedetização e a desratização da unidade escolar estão em dia?',
    secao: 'Estrutura e Segurança',
    subSecao: 'Higiene e Limpeza',
    riscoNaoConforme: 'Alto',
    obsObrigatoria: false,
  },

  // Seção 2: Cozinha e Alimentação
  {
    id: 'ali-a-cardapio-nutricionista',
    texto: 'O cardápio servido aos alunos é elaborado e acompanhado por nutricionista?',
    secao: 'Cozinha e Alimentação',
    subSecao: 'Cardápio e Nutrição',
    riscoNaoConforme: 'Alto',
    obsObrigatoria: false,
  },
  {
    id: 'ali-b-controle-qualidade-alimentos',
    texto: 'O controle de qualidade e o armazenamento dos alimentos são realizados de forma adequada?',
    secao: 'Cozinha e Alimentação',
    subSecao: 'Armazenamento e Qualidade',
    riscoNaoConforme: 'Crítico',
    obsObrigatoria: false,
    fotoObrigatoria: true,
  },
  {
    id: 'ali-c-condicoes-higiene-cozinha',
    texto: 'As condições de higiene e limpeza da cozinha e do refeitório são adequadas?',
    secao: 'Cozinha e Alimentação',
    subSecao: 'Higiene da Cozinha',
    riscoNaoConforme: 'Crítico',
    obsObrigatoria: false,
    fotoObrigatoria: true,
  },
  {
    id: 'ali-d-equipamentos-cozinha',
    texto: 'Os equipamentos e utensílios da cozinha estão em bom estado de conservação e funcionamento?',
    secao: 'Cozinha e Alimentação',
    subSecao: 'Equipamentos',
    riscoNaoConforme: 'Médio',
    obsObrigatoria: false,
    fotoObrigatoria: true,
  },

  // Seção 3: Recursos Humanos
  {
    id: 'rh-a-quadro-funcionarios-completo',
    texto: 'O quadro de funcionários da unidade escolar (professores, auxiliares, etc.) está completo e de acordo com a demanda?',
    secao: 'Recursos Humanos',
    subSecao: 'Quadro de Pessoal',
    riscoNaoConforme: 'Alto',
    obsObrigatoria: false,
  },
  {
    id: 'rh-b-capacitacao-profissionais',
    texto: 'Os profissionais da unidade escolar recebem capacitação e formação continuada?',
    secao: 'Recursos Humanos',
    subSecao: 'Formação Continuada',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'rh-c-absenteismo-funcionarios',
    texto: 'O absenteísmo de funcionários (faltas, licenças, etc.) tem impactado o funcionamento da unidade escolar?',
    secao: 'Recursos Humanos',
    subSecao: 'Absenteísmo',
    riscoNaoConforme: 'Médio',
    logicaInvertida: true, // Check = SIM, tem impactado (Não conforme)
    obsObrigatoria: false,
  },

  // Seção 4: Infraestrutura
  {
    id: 'inf-a-salas-aula-adequadas',
    texto: 'As salas de aula são adequadas em termos de espaço, ventilação e iluminação?',
    secao: 'Infraestrutura',
    subSecao: 'Salas de Aula',
    riscoNaoConforme: 'Médio',
    fotoObrigatoria: true,
  },
  {
    id: 'inf-b-mobiliario-escolar',
    texto: 'O mobiliário escolar (carteiras, cadeiras, etc.) está em bom estado de conservação?',
    secao: 'Infraestrutura',
    subSecao: 'Mobiliário',
    riscoNaoConforme: 'Baixo',
    fotoObrigatoria: true,
  },
  {
    id: 'inf-c-recursos-didaticos',
    texto: 'A unidade escolar dispõe de recursos didáticos e pedagógicos (livros, jogos, etc.) em quantidade e qualidade adequadas?',
    secao: 'Infraestrutura',
    subSecao: 'Recursos Pedagógicos',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'inf-d-acessibilidade-pne',
    texto: 'A unidade escolar possui acessibilidade para pessoas com necessidades especiais (rampas, banheiros adaptados, etc.)?',
    secao: 'Infraestrutura',
    subSecao: 'Acessibilidade',
    riscoNaoConforme: 'Alto',
    obsObrigatoria: false,
  },

  // Seção 5: Cuidado e Desenvolvimento
  {
    id: 'cuid-a-projeto-politico-pedagogico',
    texto: 'O Projeto Político Pedagógico (PPP) da unidade escolar está atualizado e sendo implementado?',
    secao: 'Cuidado e Desenvolvimento',
    subSecao: 'Projeto Pedagógico',
    riscoNaoConforme: 'Alto',
    obsObrigatoria: false,
  },
  {
    id: 'cuid-b-atividades-pedagogicas',
    texto: 'As atividades pedagógicas desenvolvidas com os alunos são adequadas à faixa etária e ao desenvolvimento infantil?',
    secao: 'Cuidado e Desenvolvimento',
    subSecao: 'Atividades',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'cuid-c-rotina-cuidados',
    texto: 'A rotina de cuidados (higiene, sono, etc.) dos alunos é realizada de forma adequada e respeitosa?',
    secao: 'Cuidado e Desenvolvimento',
    subSecao: 'Rotina de Cuidados',
    riscoNaoConforme: 'Crítico',
    obsObrigatoria: false,
  },
  {
    id: 'cuid-d-interacao-criancas',
    texto: 'A interação entre as crianças e entre crianças e adultos é positiva e estimulante?',
    secao: 'Cuidado e Desenvolvimento',
    subSecao: 'Interação Social',
    riscoNaoConforme: 'Médio',
  },

  // Seção 6: Gestão Financeira
  {
    id: 'fin-a-recebimento-recursos',
    texto: 'A unidade escolar tem recebido os recursos financeiros (repasse municipal, etc.) de forma regular?',
    secao: 'Gestão Financeira',
    subSecao: 'Recebimento e Repasses',
    riscoNaoConforme: 'Alto',
    obsObrigatoria: false,
  },
  {
    id: 'fin-b-prestacao-contas',
    texto: 'A prestação de contas dos recursos recebidos é realizada de forma transparente e regular?',
    secao: 'Gestão Financeira',
    subSecao: 'Transparência e Prestação de Contas',
    riscoNaoConforme: 'Alto',
    obsObrigatoria: false,
  },
  {
    id: 'fin-c-caixa-escolar-regular',
    texto: 'A situação do caixa escolar está regular, com as devidas comprovações de despesas?',
    secao: 'Gestão Financeira',
    subSecao: 'Caixa Escolar',
    riscoNaoConforme: 'Médio',
    obsObrigatoria: false,
  },
];

export const checklistEscola: ItemVerificacao[] = [
  // Seção 1: Estrutura e Segurança
  {
    id: 'est-a-seguranca-vigilancia',
    texto: 'A segurança e a vigilância da unidade escolar são realizadas por pessoal próprio ou por empresa terceirizada?',
    secao: 'Estrutura e Segurança',
    subSecao: 'Entrada e Vigilância',
    riscoNaoConforme: 'Alto',
    obsObrigatoria: false,
  },
  {
    id: 'est-b-camera-seguranca',
    texto: 'Existem câmeras de segurança instaladas e em funcionamento na unidade escolar?',
    secao: 'Estrutura e Segurança',
    subSecao: 'Entrada e Vigilância',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'est-c-controle-acesso',
    texto: 'O controle de acesso de pessoas à unidade escolar é realizado de forma adequada, com identificação e registro de visitantes?',
    secao: 'Estrutura e Segurança',
    subSecao: 'Entrada e Vigilância',
    riscoNaoConforme: 'Alto',
    obsObrigatoria: false,
  },
  {
    id: 'est-d-manutencao-geral',
    texto: 'A manutenção geral da unidade escolar (pintura, reparos, etc.) está em dia?',
    secao: 'Estrutura e Segurança',
    subSecao: 'Manutenção Predial',
    riscoNaoConforme: 'Médio',
    obsObrigatoria: false,
    fotoObrigatoria: true,
  },
  {
    id: 'est-e-condicoes-sanitarias',
    texto: 'As condições sanitárias e de higiene dos ambientes da unidade escolar (salas, banheiros, etc.) são adequadas?',
    secao: 'Estrutura e Segurança',
    subSecao: 'Higiene e Limpeza',
    riscoNaoConforme: 'Crítico',
    obsObrigatoria: false,
    fotoObrigatoria: true,
  },
  {
    id: 'est-f-dedetizacao-desratizacao',
    texto: 'A dedetização e a desratização da unidade escolar estão em dia?',
    secao: 'Estrutura e Segurança',
    subSecao: 'Higiene e Limpeza',
    riscoNaoConforme: 'Alto',
    obsObrigatoria: false,
  },

  // Seção 2: Cozinha e Alimentação
  {
    id: 'ali-a-cardapio-nutricionista',
    texto: 'O cardápio servido aos alunos é elaborado e acompanhado por nutricionista?',
    secao: 'Cozinha e Alimentação',
    subSecao: 'Cardápio e Nutrição',
    riscoNaoConforme: 'Alto',
    obsObrigatoria: false,
  },
  {
    id: 'ali-b-controle-qualidade-alimentos',
    texto: 'O controle de qualidade e o armazenamento dos alimentos são realizados de forma adequada?',
    secao: 'Cozinha e Alimentação',
    subSecao: 'Armazenamento e Qualidade',
    riscoNaoConforme: 'Crítico',
    obsObrigatoria: false,
    fotoObrigatoria: true,
  },
  {
    id: 'ali-c-condicoes-higiene-cozinha',
    texto: 'As condições de higiene e limpeza da cozinha e do refeitório são adequadas?',
    secao: 'Cozinha e Alimentação',
    subSecao: 'Higiene da Cozinha',
    riscoNaoConforme: 'Crítico',
    obsObrigatoria: false,
    fotoObrigatoria: true,
  },
  {
    id: 'ali-d-equipamentos-cozinha',
    texto: 'Os equipamentos e utensílios da cozinha estão em bom estado de conservação e funcionamento?',
    secao: 'Cozinha e Alimentação',
    subSecao: 'Equipamentos',
    riscoNaoConforme: 'Médio',
    obsObrigatoria: false,
    fotoObrigatoria: true,
  },

  // Seção 3: Recursos Humanos
  {
    id: 'rh-a-quadro-funcionarios-completo',
    texto: 'O quadro de funcionários da unidade escolar (professores, auxiliares, etc.) está completo e de acordo com a demanda?',
    secao: 'Recursos Humanos',
    subSecao: 'Quadro de Pessoal',
    riscoNaoConforme: 'Alto',
    obsObrigatoria: false,
  },
  {
    id: 'rh-b-capacitacao-profissionais',
    texto: 'Os profissionais da unidade escolar recebem capacitação e formação continuada?',
    secao: 'Recursos Humanos',
    subSecao: 'Formação Continuada',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'rh-c-absenteismo-funcionarios',
    texto: 'O absenteísmo de funcionários (faltas, licenças, etc.) tem impactado o funcionamento da unidade escolar?',
    secao: 'Recursos Humanos',
    subSecao: 'Absenteísmo',
    riscoNaoConforme: 'Médio',
    logicaInvertida: true, // Check = SIM, tem impactado (Não conforme)
    obsObrigatoria: false,
  },

  // Seção 4: Infraestrutura
  {
    id: 'inf-a-salas-aula-adequadas',
    texto: 'As salas de aula são adequadas em termos de espaço, ventilação e iluminação?',
    secao: 'Infraestrutura',
    subSecao: 'Salas de Aula',
    riscoNaoConforme: 'Médio',
    fotoObrigatoria: true,
  },
  {
    id: 'inf-b-mobiliario-escolar',
    texto: 'O mobiliário escolar (carteiras, cadeiras, etc.) está em bom estado de conservação?',
    secao: 'Infraestrutura',
    subSecao: 'Mobiliário',
    riscoNaoConforme: 'Baixo',
    fotoObrigatoria: true,
  },
  {
    id: 'inf-c-recursos-didaticos',
    texto: 'A unidade escolar dispõe de recursos didáticos e pedagógicos (livros, jogos, etc.) em quantidade e qualidade adequadas?',
    secao: 'Infraestrutura',
    subSecao: 'Recursos Pedagógicos',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'inf-d-acessibilidade-pne',
    texto: 'A unidade escolar possui acessibilidade para pessoas com necessidades especiais (rampas, banheiros adaptados, etc.)?',
    secao: 'Infraestrutura',
    subSecao: 'Acessibilidade',
    riscoNaoConforme: 'Alto',
    obsObrigatoria: false,
  },
  {
    id: 'inf-e-area-lazer-esportes',
    texto: 'A unidade escolar possui área de lazer e/ou quadra de esportes em boas condições de uso?',
    secao: 'Infraestrutura',
    subSecao: 'Lazer e Esportes',
    riscoNaoConforme: 'Médio',
    fotoObrigatoria: true,
  },

  // Seção 5: Pedagógico
  {
    id: 'ped-a-projeto-politico-pedagogico',
    texto: 'O Projeto Político Pedagógico (PPP) da unidade escolar está atualizado e sendo implementado?',
    secao: 'Pedagógico',
    subSecao: 'Projeto Pedagógico',
    riscoNaoConforme: 'Alto',
    obsObrigatoria: false,
  },
  {
    id: 'ped-b-acompanhamento-alunos',
    texto: 'O acompanhamento do desempenho e da frequência dos alunos é realizado de forma sistemática?',
    secao: 'Pedagógico',
    subSecao: 'Acompanhamento Discente',
    riscoNaoConforme: 'Médio',
    obsObrigatoria: false,
  },
  {
    id: 'ped-c-reforco-escolar',
    texto: 'A unidade escolar oferece atividades de reforço e/ou recuperação para os alunos com dificuldades de aprendizagem?',
    secao: 'Pedagógico',
    subSecao: 'Apoio à Aprendizagem',
    riscoNaoConforme: 'Médio',
  },
  {
    id: 'ped-d-integracao-familia-escola',
    texto: 'A integração família-escola é promovida por meio de reuniões, eventos e/ou outros canais de comunicação?',
    secao: 'Pedagógico',
    subSecao: 'Relação com a Comunidade',
    riscoNaoConforme: 'Baixo',
  },

  // Seção 6: Gestão Financeira
  {
    id: 'fin-a-recebimento-recursos',
    texto: 'A unidade escolar tem recebido os recursos financeiros (PDDE, etc.) de forma regular?',
    secao: 'Gestão Financeira',
    subSecao: 'Recebimento e Repasses',
    riscoNaoConforme: 'Alto',
    obsObrigatoria: false,
  },
  {
    id: 'fin-b-prestacao-contas',
    texto: 'A prestação de contas dos recursos recebidos é realizada de forma transparente e regular?',
    secao: 'Gestão Financeira',
    subSecao: 'Transparência e Prestação de Contas',
    riscoNaoConforme: 'Alto',
    obsObrigatoria: false,
  },
  {
    id: 'fin-c-caixa-escolar-regular',
    texto: 'A situação do caixa escolar está regular, com as devidas comprovações de despesas?',
    secao: 'Gestão Financeira',
    subSecao: 'Caixa Escolar',
    riscoNaoConforme: 'Médio',
    obsObrigatoria: false,
  },
];
