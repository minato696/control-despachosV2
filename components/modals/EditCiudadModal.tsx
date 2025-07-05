// components/modals/EditCiudadModal.tsx
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCity, faTimes, faSpinner, faSave } from '@fortawesome/free-solid-svg-icons'
import { useAppContext } from '../AppContext'

interface EditCiudadModalProps {
  show: boolean
  onClose: () => void
  ciudad: {
    id: number
    codigo: string
    nombre: string
    activo: boolean
  } | null
  onSuccess?: () => void
}

const EditCiudadModal: React.FC<EditCiudadModalProps> = ({ 
  show, 
  onClose,
  ciudad,
  onSuccess
}) => {
  const { setNotification } = useAppContext()
  
  const [nombre, setNombre] = useState('')
  const [activo, setActivo] = useState(true)
  const [loading, setLoading] = useState(false)

  // Cargar datos de la ciudad cuando se abre el modal
  useEffect(() => {
    if (ciudad && show) {
      setNombre(ciudad.nombre)
      setActivo(ciudad.activo)
    }
  }, [ciudad, show])

  // Validar y guardar cambios
  const handleSubmit = async () => {
    // Validaciones básicas
    if (!nombre.trim()) {
      setNotification({
        show: true,
        type: 'error',
        title: 'Error',
        message: 'El nombre de la ciudad es obligatorio'
      })
      return
    }
    
    setLoading(true)
    
    try {
      // Actualizar la ciudad
      const response = await fetch(`/api/ciudades/${ciudad?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          codigo: ciudad?.codigo, // El código no se puede cambiar
          nombre,
          activo
        })
      })
      
      if (!response.ok) {
        throw new Error('Error al actualizar ciudad')
      }
      
      // Mostrar notificación de éxito
      setNotification({
        show: true,
        type: 'success',
        title: 'Ciudad actualizada',
        message: `La ciudad ${nombre} ha sido actualizada correctamente`
      })
      
      // Cerrar modal
      onClose()
      
      // Callback de éxito
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error al actualizar ciudad:', error)
      setNotification({
        show: true,
        type: 'error',
        title: 'Error',
        message: 'No se pudo actualizar la ciudad'
      })
    } finally {
      setLoading(false)
    }
  }

  if (!show || !ciudad) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md transform transition-transform duration-300">
        <div className="flex justify-between items-center px-5 py-4 border-b border-[#e2e8f0]">
          <h3 className="text-lg font-semibold text-[#1a365d] flex items-center gap-2">
            <FontAwesomeIcon icon={faCity} />
            Editar Ciudad
          </h3>
          <button 
            className="text-[#64748b] hover:text-[#1e293b] transition-colors text-xl"
            onClick={onClose}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="p-6">
          <div className="mb-5">
            <label htmlFor="ciudad-codigo" className="block mb-2 text-sm font-medium text-[#475569]">
              Código de la Ciudad:
            </label>
            <input
              type="text"
              id="ciudad-codigo"
              className="w-full px-3.5 py-2.5 text-sm border border-[#e2e8f0] rounded-lg shadow-sm bg-[#f1f5f9] cursor-not-allowed"
              value={ciudad.codigo}
              disabled
            />
            <p className="text-xs text-[#64748b] mt-1">El código no se puede modificar</p>
          </div>
          
          <div className="mb-5">
            <label htmlFor="ciudad-nombre" className="block mb-2 text-sm font-medium text-[#475569]">
              Nombre de la Ciudad:
            </label>
            <input
              type="text"
              id="ciudad-nombre"
              className="w-full px-3.5 py-2.5 text-sm border border-[#e2e8f0] rounded-lg shadow-sm focus:outline-none focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db] focus:ring-opacity-20"
              placeholder="Ejemplo: Arequipa, Cusco, etc."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="mb-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-[#1a56db] bg-gray-100 border-gray-300 rounded focus:ring-[#1a56db]"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
                disabled={loading}
              />
              <span className="text-sm font-medium text-[#475569]">
                Ciudad activa
              </span>
            </label>
            <p className="text-xs text-[#64748b] mt-1 ml-7">
              Las ciudades inactivas no aparecerán en los selectores
            </p>
          </div>
        </div>
        <div className="flex justify-end p-5 gap-3 border-t border-[#e2e8f0]">
          <button
            className="px-4 py-2.5 bg-white text-[#1e293b] border border-[#e2e8f0] rounded-lg hover:bg-[#f1f5f9] transition-colors"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2.5 bg-[#1a56db] text-white rounded-lg hover:bg-[#1e429f] transition-colors flex items-center gap-2"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                Guardando...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditCiudadModal