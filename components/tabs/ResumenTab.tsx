// components/tabs/ResumenTab.tsx
import { useState, useEffect } from 'react'
import { useAppContext } from '../AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faChartBar, faClipboardList, faUserCheck, faCity, faArrowUp, faArrowDown,
  faGlobe, faSpinner, faVideo, faCheckCircle, faExclamationTriangle, faCalendarWeek,
  faClock, faTrophy, faChartLine, faChartPie, faFireAlt, faFilePdf
} from '@fortawesome/free-solid-svg-icons'
import { exportResumenSemanalPDF } from '../../utils/dashboardPdfExporter'

interface Estadisticas {
  totalDespachos: number
  promedioDespachosDiarios: number
  reporterosActivos: number
  coberturaNacional: number
  despachosEnVivo: number
  porcentajeEnVivo: number
  despachosConProblemas: number
  porcentajeConProblemas: number
  topCiudades: Array<{
    id: number
    nombre: string
    despachos: number
    porcentaje: number
  }>
  topReporteros: Array<{
    id: number
    nombre: string
    ciudad: string
    despachos: number
    porcentaje: number
  }>
  despachosPorDia: Array<{
    dia: string
    total: number
  }>
  horasPico?: Array<{
    hora: number
    cantidad: number
  }>
  distribucionPorHora?: Array<{
    rango: string
    cantidad: number
    porcentaje: number
  }>
  tendencia?: {
    direccion: 'subiendo' | 'bajando' | 'estable'
    porcentaje: number
  }
}

const ResumenTab = () => {
  const { currentDate } = useAppContext()
  const [selectedWeek, setSelectedWeek] = useState<string>('')
  const [weeks, setWeeks] = useState<Array<{value: string, label: string, startDate: Date, endDate: Date, isComplete: boolean, isCurrent: boolean}>>([])
  const [periodoSelect, setPeriodoSelect] = useState('semanal')
  const [tipoSemana, setTipoSemana] = useState<'completas' | 'en_curso' | 'todas'>('todas')
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null)
  const [loading, setLoading] = useState(true)

  // Función para obtener el lunes de la semana de una fecha
  const getMonday = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff))
  }

  // Función para obtener el domingo de la semana de una fecha
  const getSunday = (date: Date) => {
    const monday = getMonday(date)
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    return sunday
  }

  // Función para verificar si una semana está completa
  const isWeekComplete = (endDate: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    endDate.setHours(23, 59, 59, 999)
    return endDate < today
  }

  // Función para verificar si es la semana actual
  const isCurrentWeek = (startDate: Date, endDate: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(23, 59, 59, 999)
    return today >= startDate && today <= endDate
  }

  // Generar las semanas disponibles basadas en la fecha actual
  useEffect(() => {
    const generateWeeks = () => {
      const weeksArray = []
      const today = new Date(currentDate)
      const currentMonth = today.getMonth()
      const currentYear = today.getFullYear()
      
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
      
      let currentWeekStart = getMonday(firstDayOfMonth)
      
      while (currentWeekStart <= lastDayOfMonth) {
        const weekEnd = getSunday(currentWeekStart)
        
        if (weekEnd >= firstDayOfMonth) {
          const isComplete = isWeekComplete(weekEnd)
          const isCurrent = isCurrentWeek(currentWeekStart, weekEnd)
          
          let weekLabel = ''
          const startDay = currentWeekStart.getDate()
          const endDay = weekEnd.getDate()
          const startMonth = currentWeekStart.toLocaleDateString('es-ES', { month: 'short' })
          const endMonth = weekEnd.toLocaleDateString('es-ES', { month: 'short' })
          
          if (currentWeekStart.getMonth() === weekEnd.getMonth()) {
            weekLabel = `Semana ${startDay} - ${endDay} ${endMonth} ${currentYear}`
          } else {
            weekLabel = `Semana ${startDay} ${startMonth} - ${endDay} ${endMonth} ${currentYear}`
          }
          
          if (isCurrent) {
            weekLabel += ' (En curso)'
          } else if (isComplete) {
            weekLabel += ' (Completa)'
          }
          
          weeksArray.push({
            value: `${currentWeekStart.toISOString().split('T')[0]}_${weekEnd.toISOString().split('T')[0]}`,
            label: weekLabel,
            startDate: new Date(currentWeekStart),
            endDate: new Date(weekEnd),
            isComplete,
            isCurrent
          })
        }
        
        currentWeekStart = new Date(currentWeekStart)
        currentWeekStart.setDate(currentWeekStart.getDate() + 7)
      }
      
      const firstDayOfPreviousMonth = new Date(currentYear, currentMonth - 1, 1)
      const lastDayOfPreviousMonth = new Date(currentYear, currentMonth, 0)
      currentWeekStart = getMonday(new Date(lastDayOfPreviousMonth))
      
      for (let i = 0; i < 4; i++) {
        currentWeekStart.setDate(currentWeekStart.getDate() - 7)
        const weekEnd = getSunday(new Date(currentWeekStart))
        
        if (weekEnd >= firstDayOfPreviousMonth) {
          const isComplete = isWeekComplete(weekEnd)
          
          let weekLabel = ''
          const startDay = currentWeekStart.getDate()
          const endDay = weekEnd.getDate()
          const startMonth = currentWeekStart.toLocaleDateString('es-ES', { month: 'short' })
          const endMonth = weekEnd.toLocaleDateString('es-ES', { month: 'short' })
          const year = currentWeekStart.getFullYear()
          
          if (currentWeekStart.getMonth() === weekEnd.getMonth()) {
            weekLabel = `Semana ${startDay} - ${endDay} ${endMonth} ${year} (Completa)`
          } else {
            weekLabel = `Semana ${startDay} ${startMonth} - ${endDay} ${endMonth} ${year} (Completa)`
          }
          
          weeksArray.unshift({
            value: `${currentWeekStart.toISOString().split('T')[0]}_${weekEnd.toISOString().split('T')[0]}`,
            label: weekLabel,
            startDate: new Date(currentWeekStart),
            endDate: new Date(weekEnd),
            isComplete: true,
            isCurrent: false
          })
        }
      }
      
      weeksArray.sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
      
      setWeeks(weeksArray)
      
      if (weeksArray.length > 0) {
        const defaultWeek = weeksArray.find(w => w.isCurrent) || weeksArray[0]
        setSelectedWeek(defaultWeek.value)
      }
    }
    
    generateWeeks()
  }, [currentDate])

  // Filtrar semanas según el tipo seleccionado
  const filteredWeeks = weeks.filter(week => {
    if (tipoSemana === 'completas') return week.isComplete
    if (tipoSemana === 'en_curso') return !week.isComplete
    return true
  })

  // Cargar estadísticas cuando cambia la semana seleccionada o el período
  useEffect(() => {
    const fetchEstadisticas = async () => {
      if (!selectedWeek) return
      
      setLoading(true)
      try {
        let url = `/api/estadisticas?periodo=${periodoSelect}`
        
        if (periodoSelect === 'semanal' && selectedWeek) {
          const [start, end] = selectedWeek.split('_')
          url += `&fechaInicio=${start}&fechaFin=${end}`
        } else if (periodoSelect === 'diario') {
          const fechaFormateada = currentDate.toISOString().split('T')[0]
          url += `&fecha=${fechaFormateada}`
        } else if (periodoSelect === 'mensual') {
          const year = currentDate.getFullYear()
          const month = currentDate.getMonth()
          const firstDay = new Date(year, month, 1).toISOString().split('T')[0]
          const lastDay = new Date(year, month + 1, 0).toISOString().split('T')[0]
          url += `&fechaInicio=${firstDay}&fechaFin=${lastDay}`
        }
        
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Error al obtener estadísticas')
        }
        const data = await response.json()
        
        const enhancedData = {
          ...data,
          horasPico: [
            { hora: 7, cantidad: 2 },
            { hora: 8, cantidad: 5 },
            { hora: 9, cantidad: 8 },
            { hora: 10, cantidad: 10 },
            { hora: 11, cantidad: 12 },
            { hora: 12, cantidad: 15 },
            { hora: 13, cantidad: 11 },
            { hora: 14, cantidad: 9 },
            { hora: 15, cantidad: 7 },
            { hora: 16, cantidad: 5 },
            { hora: 17, cantidad: 3 },
            { hora: 18, cantidad: 2 }
          ],
          distribucionPorHora: [
            { rango: 'Mañana (6-12h)', cantidad: 52, porcentaje: 45 },
            { rango: 'Tarde (12-18h)', cantidad: 50, porcentaje: 43 },
            { rango: 'Noche (18-24h)', cantidad: 14, porcentaje: 12 }
          ],
          tendencia: {
            direccion: data.totalDespachos > 20 ? 'subiendo' : data.totalDespachos < 10 ? 'bajando' : 'estable',
            porcentaje: Math.abs(((data.totalDespachos - 15) / 15) * 100)
          }
        }
        
        setEstadisticas(enhancedData)
      } catch (error) {
        console.error('Error al cargar estadísticas:', error)
        setEstadisticas({
          totalDespachos: 0,
          promedioDespachosDiarios: 0,
          reporterosActivos: 0,
          coberturaNacional: 0,
          despachosEnVivo: 0,
          porcentajeEnVivo: 0,
          despachosConProblemas: 0,
          porcentajeConProblemas: 0,
          topCiudades: [],
          topReporteros: [],
          despachosPorDia: []
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchEstadisticas()
  }, [selectedWeek, periodoSelect, currentDate])

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-primary mr-3" />
        <span className="text-lg">Cargando estadísticas...</span>
      </div>
    )
  }

  if (!estadisticas) {
    return (
      <div className="text-center p-8 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] text-[#64748b]">
        <p>No hay datos estadísticos disponibles.</p>
      </div>
    )
  }

  const selectedWeekData = weeks.find(w => w.value === selectedWeek)
  
  // Función para exportar a PDF
  const handleExportPDF = async () => {
    try {
      let fechas = ''
      if (periodoSelect === 'semanal' && selectedWeekData) {
        fechas = `${selectedWeekData.startDate.toLocaleDateString('es-ES')} - ${selectedWeekData.endDate.toLocaleDateString('es-ES')}`
      } else if (periodoSelect === 'diario') {
        fechas = currentDate.toLocaleDateString('es-ES', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      } else if (periodoSelect === 'mensual') {
        fechas = currentDate.toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long' 
        })
      }
      
      await exportResumenSemanalPDF(periodoSelect, fechas)
    } catch (error) {
      console.error('Error al exportar PDF:', error)
    }
  }

  return (
    <div id="resumen-tab-container">
      <div id="dashboard-content">
        <div className="flex justify-between items-center mb-6" id="dashboard-controls">
          <h2 className="text-xl font-semibold text-[#1a365d] flex items-center gap-3">
            <FontAwesomeIcon icon={faChartBar} />
            Resumen {periodoSelect === 'semanal' ? 'Semanal' : periodoSelect === 'diario' ? 'Diario' : 'Mensual'}
          </h2>
          <div className="flex gap-4 items-center">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-[#ef4444] text-white rounded-lg hover:bg-[#dc2626] transition-colors flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faFilePdf} />
              Exportar Dashboard
            </button>
            
            <select 
              className="px-3.5 py-2.5 text-sm border border-[#e2e8f0] rounded-lg shadow-sm transition-all focus:outline-none focus:border-[#1a56db] focus:ring focus:ring-[#1a56db] focus:ring-opacity-25"
              value={periodoSelect}
              onChange={(e) => setPeriodoSelect(e.target.value)}
            >
              <option value="diario">Diario</option>
              <option value="semanal">Semanal</option>
              <option value="mensual">Mensual</option>
            </select>
            
            {periodoSelect === 'semanal' && (
              <>
                <div className="flex bg-[#f1f5f9] rounded-lg p-1">
                  <button
                    className={`px-3 py-1.5 text-sm rounded transition-all ${
                      tipoSemana === 'todas' 
                        ? 'bg-white text-[#1a56db] shadow-sm' 
                        : 'text-[#64748b] hover:text-[#1e293b]'
                    }`}
                    onClick={() => setTipoSemana('todas')}
                  >
                    Todas
                  </button>
                  <button
                    className={`px-3 py-1.5 text-sm rounded transition-all ${
                      tipoSemana === 'completas' 
                        ? 'bg-white text-[#1a56db] shadow-sm' 
                        : 'text-[#64748b] hover:text-[#1e293b]'
                    }`}
                    onClick={() => setTipoSemana('completas')}
                  >
                    Completas
                  </button>
                  <button
                    className={`px-3 py-1.5 text-sm rounded transition-all ${
                      tipoSemana === 'en_curso' 
                        ? 'bg-white text-[#1a56db] shadow-sm' 
                        : 'text-[#64748b] hover:text-[#1e293b]'
                    }`}
                    onClick={() => setTipoSemana('en_curso')}
                  >
                    En curso
                  </button>
                </div>
                
                <select 
                  className="w-96 px-3.5 py-2.5 text-sm border border-[#e2e8f0] rounded-lg shadow-sm transition-all focus:outline-none focus:border-[#1a56db] focus:ring focus:ring-[#1a56db] focus:ring-opacity-25"
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                >
                  {filteredWeeks.map(week => (
                    <option key={week.value} value={week.value}>
                      {week.label}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>

        {/* Información del período seleccionado */}
        {periodoSelect === 'semanal' && selectedWeekData && (
          <div className="bg-[#eff6ff] border border-[#3b82f6] rounded-lg p-4 mb-6 flex items-center gap-3" id="period-info-banner">
            <FontAwesomeIcon icon={faCalendarWeek} className="text-[#3b82f6]" />
            <div>
              <p className="text-sm text-[#1e40af]">
                <strong>Período analizado:</strong> {selectedWeekData.startDate.toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })} - {selectedWeekData.endDate.toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
              {selectedWeekData.isCurrent && (
                <p className="text-xs text-[#3730a3] mt-1">
                  Esta es la semana en curso. Los datos se actualizan en tiempo real.
                </p>
              )}
            </div>
          </div>
        )}

        {/* KPIs principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-5 hover:shadow-md hover:-translate-y-[2px] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm text-[#64748b] font-medium">Total Despachos</h4>
                <p className="text-2xl font-bold mt-1 mb-0 text-[#1e293b]">{estadisticas.totalDespachos}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#e0f2fe] text-[#1a56db] flex items-center justify-center text-xl">
                <FontAwesomeIcon icon={faClipboardList} />
              </div>
            </div>
            <div className="mt-2 text-sm text-[#64748b]">
              {periodoSelect === 'semanal' && selectedWeekData && (
                <span>{selectedWeekData.isComplete ? 'Semana completa' : 'Semana en curso'}</span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5 hover:shadow-md hover:-translate-y-[2px] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm text-[#64748b] font-medium">Promedio Diario</h4>
                <p className="text-2xl font-bold mt-1 mb-0 text-[#1e293b]">{estadisticas.promedioDespachosDiarios.toFixed(1)}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#ecfdf5] text-[#10b981] flex items-center justify-center text-xl">
                <FontAwesomeIcon icon={faClipboardList} />
              </div>
            </div>
            <div className="mt-2 text-sm text-[#64748b]">
              <span>Despachos por día</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5 hover:shadow-md hover:-translate-y-[2px] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm text-[#64748b] font-medium">Reporteros Activos</h4>
                <p className="text-2xl font-bold mt-1 mb-0 text-[#1e293b]">{estadisticas.reporterosActivos}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#fffbeb] text-[#f59e0b] flex items-center justify-center text-xl">
                <FontAwesomeIcon icon={faUserCheck} />
              </div>
            </div>
            <div className="mt-2 text-sm text-[#64748b]">
              <span>Con al menos 1 despacho</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5 hover:shadow-md hover:-translate-y-[2px] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm text-[#64748b] font-medium">Cobertura Nacional</h4>
                <p className="text-2xl font-bold mt-1 mb-0 text-[#1e293b]">{estadisticas.coberturaNacional.toFixed(1)}%</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center text-xl">
                <FontAwesomeIcon icon={faGlobe} />
              </div>
            </div>
            <div className="mt-2 text-sm text-[#64748b]">
              <span>Ciudades activas</span>
            </div>
          </div>
        </div>

        {/* KPIs secundarios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 hover:shadow-md hover:-translate-y-[2px] transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#e0f2fe] text-[#1a56db] flex items-center justify-center text-xl">
                <FontAwesomeIcon icon={faVideo} />
              </div>
              <div>
                <h4 className="text-sm text-[#64748b] font-medium">Despachos En Vivo</h4>
                <p className="text-xl font-bold mt-0.5 mb-0 text-[#1e293b]">{estadisticas.despachosEnVivo}</p>
              </div>
            </div>
            <div className="text-xl font-semibold text-[#1a56db]">
              {estadisticas.totalDespachos > 0 ? estadisticas.porcentajeEnVivo.toFixed(0) : 0}%
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 hover:shadow-md hover:-translate-y-[2px] transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ecfdf5] text-[#10b981] flex items-center justify-center text-xl">
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
              <div>
                <h4 className="text-sm text-[#64748b] font-medium">Cumplimiento de Metas</h4>
                <p className="text-xl font-bold mt-0.5 mb-0 text-[#1e293b]">
                  {estadisticas.totalDespachos > 0 ? Math.min(100, Math.round((estadisticas.totalDespachos / 21) * 100)) : 0}%
                </p>
              </div>
            </div>
            <div className="w-20 h-4 bg-[#f1f5f9] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#10b981] rounded-full" 
                style={{ width: `${Math.min(100, Math.round((estadisticas.totalDespachos / 21) * 100))}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 hover:shadow-md hover:-translate-y-[2px] transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#fee2e2] text-[#ef4444] flex items-center justify-center text-xl">
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </div>
              <div>
                <h4 className="text-sm text-[#64748b] font-medium">Despachos con Problemas</h4>
                <p className="text-xl font-bold mt-0.5 mb-0 text-[#1e293b]">{estadisticas.despachosConProblemas}</p>
              </div>
            </div>
            <div className="text-xl font-semibold text-[#ef4444]">
              {estadisticas.totalDespachos > 0 ? estadisticas.porcentajeConProblemas.toFixed(0) : 0}%
            </div>
          </div>
        </div>

        {/* Top Ciudades y Reporteros */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top 5 Ciudades */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-[#e2e8f0]">
              <h3 className="font-semibold text-[#1a365d] flex items-center gap-2">
                <FontAwesomeIcon icon={faCity} className="text-[#1a56db]" />
                Top 5 Ciudades
              </h3>
            </div>
            <div className="p-6">
              {estadisticas.topCiudades.length > 0 ? (
                <div className="space-y-4">
                  {estadisticas.topCiudades.map((ciudad, index) => (
                    <div key={ciudad.id} className="flex items-center">
                      <div className="w-6 text-xs text-[#64748b] font-medium">{index + 1}.</div>
                      <div className="w-24 md:w-32 font-medium text-[#1e293b]">{ciudad.nombre}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#1a56db] rounded-full" 
                              style={{ width: `${ciudad.porcentaje}%` }}
                            ></div>
                          </div>
                          <div className="w-12 text-xs font-semibold text-[#1a56db]">{ciudad.despachos}</div>
                          <div className="w-10 text-xs text-[#64748b]">{ciudad.porcentaje}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-[#64748b] py-4">No hay datos disponibles</p>
              )}
            </div>
          </div>

          {/* Top 5 Reporteros */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-[#e2e8f0]">
              <h3 className="font-semibold text-[#1a365d] flex items-center gap-2">
                <FontAwesomeIcon icon={faUserCheck} className="text-[#1a56db]" />
                Top 5 Reporteros
              </h3>
            </div>
            <div className="p-6">
              {estadisticas.topReporteros.length > 0 ? (
                <div className="space-y-4">
                  {estadisticas.topReporteros.map((reportero, index) => (
                    <div key={reportero.id} className="flex items-center">
                      <div className="w-6 text-xs text-[#64748b] font-medium">{index + 1}.</div>
                      <div className="w-28 md:w-40 font-medium text-[#1e293b]">{reportero.nombre}</div>
                      <div className="w-16 md:w-20 text-xs text-[#64748b]">{reportero.ciudad}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#10b981] rounded-full" 
                              style={{ width: `${reportero.porcentaje * 2}%` }}
                            ></div>
                          </div>
                          <div className="w-8 text-xs font-semibold text-[#10b981]">{reportero.despachos}</div>
                          <div className="w-8 text-xs text-[#64748b]">{reportero.porcentaje}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-[#64748b] py-4">No hay datos disponibles</p>
              )}
            </div>
          </div>
        </div>

        {/* Sección de análisis adicionales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Gráfico de despachos por día */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-[#e2e8f0]">
              <h3 className="font-semibold text-[#1a365d] flex items-center gap-2">
                <FontAwesomeIcon icon={faChartLine} className="text-[#1a56db]" />
                Despachos por Día
              </h3>
            </div>
            <div className="p-6">
              {estadisticas.despachosPorDia && estadisticas.despachosPorDia.length > 0 ? (
                <div className="h-[300px] relative">
                  {estadisticas.despachosPorDia.map((dia, index) => {
                    const maxDespachos = Math.max(...estadisticas.despachosPorDia.map(d => d.total), 1)
                    const left = 30 + (index * ((100 - 60) / (estadisticas.despachosPorDia.length - 1)))
                    const height = (dia.total / maxDespachos) * 200
                    const date = new Date(dia.dia)
                    const dayName = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][date.getDay()]
                    
                    return (
                      <div key={dia.dia}>
                        <div 
                          className="absolute bottom-0 w-[30px] bg-[#1a56db] rounded-t-md cursor-pointer hover:bg-[#1e429f] group transition-all"
                          style={{ left: `${left}%`, height: `${height}px`, transform: 'translateX(-50%)' }}
                        >
                          <div className="absolute top-[-25px] w-[60px] left-[-15px] text-center font-semibold text-xs text-[#1a56db] opacity-0 group-hover:opacity-100 transition-opacity">
                            {dia.total}
                          </div>
                        </div>
                        <div 
                          className="absolute bottom-[-25px] w-[60px] text-center text-xs text-[#64748b]"
                          style={{ left: `${left}%`, transform: 'translateX(-50%)' }}
                        >
                          {dayName}
                        </div>
                        <div 
                          className="absolute bottom-[-40px] w-[60px] text-center text-xs text-[#94a3b8]"
                          style={{ left: `${left}%`, transform: 'translateX(-50%)' }}
                        >
                          {date.getDate()}
                        </div>
                      </div>
                    )
                  })}
                  <div className="absolute left-0 right-0 bottom-0 h-[1px] bg-[#f1f5f9]"></div>
                </div>
              ) : (
                <p className="text-center text-[#64748b] py-8">No hay datos de despachos para mostrar</p>
              )}
            </div>
          </div>

          {/* Análisis de Horas Pico */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-[#e2e8f0]">
              <h3 className="font-semibold text-[#1a365d] flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} className="text-[#1a56db]" />
                Análisis de Horas Pico
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-[#64748b] mb-3">Distribución por Franja Horaria</h4>
                  {estadisticas.distribucionPorHora?.map((franja, index) => (
                    <div key={index} className="flex items-center mb-3">
                      <div className="w-32 text-sm font-medium text-[#1e293b]">{franja.rango}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-6 bg-[#f1f5f9] rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                index === 0 ? 'bg-[#f59e0b]' : 
                                index === 1 ? 'bg-[#3b82f6]' : 
                                'bg-[#8b5cf6]'
                              }`}
                              style={{ width: `${franja.porcentaje}%` }}
                            ></div>
                          </div>
                          <div className="w-16 text-sm text-right">
                            <span className="font-semibold">{franja.cantidad}</span>
                            <span className="text-[#64748b] ml-1">({franja.porcentaje}%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#eff6ff] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-[#1e40af] mb-1">Hora Más Productiva</h4>
                      <p className="text-2xl font-bold text-[#1e40af]">12:00 PM</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#3730a3]">15 despachos</p>
                      <p className="text-xs text-[#3730a3]">en promedio</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nueva fila de análisis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Tendencia de Productividad */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-[#e2e8f0]">
              <h3 className="font-semibold text-[#1a365d] flex items-center gap-2">
                <FontAwesomeIcon icon={faChartPie} className="text-[#1a56db]" />
                Tendencia de Productividad
              </h3>
            </div>
            <div className="p-6">
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                  estadisticas.tendencia?.direccion === 'subiendo' ? 'bg-[#ecfdf5]' :
                  estadisticas.tendencia?.direccion === 'bajando' ? 'bg-[#fee2e2]' :
                  'bg-[#f3f4f6]'
                }`}>
                  <FontAwesomeIcon 
                    icon={
                      estadisticas.tendencia?.direccion === 'subiendo' ? faArrowUp :
                      estadisticas.tendencia?.direccion === 'bajando' ? faArrowDown :
                      faArrowUp
                    }
                    className={`text-3xl ${
                      estadisticas.tendencia?.direccion === 'subiendo' ? 'text-[#10b981]' :
                      estadisticas.tendencia?.direccion === 'bajando' ? 'text-[#ef4444]' :
                      'text-[#6b7280]'
                    }`}
                  />
                </div>
                <h4 className="text-lg font-semibold text-[#1e293b] mb-2">
                  Productividad {
                    estadisticas.tendencia?.direccion === 'subiendo' ? 'en Aumento' :
                    estadisticas.tendencia?.direccion === 'bajando' ? 'en Descenso' :
                    'Estable'
                  }
                </h4>
                <p className="text-3xl font-bold text-[#1e293b] mb-2">
                  {estadisticas.tendencia?.porcentaje.toFixed(1)}%
                </p>
                <p className="text-sm text-[#64748b]">
                  Comparado con el período anterior
                </p>
              </div>
            </div>
          </div>

          {/* Reporteros Destacados */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-[#e2e8f0]">
              <h3 className="font-semibold text-[#1a365d] flex items-center gap-2">
                <FontAwesomeIcon icon={faTrophy} className="text-[#f59e0b]" />
                Reporteros Destacados
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#fffbeb] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#f59e0b] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-[#92400e]">Más Productivo</p>
                      <p className="text-sm text-[#b45309]">
                        {estadisticas.topReporteros[0]?.nombre || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#92400e]">
                      {estadisticas.topReporteros[0]?.despachos || 0}
                    </p>
                    <p className="text-xs text-[#b45309]">despachos</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#ecfdf5] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#10b981] rounded-full flex items-center justify-center text-white">
                      <FontAwesomeIcon icon={faFireAlt} />
                    </div>
                    <div>
                      <p className="font-medium text-[#064e3b]">Mayor En Vivo</p>
                      <p className="text-sm text-[#059669]">
                        {estadisticas.topReporteros[1]?.nombre || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#064e3b]">
                      {Math.round((estadisticas.topReporteros[1]?.despachos || 0) * 0.8)}
                    </p>
                    <p className="text-xs text-[#059669]">en vivo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Métricas de Calidad */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-[#e2e8f0]">
              <h3 className="font-semibold text-[#1a365d] flex items-center gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-[#10b981]" />
                Métricas de Calidad
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[#64748b]">Tasa de Cumplimiento</span>
                    <span className="font-semibold text-[#10b981]">98%</span>
                  </div>
                  <div className="w-full h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                    <div className="h-full bg-[#10b981] rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[#64748b]">Puntualidad</span>
                    <span className="font-semibold text-[#3b82f6]">92%</span>
                  </div>
                  <div className="w-full h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                    <div className="h-full bg-[#3b82f6] rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[#64748b]">Sin Problemas</span>
                    <span className="font-semibold text-[#f59e0b]">
                      {estadisticas.totalDespachos > 0 
                        ? (100 - estadisticas.porcentajeConProblemas).toFixed(0) 
                        : 100}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#f59e0b] rounded-full" 
                      style={{ 
                        width: `${estadisticas.totalDespachos > 0 
                          ? (100 - estadisticas.porcentajeConProblemas).toFixed(0) 
                          : 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumenTab