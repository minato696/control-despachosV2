// components/tabs/ReporterosTab.tsx (actualizado con modal de confirmación)
import { useState, useEffect } from 'react'
import { useAppContext } from '../AppContext'
import { useAuth } from '../AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUsers, faPlus, faSearch, faPencilAlt, 
  faClipboardList, faTrash, faSpinner, faCheck, 
  faExclamationTriangle, faBan
} from '@fortawesome/free-solid-svg-icons'
import { formatCityName } from '../../utils/cityUtils'
import AddReporteroModal from '../modals/AddReporteroModal'
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal'  // Importar el nuevo modal

interface Reportero {
  id: number
  nombre: string
  estado: string
  ciudad: {
    id: number
    codigo: string
    nombre: string
  }
  despachos_count?: number
  ultimo_despacho?: string
}

const ReporterosTab = () => {
  const { setActiveTab, setSelectedCity, setNotification } = useAppContext()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [reporteros, setReporteros] = useState<Reportero[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedReportero, setSelectedReportero] = useState<Reportero | null>(null)
  
  // Estados para el modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [reporteroToDelete, setReporteroToDelete] = useState<Reportero | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Cargar reporteros desde la API
  const loadReporteros = async () => {
    setLoading(true)
    try {
      // Cargar reporteros básicos
      const response = await fetch('/api/reporteros')
      if (!response.ok) {
        throw new Error('Error al obtener reporteros')
      }
      const data = await response.json()

      // Cargar despachos para cada reportero
      const reporterosCompletos = await Promise.all(data.map(async (reportero: Reportero) => {
        try {
          const hoy = new Date()
          // Obtener el primer día de la semana (lunes)
          const inicioSemana = new Date(hoy)
          const diaSemana = hoy.getDay() || 7 // 0 es domingo, 7 es para cálculos
          inicioSemana.setDate(hoy.getDate() - diaSemana + 1)
          inicioSemana.setHours(0, 0, 0, 0)
          
          // Formatear fechas para la API
          const fechaInicio = inicioSemana.toISOString().split('T')[0]
          const fechaFin = hoy.toISOString().split('T')[0]
          
          const despachosResponse = await fetch(`/api/despachos?reportero_id=${reportero.id}&desde=${fechaInicio}&hasta=${fechaFin}`)
          const despachos = await despachosResponse.json()
          
          // Ordenar despachos por fecha más reciente
          const despachosOrdenados = despachos.sort((a: any, b: any) => {
            return new Date(b.fecha_despacho).getTime() - new Date(a.fecha_despacho).getTime()
          })
          
          return {
            ...reportero,
            despachos_count: despachos.length,
            ultimo_despacho: despachosOrdenados.length > 0 
              ? `${new Date(despachosOrdenados[0].fecha_despacho).toLocaleDateString('es-ES')}, ${despachosOrdenados[0].hora_despacho}` 
              : 'Sin despachos'
          }
        } catch (error) {
          console.error(`Error al cargar despachos para reportero ${reportero.id}:`, error)
          return {
            ...reportero,
            despachos_count: 0,
            ultimo_despacho: 'Sin despachos'
          }
        }
      }))
      
      setReporteros(reporterosCompletos)
    } catch (error) {
      console.error('Error al cargar reporteros:', error)
      setNotification({
        show: true,
        type: 'error',
        title: 'Error',
        message: 'No se pudieron cargar los reporteros'
      })
    } finally {
      setLoading(false)
    }
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    loadReporteros()
  }, [])

  // Filtrar reporteros según búsqueda
  const filteredReporteros = reporteros.filter(reportero => 
    reportero.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reportero.ciudad.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Función para ir a la pestaña de registro con el reportero seleccionado
  const handleRegistrarDespachos = (reportero: Reportero) => {
    setSelectedCity(reportero.ciudad.codigo)
    setActiveTab('registro')
  }

  // Función para editar reportero
  const handleEditarReportero = (reportero: Reportero) => {
    setSelectedReportero(reportero)
    setShowAddModal(true)
  }

  // Función para mostrar el modal de confirmación de eliminación
  const handleShowDeleteConfirmation = (reportero: Reportero) => {
    setReporteroToDelete(reportero)
    setShowDeleteModal(true)
  }

  // Función para eliminar reportero
  const handleConfirmDelete = async () => {
    if (!reporteroToDelete) return
    
    try {
      setIsDeleting(true)
      
      const response = await fetch(`/api/reporteros/${reporteroToDelete.id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar reportero')
      }
      
      // Actualizar la lista de reporteros
      setReporteros(prevReporteros => prevReporteros.filter(r => r.id !== reporteroToDelete.id))
      
      setNotification({
        show: true,
        type: 'success',
        title: 'Reportero eliminado',
        message: data.message || `El reportero ${reporteroToDelete.nombre} ha sido eliminado correctamente`
      })
      
      // Cerrar el modal
      setShowDeleteModal(false)
      setReporteroToDelete(null)
    } catch (error) {
      console.error('Error al eliminar reportero:', error)
      
      setNotification({
        show: true,
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'No se pudo eliminar el reportero'
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Función para obtener la clase de estado
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'activo':
        return 'bg-[#ecfdf5] text-[#10b981]';
      case 'ausente':
        return 'bg-[#fffbeb] text-[#f59e0b]';
      case 'inactivo':
        return 'bg-[#fee2e2] text-[#ef4444]';
      default:
        return 'bg-[#eff6ff] text-[#3b82f6]';
    }
  }

  // Función para renderizar el estado con icono
  const renderEstado = (estado: string) => {
    let icon;
    switch (estado) {
      case 'activo':
        icon = faCheck;
        break;
      case 'ausente':
        icon = faExclamationTriangle;
        break;
      case 'inactivo':
        icon = faBan;
        break;
      default:
        icon = faCheck;
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusClass(estado)}`}>
        <FontAwesomeIcon icon={icon} className="mr-1" />
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-primary mr-3" />
        <span className="text-lg">Cargando reporteros...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#1a365d] flex items-center gap-3">
          <FontAwesomeIcon icon={faUsers} />
          Todos los Reporteros
          <span className="ml-2 text-sm bg-[#e0f2fe] text-[#1a56db] px-2 py-1 rounded-full">
            {reporteros.length} reporteros
          </span>
        </h2>
        {user && user.rol === 'admin' && (
          <button 
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[#1a56db] text-white rounded-lg shadow-sm hover:bg-[#1e429f] transition-colors"
            onClick={() => {
              setSelectedReportero(null)
              setShowAddModal(true)
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
            Agregar Reportero
          </button>
        )}
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <FontAwesomeIcon icon={faSearch} className="text-[#64748b]" />
        </div>
        <input 
          type="text" 
          className="w-full pl-12 pr-4 py-3 text-sm border border-[#e2e8f0] rounded-lg shadow-sm transition-all focus:outline-none focus:border-[#1a56db] focus:ring focus:ring-[#1a56db] focus:ring-opacity-25"
          placeholder="Buscar reportero por nombre o ciudad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-3.5 px-4 bg-[#f1f5f9] font-semibold text-[#475569] border-b border-[#e2e8f0]">Nombre</th>
              <th className="text-left py-3.5 px-4 bg-[#f1f5f9] font-semibold text-[#475569] border-b border-[#e2e8f0]">Ciudad</th>
              <th className="text-left py-3.5 px-4 bg-[#f1f5f9] font-semibold text-[#475569] border-b border-[#e2e8f0]">Despachos esta semana</th>
              <th className="text-left py-3.5 px-4 bg-[#f1f5f9] font-semibold text-[#475569] border-b border-[#e2e8f0]">Último despacho</th>
              <th className="text-left py-3.5 px-4 bg-[#f1f5f9] font-semibold text-[#475569] border-b border-[#e2e8f0]">Estado</th>
              <th className="text-left py-3.5 px-4 bg-[#f1f5f9] font-semibold text-[#475569] border-b border-[#e2e8f0]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredReporteros.map(reportero => (
              <tr key={reportero.id} className="hover:bg-[#f1f5f9]">
                <td className="py-3 px-4 border-b border-[#e2e8f0] text-[#1e293b] font-medium">{reportero.nombre}</td>
                <td className="py-3 px-4 border-b border-[#e2e8f0] text-[#1e293b]">{reportero.ciudad.nombre}</td>
                <td className="py-3 px-4 border-b border-[#e2e8f0] text-[#1e293b] text-center">{reportero.despachos_count || 0}</td>
                <td className="py-3 px-4 border-b border-[#e2e8f0] text-[#1e293b]">{reportero.ultimo_despacho || 'Sin despachos'}</td>
                <td className="py-3 px-4 border-b border-[#e2e8f0]">
                  {renderEstado(reportero.estado)}
                </td>
                <td className="py-3 px-4 border-b border-[#e2e8f0]">
                  <div className="flex gap-2">
                    {user && user.rol === 'admin' && (
                      <>
                        <button 
                          className="w-8 h-8 flex items-center justify-center rounded-full text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#1a56db] transition-colors"
                          onClick={() => handleEditarReportero(reportero)}
                          title="Editar reportero"
                        >
                          <FontAwesomeIcon icon={faPencilAlt} />
                        </button>
                        <button 
                          className="w-8 h-8 flex items-center justify-center rounded-full text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#ef4444] transition-colors"
                          onClick={() => handleShowDeleteConfirmation(reportero)}
                          title="Eliminar reportero"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </>
                    )}
                    <button 
                      className="w-8 h-8 flex items-center justify-center rounded-full text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#1a56db] transition-colors"
                      onClick={() => handleRegistrarDespachos(reportero)}
                      title="Registrar despachos"
                    >
                      <FontAwesomeIcon icon={faClipboardList} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredReporteros.length === 0 && (
        <div className="text-center p-8 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] text-[#64748b] mt-6">
          <p>No se encontraron reporteros con ese término de búsqueda.</p>
        </div>
      )}
      
      {/* Modal para agregar/editar reportero */}
      <AddReporteroModal 
        show={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        reportero={selectedReportero}
        onSuccess={() => {
          loadReporteros();
          setShowAddModal(false);
        }}
      />
      
      {/* Modal de confirmación para eliminar reportero */}
      <ConfirmDeleteModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setReporteroToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        nombreReportero={reporteroToDelete?.nombre || ''}
        isDeleting={isDeleting}
      />
    </div>
  )
}

export default ReporterosTab