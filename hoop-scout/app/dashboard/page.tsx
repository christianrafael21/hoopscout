"use client"

import React, { useEffect, useState } from "react"
import { NavbarLogged } from "../components/navbar-logged"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ChevronDown, ChevronRight, UserPlus } from "lucide-react"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { User } from "@/app/models/User.model"
import ExportarRelatorio from "../components/exportar-relatorio"
import { Athlete } from "@/app/models/Athlete.model"

export default function DashboardPage() {
  const [expandedRow, setExpandedRow] = useState<number | null>(0)
  const [role, setRole] = useState<string | null>(null)
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage] = useState<number>(10)

  // Formato dos dados para gráfico de radar
  const formatRadarData = (athlete: Athlete) => {
    if (!athlete) return []

    // Convertendo valores para número onde necessário
    const formatValue = (val: number | null) => {
      if (!val) return 0
      return val / 10 // Divide por 10 para ajustar escala
    }

    return [
      { subject: "Física", A: athlete.age ? (athlete.age / 4) : 0 }, // Normalizar idade
      { subject: "Habilidades", A: formatValue(athlete.shortShot) },
      { subject: "Arremesso", A: formatValue(athlete.longShot) },
      { subject: "Chances", A: athlete.chances ? (Number(athlete.chances) / 10) : 0 },
      { subject: "Aptidão", A: formatValue(athlete.freeThrow) },
    ]
  }

  useEffect(() => {
    async function fetchUserAndData() {
      setLoading(true)
      try {
        // Get token from localStorage
        const token = localStorage.getItem('jwtToken')
        if (!token) {
          throw new Error('Token not found')
        }

        // Get user info from localStorage
        const userString = localStorage.getItem('user')
        if (!userString) {
          throw new Error('User info not found')
        }

        const user: User = JSON.parse(userString)
        setRole(user.tipo)

        // Fetch athletes based on user role - using proper authentication
        let athletesResponse
        console.log('Tipo de usuário:', user.tipo)
        if (user.tipo === 'COACH') {
          console.log('Buscando todos os atletas como coach')
          athletesResponse = await fetch('http://localhost:8083/all/athletes', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          })
        } else {
          athletesResponse = await fetch('http://localhost:8083/athlete', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          })
        }

        // Check if response is OK before attempting to parse JSON
        if (!athletesResponse.ok) {
          const errorText = await athletesResponse.text()
          throw new Error(`Error fetching athletes: ${athletesResponse.status} - ${errorText}`)
        }

        // Parse athlete data
        const athletesData = await athletesResponse.json()
        console.log('Dados recebidos da API:', athletesData)

        // Handle both single athlete and array of athletes
        let formattedAthletes
        if (user.tipo === 'COACH') {
          formattedAthletes = Array.isArray(athletesData) ? athletesData : [athletesData]
        } else {
          formattedAthletes = [athletesData] // Single athlete for user role 'athlete'
        }

        console.log('Atletas formatados:', formattedAthletes)

        // For each athlete, fetch probability data if available
        const athletesWithProbability = await Promise.all(
          formattedAthletes.map(async (athlete) => {
            if (!athlete || !athlete.id) {
              console.log('Atleta inválido:', athlete)
              return athlete
            }

            try {
              // Fetch probability for this athlete
              const probabilityResponse = await fetch(`http://localhost:8083/probability`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                }
              })

              if (probabilityResponse.ok) {
                const probabilityData = await probabilityResponse.json()
                return {
                  ...athlete,
                  chances: probabilityData.probability || 'N/A',
                  // Manter a data de avaliação que veio do backend, ou usar uma padrão se não houver
                  evaluationDate: athlete.evaluationDate || 'N/A'
                }
              }

              return {
                ...athlete,
                chances: 'N/A',
                // Manter a data de avaliação que veio do backend, ou usar uma padrão se não houver
                evaluationDate: athlete.evaluationDate || 'N/A'
              }
            } catch (error) {
              console.error('Error fetching probability:', error)
              return {
                ...athlete,
                chances: 'N/A',
                evaluationDate: athlete.evaluationDate || 'N/A'
              }
            }
          })
        )

        setAthletes(athletesWithProbability)
      } catch (error) {
        console.error('Error in data fetching:', error)
        setError(error instanceof Error ? error.message : 'Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndData()
  }, [])

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentAthletes = athletes.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(athletes.length / itemsPerPage)

  // Function to handle pagination
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Calculate average from athlete stats
  const calculateAverage = (athlete: Athlete) => {
    if (!athlete) return 'N/A'

    const formatValue = (val: number | null) => {
      if (!val) return 0
      return val
    }

    const shortShot = formatValue(athlete.shortShot)
    const longShot = formatValue(athlete.longShot)
    const freeThrow = formatValue(athlete.freeThrow)

    // Simple average of available shooting percentages
    const values = [shortShot, longShot, freeThrow].filter(val => val > 0)
    if (values.length === 0) return 'N/A'

    const sum = values.reduce((acc, val) => acc + val, 0)
    return (sum / values.length / 10).toFixed(1) // Divide by 10 to get scale of 0-10
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <NavbarLogged />

      <main className="container mx-auto px-6 py-12">
        <div className="bg-white rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Atletas Cadastrados</h2>
              <p className="text-gray-500">Gerencie e acompanhe o desenvolvimento dos atletas</p>
            </div>
            {role === 'COACH' && (
              <div className="flex gap-4 items-center">
                <Input type="search" placeholder="Buscar atleta..." className="max-w-xs" />
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <p>Carregando dados...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 p-4 rounded-md">
              <p className="text-red-700">{error}</p>
              <Button
                variant="outline"
                className="mt-4 border-black text-black hover:bg-black hover:text-white"
                onClick={() => {
                  localStorage.clear()
                  window.location.href = '/'
                }}
              >
                Voltar para Login
              </Button>
            </div>
          ) : athletes.length === 0 ? (
            <div className="text-center py-8">
              <p>Nenhum atleta encontrado.</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30px]"></TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Média Geral</TableHead>
                    <TableHead>Data Avaliação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentAthletes.map((athlete, index) => (
                    <React.Fragment key={athlete.id || index}>
                      <TableRow
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                      >
                        <TableCell>
                          {expandedRow === index ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </TableCell>
                        <TableCell>{athlete.name || 'N/A'}</TableCell>
                        <TableCell>{calculateAverage(athlete)}</TableCell>
                        <TableCell>{athlete.evaluationDate || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Link href={`/athlete/statistics/${athlete.userId}`} passHref>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-800"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Ver Estatísticas
                              </Button>
                            </Link>
                            <Link href={`/athlete/comparison/${athlete.userId}`} passHref>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-yellow-600 hover:text-yellow-800"
                                onClick={(e) => e.stopPropagation()}
                              >
                                🏆 Comparar com Ouro
                              </Button>
                            </Link>
                            {role === 'COACH' && (
                              <Button 
                                className="text-blue-600 hover:text-blue-800" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.location.href = `/athlete/rating/${athlete.userId}`;
                                }}
                              >
                                <UserPlus className="mr-2 h-4 w-4" />
                                Avaliar Atleta
                              </Button>
                            )}
                            <ExportarRelatorio 
                              idAtleta={athlete.userId}
                              tipoRelatorio="estatisticas"
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-800"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedRow === index && (
                        <TableRow>
                          <TableCell colSpan={7}>
                            <div className="grid grid-cols-2 gap-8 p-4 bg-gray-50">
                              <div className="space-y-6">
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <h4 className="font-medium text-gray-500">Idade</h4>
                                    <p>{athlete.age || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-500">Altura</h4>
                                    <p>{athlete.height || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-500">Peso</h4>
                                    <p>{athlete.weight || 'N/A'}</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <h4 className="font-medium text-gray-500">Arremessos</h4>
                                    <p>{athlete.shortShot || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-500">3 Pontos</h4>
                                    <p>{athlete.longShot || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-500">Lances Livres</h4>
                                    <p>{athlete.freeThrow || 'N/A'}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={formatRadarData(athlete)}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="subject" />
                                    <PolarRadiusAxis angle={30} domain={[0, 10]} />
                                    <Radar name="Atleta" dataKey="A" stroke="#1a75ff" fill="#1a75ff" fillOpacity={0.6} />
                                  </RadarChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentPage > 1) paginate(currentPage - 1)
                          }}
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === i + 1}
                            onClick={(e) => {
                              e.preventDefault()
                              paginate(i + 1)
                            }}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentPage < totalPages) paginate(currentPage + 1)
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
