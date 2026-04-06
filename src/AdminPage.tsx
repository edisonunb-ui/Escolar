import React, { useState, useEffect } from 'react';
import { 
  collection, 
  deleteDoc, 
  doc, 
  query, 
  setDoc,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { 
  UserPlus, 
  Trash2, 
  ShieldCheck, 
  Mail, 
  Loader2, 
  Search, 
  Users, 
  ClipboardList, 
  Calendar,
  Building
} from 'lucide-react';

interface AuthorizedEmail {
  id: string;
  email: string;
  authorized: boolean;
  createdAt: any;
}

interface Pesquisa {
  id: string;
  nome: string;
  tipo: string;
  timestamp: Timestamp;
  data: string;
}

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'researches'>('users');
  
  // States for Users Tab
  const [emails, setEmails] = useState<AuthorizedEmail[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [addingEmail, setAddingEmail] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  
  // States for Researches Tab
  const [researches, setResearches] = useState<Pesquisa[]>([]);
  const [researchSearch, setResearchSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Listen to Authorized Emails
    const uQ = query(collection(db, 'authorized_emails'));
    const unsubscribeUsers = onSnapshot(uQ, (snapshot) => {
      const list: AuthorizedEmail[] = [];
      snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() } as AuthorizedEmail));
      setEmails(list);
      if (activeTab === 'users') setLoading(false);
    }, (error) => {
      console.error("Erro ao carregar usuários:", error);
      if (activeTab === 'users') setLoading(false);
    });

    // Listen to Researches (Diligencias)
    const rQ = query(collection(db, 'diligencias'));
    const unsubscribeResearches = onSnapshot(rQ, (snapshot) => {
      const list: Pesquisa[] = [];
      snapshot.forEach((snap) => {
        const data = snap.data();
        list.push({
          id: snap.id,
          nome: data.nomeCreche || data.nomeEscola || 'Sem Nome',
          tipo: data.tipificacao || 'N/A',
          timestamp: data.timestamp,
          data: data.timestamp?.toDate().toLocaleDateString('pt-BR') || 'Data indisponível'
        } as Pesquisa);
      });
      // Sort by date descending
      list.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));
      setResearches(list);
      if (activeTab === 'researches') setLoading(false);
    }, (error) => {
      console.error("Erro ao carregar pesquisas:", error);
      if (activeTab === 'researches') setLoading(false);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeResearches();
    };
  }, [activeTab]);

  // Auth Email Handlers
  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setAddingEmail(true);
    try {
      const emailDoc = newEmail.toLowerCase().trim();
      await setDoc(doc(db, 'authorized_emails', emailDoc), {
        email: emailDoc,
        authorized: true,
        createdAt: new Date()
      });
      setNewEmail('');
    } catch (error) {
      alert("Erro ao adicionar e-mail.");
    } finally {
      setAddingEmail(false);
    }
  };

  const handleDeleteEmail = async (id: string) => {
    if (!window.confirm("Remover autorização deste e-mail?")) return;
    await deleteDoc(doc(db, 'authorized_emails', id));
  };

  // Research Handlers
  const handleDeleteResearch = async (id: string, name: string) => {
    if (!window.confirm(`Tem certeza que deseja EXCLUIR DEFINITIVAMENTE a pesquisa de "${name}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await deleteDoc(doc(db, 'diligencias', id));
    } catch (error) {
      alert("Erro ao excluir pesquisa.");
    }
  };

  const filteredUsers = emails.filter(e => e.email.toLowerCase().includes(userSearch.toLowerCase()));
  const filteredResearches = researches.filter(r => r.nome.toLowerCase().includes(researchSearch.toLowerCase()));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-background min-h-screen text-text-primary animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <ShieldCheck className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Painel de Administração</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 font-semibold flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'users' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <Users className="w-5 h-5" />
          Usuários Autorizados
        </button>
        <button
          onClick={() => setActiveTab('researches')}
          className={`px-6 py-3 font-semibold flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'researches' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          Gerenciar Pesquisas
        </button>
      </div>

      {activeTab === 'users' ? (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Add New Email */}
          <div className="bg-card border border-gray-800 p-6 rounded-xl mb-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Autorizar Novo Colaborador
            </h2>
            <form onSubmit={handleAddEmail} className="flex gap-4">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="email"
                  required
                  className="w-full bg-background border border-gray-700 rounded-lg py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
                  placeholder="exemplo@gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={addingEmail}
                className="bg-primary hover:bg-teal-600 px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {addingEmail ? <Loader2 className="w-5 h-5 animate-spin" /> : "Autorizar"}
              </button>
            </form>
          </div>

          {/* User List */}
          <div className="bg-card border border-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">E-mails com Acesso</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full bg-background border border-gray-700 rounded-lg py-1.5 pl-9 pr-4 text-sm"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody>
                  {filteredUsers.map((item) => (
                    <tr key={item.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-medium">{item.email}</td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleDeleteEmail(item.id)}
                          className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Research List */}
          <div className="bg-card border border-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Todas as Pesquisas Salvas</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Buscar por nome..."
                  className="w-full bg-background border border-gray-700 rounded-lg py-1.5 pl-9 pr-4 text-sm"
                  value={researchSearch}
                  onChange={(e) => setResearchSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-800 text-text-secondary text-sm">
                    <th className="pb-3 px-4 font-medium">Unidade / Nome</th>
                    <th className="pb-3 px-4 font-medium">Tipo</th>
                    <th className="pb-3 px-4 font-medium">Data</th>
                    <th className="pb-3 px-4 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResearches.map((res) => (
                    <tr key={res.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Building className="w-5 h-5 text-primary/60" />
                          <span className="font-medium">{res.nome}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-white/5 rounded text-xs">
                          {res.tipo}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-text-secondary text-sm">
                          <Calendar className="w-4 h-4" />
                          {res.data}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleDeleteResearch(res.id, res.nome)}
                          className="px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all text-sm font-semibold border border-red-500/20"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredResearches.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-text-secondary italic">
                        Nenhuma pesquisa encontrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
