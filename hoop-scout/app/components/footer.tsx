export function Footer() {
  return (
    <footer className="bg-white py-4 px-6 border-t">
      <div className="container mx-auto flex justify-between items-center">
        <p className="text-sm text-gray-600">© 2024 HoopScout. Todos os direitos reservados.</p>
        <div className="flex gap-4">
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
            Termos
          </a>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
            Privacidade
          </a>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
            Contato
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer

