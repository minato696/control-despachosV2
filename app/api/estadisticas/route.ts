// app/api/estadisticas/route.ts (con tipos corregidos)
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Despacho {
  id: number;
  reportero_id: number;
  fecha_despacho: Date;
  hora_en_vivo: string | null;
  estado: string;
  reportero: {
    id: number;
    nombre: string;
    ciudad_id: number;
    ciudad: {
      id: number;
      nombre: string;
    };
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const periodo = searchParams.get('periodo') || 'semanal';
    const fechaParam = searchParams.get('fecha');
    const fechaInicioParam = searchParams.get('fechaInicio');
    const fechaFinParam = searchParams.get('fechaFin');
    
    // Calcular fechas para el período
    const hoy = new Date();
    let fechaInicio = new Date();
    let fechaFin = new Date();
    
    if (periodo === 'diario') {
      // Si es diario y se proporciona una fecha específica
      if (fechaParam) {
        fechaInicio = new Date(fechaParam);
        fechaFin = new Date(fechaParam);
        fechaFin.setHours(23, 59, 59, 999);
      } else {
        // Si no se proporciona fecha, usar hoy
        fechaInicio.setHours(0, 0, 0, 0);
        fechaFin = hoy;
      }
    } else if (periodo === 'semanal') {
      // Si se proporcionan fechas de inicio y fin específicas
      if (fechaInicioParam && fechaFinParam) {
        fechaInicio = new Date(fechaInicioParam);
        fechaFin = new Date(fechaFinParam);
        fechaFin.setHours(23, 59, 59, 999);
      } else {
        // Si no, calcular la semana actual (Lunes a Domingo)
        const dia = hoy.getDay() || 7; // 0 es domingo, así que lo convertimos a 7
        fechaInicio.setDate(hoy.getDate() - dia + 1);
        fechaInicio.setHours(0, 0, 0, 0);
        fechaFin = hoy;
      }
    } else if (periodo === 'mensual') {
      fechaInicio.setDate(1);
      fechaInicio.setHours(0, 0, 0, 0);
      fechaFin = hoy;
    }
    
    // Obtener todos los despachos del período
    const despachos = await prisma.despachos.findMany({
      where: {
        fecha_despacho: {
          gte: fechaInicio,
          lte: fechaFin
        }
      },
      include: {
        reportero: {
          include: { ciudad: true }
        }
      }
    }) as Despacho[];
    
    // Calcular estadísticas básicas
    const totalDespachos = despachos.length;
    
    // Calcular días transcurridos en el período
    const diasTranscurridos = Math.max(1, Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    const promedioDespachosDiarios = totalDespachos / diasTranscurridos;
    
    // Reporteros activos (los que tienen al menos un despacho en el período)
    const reporterosIds = [...new Set(despachos.map((d: Despacho) => d.reportero_id))];
    const reporterosActivos = reporterosIds.length;
    
    // Ciudades con despachos
    const ciudadesIds = [...new Set(despachos.map((d: Despacho) => d.reportero.ciudad_id))];
    
    // Total de ciudades en el sistema
    const totalCiudades = await prisma.ciudades.count({
      where: { activo: true }
    });
    
    const coberturaNacional = totalCiudades > 0 ? (ciudadesIds.length / totalCiudades) * 100 : 0;
    
    // Despachos en vivo
    const despachosEnVivo = despachos.filter((d: Despacho) => d.hora_en_vivo && d.hora_en_vivo.trim() !== '').length;
    
    // Despachos con problemas
    const despachosConProblemas = despachos.filter((d: Despacho) => d.estado === 'problema').length;
    
    // Top ciudades
    const ciudadesMap = despachos.reduce((acc: any, despacho: Despacho) => {
      const ciudadId = despacho.reportero.ciudad_id;
      const ciudadNombre = despacho.reportero.ciudad.nombre;
      
      if (!acc[ciudadId]) {
        acc[ciudadId] = { 
          id: ciudadId, 
          nombre: ciudadNombre, 
          despachos: 0 
        };
      }
      
      acc[ciudadId].despachos++;
      return acc;
    }, {});
    
    const topCiudades = Object.values(ciudadesMap)
      .sort((a: any, b: any) => b.despachos - a.despachos)
      .slice(0, 5)
      .map((ciudad: any) => ({
        ...ciudad,
        porcentaje: totalDespachos > 0 ? Math.round((ciudad.despachos / totalDespachos) * 100) : 0
      }));
    
    // Top reporteros
    const reporterosMap = despachos.reduce((acc: any, despacho: Despacho) => {
      const reporteroId = despacho.reportero_id;
      const reporteroNombre = despacho.reportero.nombre;
      const ciudadNombre = despacho.reportero.ciudad.nombre;
      
      if (!acc[reporteroId]) {
        acc[reporteroId] = { 
          id: reporteroId, 
          nombre: reporteroNombre, 
          ciudad: ciudadNombre,
          despachos: 0 
        };
      }
      
      acc[reporteroId].despachos++;
      return acc;
    }, {});
    
    const topReporteros = Object.values(reporterosMap)
      .sort((a: any, b: any) => b.despachos - a.despachos)
      .slice(0, 5)
      .map((reportero: any) => ({
        ...reportero,
        porcentaje: totalDespachos > 0 ? Math.round((reportero.despachos / totalDespachos) * 100) : 0
      }));
    
    // Despachos por día (para los últimos 7 días del período)
    const ultimaSemana = new Date(fechaFin);
    ultimaSemana.setDate(fechaFin.getDate() - 6);
    
    // Crear un mapa con todos los días de la semana inicializados en 0
    const despachosPorDiaMap: { [key: string]: { dia: string, total: number } } = {};
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(ultimaSemana);
      fecha.setDate(ultimaSemana.getDate() + i);
      const fechaStr = fecha.toISOString().split('T')[0];
      despachosPorDiaMap[fechaStr] = { dia: fechaStr, total: 0 };
    }
    
    // Contar despachos por día
    despachos
      .filter((d: Despacho) => new Date(d.fecha_despacho) >= ultimaSemana && new Date(d.fecha_despacho) <= fechaFin)
      .forEach((despacho: Despacho) => {
        const fecha = despacho.fecha_despacho.toISOString().split('T')[0];
        if (despachosPorDiaMap[fecha]) {
          despachosPorDiaMap[fecha].total++;
        }
      });
    
    // Convertir a array y ordenar por fecha
    const despachosPorDia = Object.values(despachosPorDiaMap)
      .sort((a: any, b: any) => new Date(a.dia).getTime() - new Date(b.dia).getTime());
    
    return NextResponse.json({
      totalDespachos,
      promedioDespachosDiarios: parseFloat(promedioDespachosDiarios.toFixed(2)),
      reporterosActivos,
      coberturaNacional: parseFloat(coberturaNacional.toFixed(2)),
      despachosEnVivo,
      porcentajeEnVivo: totalDespachos > 0 ? parseFloat(((despachosEnVivo / totalDespachos) * 100).toFixed(2)) : 0,
      despachosConProblemas,
      porcentajeConProblemas: totalDespachos > 0 ? parseFloat(((despachosConProblemas / totalDespachos) * 100).toFixed(2)) : 0,
      topCiudades,
      topReporteros,
      despachosPorDia,
      periodo: {
        tipo: periodo,
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString()
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 });
  }
}