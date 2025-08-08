"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ShoppingBasketIcon as Basketball } from "lucide-react"
import { ChangeEvent, FormEvent, useState } from "react";

type FormData = {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
};

type Errors = {
  nome?: string;
  email?: string;
  senha?: string;
  confirmarSenha?: string;
};

export default function CadastroPage() {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRedirectLogin = () => {
    window.location.href ='/';
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const verValores = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let newErrors: Errors = {};
    if (!formData.nome) newErrors.nome = "Nome é obrigatório";
    if (!formData.email) newErrors.email = "E-mail é obrigatório";
    else if (!validateEmail(formData.email)) newErrors.email = "E-mail inválido";
    if (!formData.senha) newErrors.senha = "Senha é obrigatória";
    if (!formData.confirmarSenha) newErrors.confirmarSenha = "Confirmação de senha é obrigatória";
    else if (formData.senha !== formData.confirmarSenha) newErrors.confirmarSenha = "As senhas não coincidem";

    setErrors(newErrors);

    // Se houver erros, não faça a requisição
    if (Object.keys(newErrors).length > 0) {
      setSuccess(false);
      return;
    }

    // Se todos os campos forem válidos, fazer a requisição POST
    setLoading(true);

    const payload = {
      name: formData.nome,
      email: formData.email,
      password: formData.senha,
    }
    try {
      const response = await fetch("http://localhost:8083/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          nome: "",
          email: "",
          senha: "",
          confirmarSenha: "",
        });
        setTimeout(() => {
          handleRedirectLogin()
        }, 3000)
      } else {
        setSuccess(false);
      }
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-2">
      {/* Left side - Black */}
      <div className="bg-[#1a1a1a] p-16 flex flex-col justify-center">
        <div className="space-y-4">
          <h1 className="text-white text-7xl font-bold tracking-tighter flex items-center gap-2">
            HoopScout <Basketball className="w-12 h-12 stroke-[3]" />
          </h1>
          <div className="space-y-0 text-white text-3xl font-bold leading-tight">
            <p>crie sua conta</p>
            <p>e comece a analisar</p>
            <p>seu jogo hoje</p>
          </div>
        </div>
      </div>

      {/* Right side - Dark Gray */}
      <div className="bg-[#2a2a2a] p-16 flex flex-col justify-center items-center">
        <div className="w-full max-w-md space-y-4">
          <Input
            type="text"
            name="nome"
            placeholder="nome completo"
            className="h-12 bg-white border-0 text-black text-lg rounded-none"
            onChange={handleChange}
            value={formData.nome}
          />
          {errors.nome && <p className="text-red-500 text-sm">{errors.nome}</p>}

          <Input
            type="email"
            name="email"
            placeholder="e-mail"
            className="h-12 bg-white border-0 text-black text-lg rounded-none"
            onChange={handleChange}
            value={formData.email}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <Input
            type="password"
            name="senha"
            placeholder="senha"
            className="h-12 bg-white border-0 text-black text-lg rounded-none"
            onChange={handleChange}
            value={formData.senha}
          />
          {errors.senha && <p className="text-red-500 text-sm">{errors.senha}</p>}

          <Input
            type="password"
            name="confirmarSenha"
            placeholder="confirmar senha"
            className="h-12 bg-white border-0 text-black text-lg rounded-none"
            onChange={handleChange}
            value={formData.confirmarSenha}
          />
          {errors.confirmarSenha && <p className="text-red-500 text-sm">{errors.confirmarSenha}</p>}
          <Button
            className="w-full h-12 bg-[#1a75ff] hover:bg-[#1a75ff]/90 rounded-none text-lg font-medium"
            onClick={verValores}
            disabled={loading}
          >
            {loading ? "Carregando..." : "Criar Conta"}
          </Button>
          {success !== null && (
            <p className={success ? "text-green-500" : "text-red-500"}>{success ? "Conta criada com sucesso!" : "Houve um erro. Tente novamente."}</p>
          )}
          <div className="text-center">
          <a href="/"
            className="text-white hover:underline text-sm underline underline-offset-4"
            onClick={(e) => {
              e.preventDefault();
              handleRedirectLogin();
            }}
          >
            Já tem uma conta? Faça login!
          </a>
          </div>
        </div>
      </div>
    </div>
  );
}
