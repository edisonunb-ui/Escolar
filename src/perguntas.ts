import { checklistCreche, checklistEscola } from './diligenciaConfig';

export const perguntasComLogicaInvertida = new Set(
  [...checklistCreche, ...checklistEscola]
    .filter(item => item.logicaInvertida)
    .map(item => item.id)
);
