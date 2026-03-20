
import { Link } from 'react-router-dom';
import { BarChart, CheckSquare, FileText, LayoutDashboard } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto bg-background">
      <header className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">Fiscaliza Ubatuba</h1>
        <p className="text-md sm:text-lg text-text-secondary mt-2">Sua ferramenta para avaliação e acompanhamento das unidades escolares.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        {/* Card para Preencher Formulário */}
        <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between">
          <div>
            <CheckSquare className="mx-auto h-12 w-12 text-primary" />
            <h2 className="text-2xl font-semibold text-text-primary mt-4">Avaliar Unidade</h2>
            <p className="text-text-secondary mt-2">Preencha um novo formulário de avaliação para uma creche ou escola.</p>
          </div>
          <Link to="/pesquisa" className="mt-6 inline-block bg-primary text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:brightness-90 transition-colors">
            Iniciar Avaliação
          </Link>
        </div>

        {/* Card para Ver Pesquisas Salvas */}
        <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between">
          <div>
            <FileText className="mx-auto h-12 w-12 text-primary" />
            <h2 className="text-2xl font-semibold text-text-primary mt-4">Avaliações Salvas</h2>
            <p className="text-text-secondary mt-2">Consulte e imprima as avaliações que já foram realizadas.</p>
          </div>
          <Link to="/pesquisas-salvas" className="mt-6 inline-block bg-primary text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:brightness-90 transition-colors">
            Ver Avaliações
          </Link>
        </div>

        {/* Card para Ver o Ranking */}
        <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between">
          <div>
            <BarChart className="mx-auto h-12 w-12 text-primary" />
            <h2 className="text-2xl font-semibold text-text-primary mt-4">Ranking Geral</h2>
            <p className="text-text-secondary mt-2">Veja o ranking de desempenho entre as unidades avaliadas.</p>
          </div>
          <Link to="/ranking" className="mt-6 inline-block bg-primary text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:brightness-90 transition-colors">
            Ver Ranking
          </Link>
        </div>

        {/* Card para o Dashboard de Relatórios */}
        <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between">
          <div>
            <LayoutDashboard className="mx-auto h-12 w-12 text-primary" />
            <h2 className="text-2xl font-semibold text-text-primary mt-4">Dashboard</h2>
            <p className="text-text-secondary mt-2">Acesse o painel de relatórios com os indicadores e o ranking.</p>
          </div>
          <Link to="/relatorio" className="mt-6 inline-block bg-primary text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:brightness-90 transition-colors">
            Abrir Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
