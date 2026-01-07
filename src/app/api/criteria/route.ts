import { NextResponse } from 'next/server';

export async function GET() {
  const criteriaData = {
    A: {
      title: 'A. Número de Titulares de Datos Personales',
      type: 'Determinante',
      description: 'Cantidad de titulares únicos en todas las bases de datos (clientes, trabajadores, prospectos, etc.)',
      levels: [
        { level: 'ALTO', description: '≥ 50,000 titulares', color: 'bg-red-500' },
        { level: 'MEDIO', description: '10,000 - 49,999 titulares', color: 'bg-yellow-500' },
        { level: 'BAJO', description: '< 10,000 titulares', color: 'bg-green-500' }
      ]
    },
    B: {
      title: 'B. Sensibilidad y Tipología del Dato',
      type: 'Determinante',
      description: 'Tratamientos individuales sobre datos sensibles (más de 1,000 titulares)',
      levels: [
        { level: 'ALTO', description: 'Más de 5,000 tratamientos individuales', color: 'bg-red-500' },
        { level: 'MEDIO', description: '1,000 - 4,999 tratamientos individuales', color: 'bg-yellow-500' },
        { level: 'BAJO', description: '101 - 999 tratamientos individuales', color: 'bg-green-500' }
      ]
    },
    C: {
      title: 'C. Finalidad del Tratamiento y Riesgo Asociado',
      type: 'Determinante',
      description: 'Finalidad del tratamiento de nivel más alto (más de 20 tratamientos individuales)',
      levels: [
        {
          level: 'ALTO',
          description: 'Decisiones que generan riesgo para vida humana, dignidad, libertad, seguridad física (perfilamiento, scoring, telemarketing, decisiones automatizadas, vigilancia intensiva)',
          color: 'bg-red-500'
        },
        {
          level: 'MEDIO',
          description: 'Gestión administrativa continua, estadísticos con datos seudonimizados, procesos rutinarios, back-office estable',
          color: 'bg-yellow-500'
        },
        {
          level: 'BAJO',
          description: 'Almacenamiento básico, nóminas pequeñas, listados simples, registros puntuales, expedientes aislados',
          color: 'bg-green-500'
        }
      ]
    },
    D: {
      title: 'D. Frecuencia, Duración y Continuidad del Tratamiento',
      type: 'Modulador',
      description: 'Frecuencia de nivel más alto (más de 20 tratamientos individuales)',
      levels: [
        {
          level: 'ALTO',
          description: 'Tratamientos continuos/permanentes/diarios con monitoreo intensivo, sistemas 24/7, registros en tiempo real',
          color: 'bg-red-500'
        },
        {
          level: 'MEDIO',
          description: 'Tratamientos recurrentes (semanal, mensual, trimestral), campañas repetitivas, operaciones programadas',
          color: 'bg-yellow-500'
        },
        {
          level: 'BAJO',
          description: 'Tratamientos puntuales/ocasionales, campañas únicas, encuestas específicas, pilotos de corta duración',
          color: 'bg-green-500'
        }
      ]
    },
    E: {
      title: 'E. Demarcación Territorial del Tratamiento',
      type: 'Modulador',
      description: 'Ubicación de los datos personales y donde son tratados',
      levels: [
        {
          level: 'ALTO',
          description: 'Bancos de datos en servidores fuera del país, servicios en la nube con infraestructura externa, conexiones remotas internacionales',
          color: 'bg-red-500'
        },
        {
          level: 'MEDIO',
          description: 'Bancos de datos en territorio nacional, gestionados internamente con VPN/redes privadas nacionales',
          color: 'bg-yellow-500'
        },
        {
          level: 'BAJO',
          description: 'Gestión local, soportes físicos, servidores nacionales sin exposición a internet ni accesos remotos',
          color: 'bg-green-500'
        }
      ]
    }
  };

  const decisionRules = [
    {
      condition: 'Si por lo menos uno de los criterios determinantes (A, B o C) está en NIVEL ALTO',
      result: 'GRAN VOLUMEN',
      color: 'text-red-600'
    },
    {
      condition: 'Si por lo menos dos de los criterios determinantes (A, B o C) están en NIVEL MEDIO',
      result: 'GRAN VOLUMEN',
      color: 'text-red-600'
    },
    {
      condition: 'Si por lo menos un criterio determinante está en MEDIO Y un modulador (D o E) está en MEDIO o ALTO',
      result: 'GRAN VOLUMEN',
      color: 'text-red-600'
    },
    {
      condition: 'Si los tres criterios determinantes (A, B y C) están simultáneamente en NIVEL BAJO',
      result: 'NO ES GRAN VOLUMEN',
      color: 'text-green-600'
    }
  ];

  return NextResponse.json({
    success: true,
    criteria: criteriaData,
    decisionRules
  });
}
