
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Ranking from './Ranking';
import HomePage from './HomePage';
import DetalhePesquisa from './DetalhePesquisa';
import PesquisasSalvas from './PesquisasSalvas';
import Questionario from './Questionario'; 
import QuestionarioCreche from './QuestionarioCreche';
import QuestionarioEscolar from './QuestionarioEscolar';
import Header from './Header';
import RelatorioPage from './RelatorioPage'; // Importa a nova página

function App() {
  return (
    <Router>
      <Header />
      <main className="bg-background text-text-primary min-h-screen p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pesquisa" element={<Questionario />} />
          <Route path="/pesquisas-salvas" element={<PesquisasSalvas />} />
          <Route path="/pesquisa/:id" element={<DetalhePesquisa />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/relatorio/:id" element={<RelatorioPage />} /> {/* Rota ajustada */}

          {/* Novas rotas para os formulários específicos */}
          <Route path="/formulario/creche" element={<QuestionarioCreche />} />
          <Route path="/formulario/escola" element={<QuestionarioEscolar />} />

          {/* Redireciona rotas não encontradas */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
