import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      criterionA,
      criterionB,
      criterionC,
      criterionD,
      criterionE
    } = body;

    const determinants = [criterionA, criterionB, criterionC];
    const modulators = [criterionD, criterionE];

    let isLargeVolume = false;
    let appliedRule = '';

    // Regla 1: Si por lo menos uno de los criterios determinantes está en NIVEL ALTO
    if (determinants.includes('ALTO')) {
      isLargeVolume = true;
      appliedRule = 'Regla 1: Al menos un criterio determinante en ALTO';
    }
    // Regla 2: Si por lo menos dos de los criterios determinantes están en NIVEL MEDIO
    else if (determinants.filter(d => d === 'MEDIO').length >= 2) {
      isLargeVolume = true;
      appliedRule = 'Regla 2: Dos o más criterios determinantes en MEDIO';
    }
    // Regla 3: Si por lo menos un criterio determinante está en MEDIO Y un modulador en MEDIO o ALTO
    else if (determinants.includes('MEDIO') && (modulators.includes('MEDIO') || modulators.includes('ALTO'))) {
      isLargeVolume = true;
      appliedRule = 'Regla 3: Un determinante en MEDIO y un modulador en MEDIO o ALTO';
    }
    // Regla 4: Si los tres criterios determinantes están en NIVEL BAJO
    else if (determinants.every(d => d === 'BAJO')) {
      isLargeVolume = false;
      appliedRule = 'Regla 4: Todos los criterios determinantes en BAJO';
    }
    // Por defecto, si no cae en ninguna de las reglas anteriores, consideramos gran volumen
    else {
      isLargeVolume = true;
      appliedRule = 'Evaluación por defecto: Se requiere ODP';
    }

    return NextResponse.json({
      success: true,
      isLargeVolume,
      appliedRule,
      criteria: {
        A: criterionA,
        B: criterionB,
        C: criterionC,
        D: criterionD,
        E: criterionE
      },
      message: isLargeVolume
        ? 'Su tratamiento de datos personales califica como de grandes volúmenes. Debe designar un Oficial de Datos Personales.'
        : 'Su tratamiento de datos personales no califica como de grandes volúmenes de datos.'
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Error al procesar la evaluación',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 400 }
    );
  }
}
