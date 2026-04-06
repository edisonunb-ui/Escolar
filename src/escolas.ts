
export interface UnidadeEnsino {
  regiao: string;
  tipo: 'ESCOLA' | 'CRECHE';
  nome: string;
  endereco: string;
  bairro: string;
  telefone: string;
}

export const unidadesEnsino: UnidadeEnsino[] = [
  // CENTRAL
  { regiao: 'Central', tipo: 'ESCOLA', nome: 'EM Presidente Tancredo de Almeida Neves', endereco: 'Avenida Rio Grande do Sul, 600', bairro: 'Centro', telefone: '3833-7600' },
  { regiao: 'Central', tipo: 'ESCOLA', nome: 'EM Professora Olga Ribas de Andrade Gil', endereco: 'Rua Conceição, 710', bairro: 'Centro', telefone: '3833-3696' },
  { regiao: 'Central', tipo: 'CRECHE', nome: 'EMEI Idalina Graça', endereco: 'Avenida Rio Grande do Sul, 157', bairro: 'Centro', telefone: '3832-5350' },
  { regiao: 'Central', tipo: 'CRECHE', nome: 'EMEI Professor José Carlos Pereira', endereco: 'Rua Paraná, 347', bairro: 'Centro', telefone: '3832-4236' },
  { regiao: 'Central', tipo: 'CRECHE', nome: 'CEI Sumaré (CRECHE)', endereco: 'Rua Acre, 404', bairro: 'Sumaré', telefone: '3832-5855' },
  { regiao: 'Central', tipo: 'ESCOLA', nome: 'Centro Educacional Municipal da Primeira Infância', endereco: 'Rua Cunhambebe, 999', bairro: 'Centro', telefone: '3833-8308' },
  { regiao: 'Central', tipo: 'ESCOLA', nome: 'EM Padre José de Anchieta', endereco: 'Rua Amazonas, 595', bairro: 'Sumaré', telefone: '3832-7310' },

  // CENTRO N
  { regiao: 'Centro N', tipo: 'CRECHE', nome: 'CEI Terezinha Fernandes Rossi (CRECHE)', endereco: 'Rua Domingos Pedro Oliveira, 335', bairro: 'Pedreira', telefone: '3832-1150' },
  { regiao: 'Centro N', tipo: 'ESCOLA', nome: 'EM Profa Marina Salete Nepomuceno do Amaral', endereco: 'Rua Raposo Tavares, 16', bairro: 'Perequê Açu', telefone: '3833-6688' },
  { regiao: 'Centro N', tipo: 'CRECHE', nome: 'EMEI Professora Maria Alice Leite da Silva', endereco: 'Rua Fernando Alonso, 237', bairro: 'Perequê Açu', telefone: '3832-4666' },
  { regiao: 'Centro N', tipo: 'ESCOLA', nome: 'EM Professor José de Souza Simeão', endereco: 'Estrada Municipal MPB - 146, nº 20', bairro: 'Taquaral', telefone: '3833-4392' },
  { regiao: 'Centro N', tipo: 'CRECHE', nome: 'EMEI Professor Richard Juarez Gobbi', endereco: 'Rua Maria Madalena Charleaux, 1090', bairro: 'Taquaral', telefone: '3832-5508' },
  { regiao: 'Centro N', tipo: 'CRECHE', nome: 'EMEI Professora Alba Regina Torraque da Silva', endereco: 'Rua do Angelim, nº 4', bairro: 'Taquaral', telefone: '3833-3027' },

  // CENTRO O
  { regiao: 'Centro O', tipo: 'CRECHE', nome: 'EMEI Prof. Joaquim Luís Barbosa', endereco: 'Rua Francisco Alves Levino Filho, 62', bairro: 'Bela Vista', telefone: '3836-1980' },
  { regiao: 'Centro O', tipo: 'ESCOLA', nome: 'EM Maestro Pedro Alves de Souza', endereco: 'Rodovia Oswaldo Cruz, 6.650', bairro: 'Figueira', telefone: '3833-2409' },
  { regiao: 'Centro O', tipo: 'CRECHE', nome: 'CEI Irmã Sofia Rodrigues de Lima (CRECHE)', endereco: 'Rua da Cascata, 1478', bairro: 'Ipiranguinha', telefone: '3836-1496' },
  { regiao: 'Centro O', tipo: 'CRECHE', nome: 'CEI Irmã Sofia Rodrigues de Lima - Vinculada (CRECHE)', endereco: 'Rua Bauxita, 123', bairro: 'Vale do Sol', telefone: '3836-6739' },
  { regiao: 'Centro O', tipo: 'CRECHE', nome: 'CEI Monique Muniz de Carvalho (CRECHE)', endereco: 'Rua Babaçu, 296', bairro: 'Ipiranguinha', telefone: '3832-6070' },
  { regiao: 'Centro O', tipo: 'ESCOLA', nome: 'EM Governador Mário Covas Júnior', endereco: 'Rua da Cascata, 823', bairro: 'Ipiranguinha', telefone: '3833-6660' },
  { regiao: 'Centro O', tipo: 'CRECHE', nome: 'EMEI Professora Helena Maria Mendes Alves', endereco: 'Rua Açaís, nº 30', bairro: 'Ipiranguinha', telefone: '3833-7700' },
  { regiao: 'Centro O', tipo: 'ESCOLA', nome: 'EM Prefeito Silvino Teixeira Leite', endereco: 'Rua Laurentina Braga de Almeida, 210', bairro: 'Marafunda', telefone: '3836-1820' },
  { regiao: 'Centro O', tipo: 'CRECHE', nome: 'CEI Professor José Hércules Cembranelli (CRECHE)', endereco: 'Rua da Educação, 464', bairro: 'Pq. Ministérios', telefone: '3832-2641' },
  { regiao: 'Centro O', tipo: 'ESCOLA', nome: 'EM Madre Maria da Glória', endereco: 'Rua da Educação, 340', bairro: 'Pq. Ministérios', telefone: '3833-0225' },

  // CENTRO S
  { regiao: 'Centro S', tipo: 'CRECHE', nome: 'EMEI Professora Dinorah Pereira de Souza', endereco: 'Praça da Matriz, nº 46', bairro: 'Estufa I', telefone: '3832-3866' },
  { regiao: 'Centro S', tipo: 'CRECHE', nome: 'CEI da Estufa II', endereco: 'Rua Edvaldo Gopferd, 44 e 55', bairro: 'Estufa II', telefone: '3833-2604' },
  { regiao: 'Centro S', tipo: 'CRECHE', nome: 'CEI da Estufa II - Vinculada (CRECHE)', endereco: 'Rua Corinthians, 660', bairro: 'Estufa II', telefone: '3833-8306' },
  { regiao: 'Centro S', tipo: 'ESCOLA', nome: 'EM Professora Maria Josefina Giglio da Silva', endereco: 'Rua Vasco da Gama, nº 430', bairro: 'Estufa II', telefone: '3833-6261' },
  { regiao: 'Centro S', tipo: 'ESCOLA', nome: 'EM Professora Altimira Silva Abirached', endereco: 'Rua Robillard Marigny, 501', bairro: 'Itaguá', telefone: '3832-1493' },
  { regiao: 'Centro S', tipo: 'CRECHE', nome: 'EMEI Professora Bessie Ferreira Osório de Oliveira', endereco: 'Rua Rodrigues de Abreu, 414', bairro: 'Itaguá', telefone: '3832-6011' },
  { regiao: 'Centro S', tipo: 'ESCOLA', nome: 'EM Senhor João Alexandre', endereco: 'Estrada Municipal UBT - 253, nº 240', bairro: 'Sesmaria', telefone: '3833-6588' },
  { regiao: 'Centro S', tipo: 'CRECHE', nome: 'CEI Profª Corsino Aliste Mesquita (CRECHE)', endereco: 'R. Santos, 25', bairro: 'Estufa II', telefone: '(12) 3832-6966' },
  { regiao: 'Centro S', tipo: 'CRECHE', nome: 'CEI PROFESSORA HELOISA MARIA SALLES TEIXEIRA - TIA HELÔ (CRECHE)', endereco: 'RUA ACRE, 404', bairro: 'JARDIM SUMARÉ', telefone: '(12) 3832-5855' },

  // NORTE
  { regiao: 'Norte', tipo: 'ESCOLA', nome: 'EM Maria do Carmo Soares', endereco: 'Estrada Municipal, s/n', bairro: 'Camburi', telefone: '3836-9209' },
  { regiao: 'Norte', tipo: 'ESCOLA', nome: 'EM Professor Honor Figueira', endereco: 'Avenida Principal s/nº', bairro: 'Itamambuca', telefone: '3845-3168' },
  { regiao: 'Norte', tipo: 'ESCOLA', nome: 'EM Professor Iberê Ananias Pimentel', endereco: 'Avenida Beira Mar, s/n', bairro: 'Picinguaba', telefone: '3836-9209' },
  { regiao: 'Norte', tipo: 'ESCOLA', nome: 'EM José Belarmino Sobrinho', endereco: 'Estrada Municipal, s/n', bairro: 'Poruba', telefone: '3845-3184' },
  { regiao: 'Norte', tipo: 'ESCOLA', nome: 'EM Manoel Inocêncio Alves dos Santos', endereco: 'Estrada Pasto Grande, 3041', bairro: 'Ubatumirim', telefone: '3845-4001' },

  // SUL / SUL 1, 2, 3
  { regiao: 'Sul 1', tipo: 'ESCOLA', nome: 'EM Professora Maria da Cruz Barreto', endereco: 'Rua Pedro Cabral Barbosa, 248', bairro: 'Perequê-Mirim', telefone: '3842-1587' },
  { regiao: 'Sul 1', tipo: 'CRECHE', nome: 'EMEI Judith Cabral dos Santos', endereco: 'Rua Benedito Henrique, 248', bairro: 'Perequê-Mirim', telefone: '3842-3575' },
  { regiao: 'Sul 1', tipo: 'ESCOLA', nome: 'EM Professora Maria da Cruz de Oliveira', endereco: 'Rua Pedra Verde, 294', bairro: 'Perequê-Mirim', telefone: '3842-0322' },
  { regiao: 'Sul 1', tipo: 'CRECHE', nome: 'CEI Luisa Basílio dos Santos (CRECHE)', endereco: 'Rodovia Rio Santos, Km 42, s/n', bairro: 'Saco Ribeira', telefone: '3842-2964' },
  { regiao: 'Sul 1', tipo: 'ESCOLA', nome: 'EM Professora Renata Castilho da Silva', endereco: 'Rua Guilherme Crispim Menezes, 30', bairro: 'Saco Ribeira', telefone: '3842-2422' },
  { regiao: 'Sul 2', tipo: 'ESCOLA', nome: 'EM José Libório - (Ernesmar provisória)', endereco: 'Estrada Municipal, s/n', bairro: 'Corcovado', telefone: '3848-2736' },
  { regiao: 'Sul 2', tipo: 'ESCOLA', nome: 'EM Fortaleza', endereco: 'Rua Hamilton Prado, s/nº', bairro: 'Fortaleza', telefone: '3848-1649' },
  { regiao: 'Sul 2', tipo: 'ESCOLA', nome: 'EM Agostinho Alves da Silva', endereco: 'Rodovia SP-55, Km 72,5', bairro: 'Lagoinha', telefone: '3843-3330' },
  { regiao: 'Sul 2', tipo: 'ESCOLA', nome: 'EM Professor Ernesmar de Oliveira', endereco: 'Avenida Yoshiwo Tozaki, s/nº', bairro: 'Praia Dura', telefone: '3848-2736' },
  { regiao: 'Sul 2', tipo: 'ESCOLA', nome: 'EM Professora Maria das Dores Santos Carpinetti', endereco: 'Rua Principal, 1005', bairro: 'Rio Escuro', telefone: '3842-2255' },
  { regiao: 'Sul 2', tipo: 'CRECHE', nome: 'EMEI Maria Lúcia da Nóbrega - Tia Babá', endereco: 'Rua Principal, 424', bairro: 'Rio Escuro', telefone: '3842-2980' },
  { regiao: 'Sul 3', tipo: 'ESCOLA', nome: 'EM Sebastiana Luiza de Oliveira Prado - Dona Tiana', endereco: 'Rua Benedito Gil de Oliveira, nº 106', bairro: 'Araribá', telefone: '3849-5667' },
  { regiao: 'Sul 3', tipo: 'ESCOLA', nome: 'EM Eufrosina Rita de Jesus', endereco: 'Praia do Bonete', bairro: 'Bonete', telefone: '3848-0213' },
  { regiao: 'Sul 3', tipo: 'ESCOLA', nome: 'EM Professora Virgínia Melle da Silva Lefévre', endereco: 'Rua Cabo Luiz Gomes Quevedo, nº 445', bairro: 'Maranduba', telefone: '3849-8131' },
  { regiao: 'Sul 3', tipo: 'CRECHE', nome: 'CEI Ana Paula do Prado (CRECHE)', endereco: 'Rua José Pedro, 80', bairro: 'Sertão Quina', telefone: '3849-5467' },
  { regiao: 'Sul 3', tipo: 'ESCOLA', nome: 'EM Nativa Fernandes de Faria', endereco: 'Rua José Pedro, 80', bairro: 'Sertão Quina', telefone: '3849-8869' },
  { regiao: 'Sul 3', tipo: 'CRECHE', nome: 'EMEI Thereza dos Santos - Tia Thereza', endereco: 'Rua Manoel Gaspar dos Santos, 93', bairro: 'Sertão Quina', telefone: '3849-8883' },
  { regiao: 'Sul', tipo: 'CRECHE', nome: 'CEI MARIA LÚCIA DA NÓBREGA (CRECHE)', endereco: 'RUA: PRINCIPAL - 424', bairro: 'RIO ESCURO', telefone: '(12) 3842-2980' },
];

export const crecheNames = unidadesEnsino.filter(u => u.tipo === 'CRECHE').map(u => u.nome).sort();
export const schoolNames = unidadesEnsino.filter(u => u.tipo === 'ESCOLA').map(u => u.nome).sort();
