"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ShoppingBasketIcon as Basketball, UserCog } from "lucide-react"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditUserPage() {
  const [primeiroNome, setPrimeiroNome] = useState('');
  const [ultimoNome, setUltimoNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      router.push('/');
      return;
    }

    // Buscar dados atuais do usuário
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:8083/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setPrimeiroNome(userData.primeiro_nome || '');
          setUltimoNome(userData.ultimo_nome || '');
          setEmail(userData.email || '');
        } else {
          setMessage({ type: 'error', text: 'Falha ao carregar dados do usuário' });
          setTimeout(() => {
            router.push('/');
          }, 2000);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        setMessage({ type: 'error', text: 'Erro ao carregar dados' });
      } finally {
        setLoadingData(false);
      }
    };

    fetchUserData();
  }, [router]);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleUpdate = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    setErrors({});

    // Validação básica
    const newErrors: {[key: string]: string} = {};
    
    if (!primeiroNome.trim()) {
      newErrors.primeiro_nome = 'Primeiro nome é obrigatório';
    }
    
    if (!ultimoNome.trim()) {
      newErrors.ultimo_nome = 'Último nome é obrigatório';
    }
    
    if (!email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!validateEmail(email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    if (senha && senha.length < 8) {
      newErrors.senha = 'Senha deve ter no mínimo 8 caracteres';
    }
    
    if (senha && confirmarSenha !== senha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessage({ type: 'error', text: 'Por favor, corrija os erros abaixo' });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('jwtToken');

      // Prepara dados para envio (inclui senha apenas se foi preenchida)
      const updateData = {
        primeiro_nome: primeiroNome,
        ultimo_nome: ultimoNome,
        email,
        ...(senha ? { senha } : {})
      };

      const response = await fetch('http://localhost:8083/user/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
        
        // Limpar campos de senha
        setSenha('');
        setConfirmarSenha('');

        // Redirecionar após atualização
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        try {
          const errorData = await response.json();
          setMessage({ type: 'error', text: errorData.message || 'Falha ao atualizar perfil' });
        } catch {
          // Se a resposta de erro não for JSON
          setMessage({ type: 'error', text: 'Falha ao atualizar perfil' });
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setMessage({ type: 'error', text: 'Erro ao conectar ao servidor' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-2">
      {/* Left side - Black */}
      <div className="bg-[#1a1a1a] p-16 flex flex-col justify-center">
        <div className="space-y-4">
          <h1 className="text-white text-7xl font-bold tracking-tighter flex items-center gap-2">
            HoopScout <Basketball className="w-12 h-12 stroke-[3]" />
          </h1>
          <div className="space-y-0 text-white text-3xl font-bold leading-tight">
            <p>atualize seus dados</p>
            <p>e mantenha seu perfil</p>
            <p>sempre atualizado</p>
          </div>
        </div>
      </div>

      {/* Right side - Dark Gray */}
      <div className="bg-[#2a2a2a] p-16 flex flex-col justify-center items-center">
        <div className="w-full max-w-md space-y-4">
          <div className="flex items-center justify-center mb-6">
            <UserCog className="w-12 h-12 text-white" />
            <h2 className="text-white text-2xl font-bold ml-2">Editar Perfil</h2>
          </div>

          {loadingData ? (
            <div className="text-center text-white">
              <p>Carregando dados...</p>
            </div>
          ) : (
            <>
              {message.text && (
                <div className={`p-3 rounded ${message.type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white`}>
                  {message.text}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="primeiro nome"
                    className="h-12 bg-white border-0 text-black text-lg rounded-none"
                    value={primeiroNome}
                    onChange={(e) => setPrimeiroNome(e.target.value)}
                  />
                  {errors.primeiro_nome && <p className="text-red-500 text-sm mt-1">{errors.primeiro_nome}</p>}
                </div>

                <div>
                  <Input
                    type="text"
                    placeholder="último nome"
                    className="h-12 bg-white border-0 text-black text-lg rounded-none"
                    value={ultimoNome}
                    onChange={(e) => setUltimoNome(e.target.value)}
                  />
                  {errors.ultimo_nome && <p className="text-red-500 text-sm mt-1">{errors.ultimo_nome}</p>}
                </div>

                <div>
                  <Input
                    type="email"
                    placeholder="e-mail"
                    className="h-12 bg-white border-0 text-black text-lg rounded-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Input
                    type="password"
                    placeholder="nova senha (deixe em branco para manter a atual)"
                    className="h-12 bg-white border-0 text-black text-lg rounded-none"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                  {errors.senha && <p className="text-red-500 text-sm mt-1">{errors.senha}</p>}
                </div>

                {senha && (
                  <div>
                    <Input
                      type="password"
                      placeholder="confirmar nova senha"
                      className="h-12 bg-white border-0 text-black text-lg rounded-none"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                    />
                    {errors.confirmarSenha && <p className="text-red-500 text-sm mt-1">{errors.confirmarSenha}</p>}
                  </div>
                )}

                <Button
                  className="w-full h-12 bg-[#1a75ff] hover:bg-[#1a75ff]/90 rounded-none text-lg font-medium"
                  onClick={handleUpdate}
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>

              <div className="text-center">
                <a href="/dashboard" className="text-white hover:underline text-sm underline underline-offset-4">
                  Voltar para o dashboard
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
