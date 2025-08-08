"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ShoppingBasketIcon as Basketball, UserCog } from "lucide-react"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditUserPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      router.push('/login');
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
          setName(userData.name || '');
          setEmail(userData.email || '');
        } else {
          setMessage({ type: 'error', text: 'Falha ao carregar dados do usuário' });
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        setMessage({ type: 'error', text: 'Erro ao carregar dados' });
      }
    };

    fetchUserData();
  }, [router]);

  const handleUpdate = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validação básica
    if (!name.trim() || !email.trim()) {
      setMessage({ type: 'error', text: 'Nome e e-mail são obrigatórios' });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('jwtToken');

      // Prepara dados para envio (inclui senha apenas se foi preenchida)
      const updateData = {
        name,
        email,
        ...(password ? { password } : {})
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

        // Verificar se a resposta contém conteúdo e se é JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          try {
            const data = await response.json();
            // Atualizar o JWT decodificado no localStorage
            if (data.token) {
              localStorage.setItem('jwtToken', data.token);
              try {
                const parts = data.token.split('.');
                if (parts.length === 3) {
                  const decodedPayload = JSON.parse(atob(parts[1]));
                  localStorage.setItem('user', JSON.stringify(decodedPayload));
                }
              } catch (error) {
                console.error('Erro ao decodificar JWT:', error);
              }
            }
          } catch (error) {
            console.error('Resposta não é um JSON válido:', error);
            // Continuar com o fluxo de sucesso mesmo sem token atualizado
          }
        }

        // Redirecionar após atualização
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        try {
          const errorData = await response.json();
          setMessage({ type: 'error', text: errorData.message || 'Falha ao atualizar perfil' });
        } catch (error) {
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

          {message.text && (
            <div className={`p-3 ${message.type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white`}>
              {message.text}
            </div>
          )}

          <Input
            type="text"
            placeholder="nome completo"
            className="h-12 bg-white border-0 text-black text-lg rounded-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="e-mail"
            className="h-12 bg-white border-0 text-black text-lg rounded-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="nova senha (deixe em branco para manter a atual)"
            className="h-12 bg-white border-0 text-black text-lg rounded-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            className="w-full h-12 bg-[#1a75ff] hover:bg-[#1a75ff]/90 rounded-none text-lg font-medium"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
          <div className="text-center">
            <a href="/dashboard" className="text-white hover:underline text-sm underline underline-offset-4">
              Voltar para o dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
