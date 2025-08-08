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

export default function DashboardPage() {
  const [expandedRow, setExpandedRow] = useState<number | null>(0)
  const [role, setRole] = useState<string | null>(null)
  const [athletes, setAthletes] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage] = useState<number>(10)

  // Formato dos dados para gráfico de radar
  const formatRadarData = (athlete: any) => {
    if (!athlete) return []

    // Convertendo valores de string para número onde necessário
    const formatPercentage = (val: string) => {
      if (!val || typeof val !== 'string') return 0
      return Number(val.slice(0, -1)) / 10 // Divide por 10 para ajustar escala
    }

    const formatHeight = (height: string) => {
      if (!height || typeof height !== 'string') return 0
      return Number(height.replace(',', '.').slice(0, -1))
    }

    const formatWeight = (weight: string) => {
      if (!weight || typeof weight !== 'string') return 0
      return Number(weight.slice(0, -2)) / 10 // Divide por 10 para ajustar escala
    }

    return [
      { subject: "Física", A: athlete.age ? (athlete.age / 4) : 0 }, // Normalizar idade
      { subject: "Habilidades", A: formatPercentage(athlete.shortShot) },
      { subject: "Arremesso", A: formatPercentage(athlete.longShot) },
      { subject: "Chances", A: athlete.chances ? (Number(athlete.chances) / 10) : 0 },
      { subject: "Aptidão", A: formatPercentage(athlete.freeThrow) },
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
        setRole(user.role)

        // Fetch athletes based on user role - using proper authentication
        let athletesResponse
        if (user.role === 'coach') {
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

        // Handle both single athlete and array of athletes
        let formattedAthletes
        if (user.role === 'coach') {
          formattedAthletes = Array.isArray(athletesData) ? athletesData : [athletesData]
        } else {
          formattedAthletes = [athletesData] // Single athlete for user role 'athlete'
        }

        // For each athlete, fetch probability data if available
        const athletesWithProbability = await Promise.all(
          formattedAthletes.map(async (athlete) => {
            if (!athlete || !athlete.id) return athlete

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
                  // Add formatted date if not present
                  evaluationDate: athlete.evaluationDate || new Date().toLocaleDateString('pt-BR')
                }
              }

              return {
                ...athlete,
                chances: 'N/A',
                // Add formatted date if not present
                evaluationDate: athlete.evaluationDate || new Date().toLocaleDateString('pt-BR')
              }
            } catch (error) {
              console.error('Error fetching probability:', error)
              return {
                ...athlete,
                chances: 'N/A',
                evaluationDate: athlete.evaluationDate || new Date().toLocaleDateString('pt-BR')
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
  const calculateAverage = (athlete: any) => {
    if (!athlete) return 'N/A'

    const formatPercentage = (val: string) => {
      if (!val || typeof val !== 'string') return 0
      return Number(val.slice(0, -1))
    }

    const shortShot = formatPercentage(athlete.shortShot)
    const longShot = formatPercentage(athlete.longShot)
    const freeThrow = formatPercentage(athlete.freeThrow)

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
            {role === 'coach' && (
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
                          <Link href={`/athlete/statistics/${athlete.userId}`} passHref>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-800"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Ver Estatísticas
                            </Button>
                            <Button className="text-blue-600 hover:text-blue-800" onClick={() => (window.location.href = `/athlete/rating/${athlete.userId}`)}>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Avaliar Atleta
                            </Button>
                          </Link>
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
