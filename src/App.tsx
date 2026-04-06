import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Ranking from './Ranking';
import HomePage from './HomePage';
import DetalhePesquisa from './DetalhePesquisa';
import PesquisasSalvas from './PesquisasSalvas';
import Questionario from './Questionario'; 
import QuestionarioCreche from './QuestionarioCreche';
import QuestionarioEscolar from './QuestionarioEscolar';
import Header from './Header';
import RelatorioPage from './RelatorioPage';
import DashboardPage from './DashboardPage';
import LoginPage from './LoginPage';
import AdminPage from './AdminPage';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import { AuthProvider } from './AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main className="bg-background text-text-primary min-h-screen p-4">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Rotas Protegidas */}
            <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/pesquisa" element={<ProtectedRoute><Questionario /></ProtectedRoute>} />
            <Route path="/pesquisas-salvas" element={<ProtectedRoute><PesquisasSalvas /></ProtectedRoute>} />
            <Route path="/pesquisa/:id" element={<ProtectedRoute><DetalhePesquisa /></ProtectedRoute>} />
            <Route path="/ranking" element={<ProtectedRoute><Ranking /></ProtectedRoute>} />
            <Route path="/relatorio" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/relatorio/:id" element={<ProtectedRoute><RelatorioPage /></ProtectedRoute>} />

            {/* Formulários específicos também protegidos */}
            <Route path="/formulario/creche" element={<ProtectedRoute><QuestionarioCreche /></ProtectedRoute>} />
            <Route path="/formulario/escola" element={<ProtectedRoute><QuestionarioEscolar /></ProtectedRoute>} />

            {/* Rota Administrativa */}
            <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />

            {/* Redireciona rotas não encontradas */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
