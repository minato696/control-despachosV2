// app/api/reporteros/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Obtener todos los reporteros
export async function GET() {
  try {
    const reporteros = await prisma.reporteros.findMany({
      include: { ciudad: true },
      orderBy: { nombre: 'asc' }
    });
    
    return NextResponse.json(reporteros);
  } catch (error) {
    console.error('Error al obtener reporteros:', error);
    return NextResponse.json({ error: 'Error al obtener reporteros' }, { status: 500 });
  }
}

// Crear un nuevo reportero
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const reportero = await prisma.reporteros.create({
      data: {
        nombre: data.nombre,
        ciudad: { connect: { id: data.ciudad_id } },
        estado: data.estado || 'activo'
      },
      include: { ciudad: true }
    });
    
    return NextResponse.json(reportero);
  } catch (error) {
    console.error('Error al crear reportero:', error);
    return NextResponse.json({ error: 'Error al crear reportero' }, { status: 500 });
  }
}