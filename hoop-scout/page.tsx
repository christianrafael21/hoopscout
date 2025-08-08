import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
      `}</style>

      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side */}
          <div className="space-y-4">
            <h1 className="text-white text-6xl font-bold font-['Space_Mono'] tracking-tight flex items-center gap-2">
              HoopScout <span className="text-4xl">🏀</span>
            </h1>
            <p className="text-white/90 text-2xl font-['Space_Mono'] leading-tight">
              explore seu desempenho e estatísticas no basquete através dos dados
            </p>
          </div>

          {/* Right side */}
          <div className="w-full max-w-md space-y-4">
            <div className="space-y-2">
              <Input type="email" placeholder="e-mail" className="bg-white h-12 text-lg font-['Space_Mono']" />
              <Input type="password" placeholder="senha" className="bg-white h-12 text-lg font-['Space_Mono']" />
            </div>
            <Button className="w-full h-12 text-lg font-['Space_Mono'] bg-[#1a75ff] hover:bg-[#005ce6]">Entrar</Button>
            <p className="text-center">
              <a href="#" className="text-white hover:underline font-['Space_Mono'] text-sm">
                Primeira vez? Crie uma conta!
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

