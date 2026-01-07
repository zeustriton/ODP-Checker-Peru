'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Shield, Users, Database, AlertTriangle, Clock, Globe, FileText, CheckCircle, ExternalLink, Award, BookOpen, Building2, Scale, Lock, Eye, FileCheck, MessageSquare, RefreshCw, Search, GraduationCap, Briefcase, CheckSquare, AlertOctagon, Gavel, Building, UserCheck, ChevronRight, Info, BarChart } from 'lucide-react';

export default function ODPPDirectivePage() {
  const [evaluationResults, setEvaluationResults] = useState({
    criterionA: null as string | null,
    criterionB: null as string | null,
    criterionC: null as string | null,
    criterionD: null as string | null,
    criterionE: null as string | null
  });
  const [hasEvaluated, setHasEvaluated] = useState(false);

  const criteriaData = {
    A: {
      title: 'A. Número de Titulares de Datos Personales',
      type: 'Determinante',
      icon: Users,
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
      icon: Database,
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
      icon: AlertTriangle,
      description: 'Finalidad del tratamiento de nivel más alto (más de 20 tratamientos individuales)',
      levels: [
        { level: 'ALTO', description: 'Decisiones que generan riesgo para vida humana, dignidad, libertad, seguridad física (perfilamiento, scoring, telemarketing, decisiones automatizadas, vigilancia intensiva)', color: 'bg-red-500' },
        { level: 'MEDIO', description: 'Gestión administrativa continua, estadísticos con datos seudonimizados, procesos rutinarios, back-office estable', color: 'bg-yellow-500' },
        { level: 'BAJO', description: 'Almacenamiento básico, nóminas pequeñas, listados simples, registros puntuales, expedientes aislados', color: 'bg-green-500' }
      ]
    },
    D: {
      title: 'D. Frecuencia, Duración y Continuidad del Tratamiento',
      type: 'Modulador',
      icon: Clock,
      description: 'Frecuencia de nivel más alto (más de 20 tratamientos individuales)',
      levels: [
        { level: 'ALTO', description: 'Tratamientos continuos/permanentes/diarios con monitoreo intensivo, sistemas 24/7, registros en tiempo real', color: 'bg-red-500' },
        { level: 'MEDIO', description: 'Tratamientos recurrentes (semanal, mensual, trimestral), campañas repetitivas, operaciones programadas', color: 'bg-yellow-500' },
        { level: 'BAJO', description: 'Tratamientos puntuales/ocasionales, campañas únicas, encuestas específicas, pilotos de corta duración', color: 'bg-green-500' }
      ]
    },
    E: {
      title: 'E. Demarcación Territorial del Tratamiento',
      type: 'Modulador',
      icon: Globe,
      description: 'Ubicación de los datos personales y donde son tratados',
      levels: [
        { level: 'ALTO', description: 'Bancos de datos en servidores fuera del país, servicios en la nube con infraestructura externa, conexiones remotas internacionales', color: 'bg-red-500' },
        { level: 'MEDIO', description: 'Bancos de datos en territorio nacional, gestionados internamente con VPN/redes privadas nacionales', color: 'bg-yellow-500' },
        { level: 'BAJO', description: 'Gestión local, soportes físicos, servidores nacionales sin exposición a internet ni accesos remotos', color: 'bg-green-500' }
      ]
    }
  };

  const evaluateLargeVolume = () => {
    const { criterionA, criterionB, criterionC, criterionD, criterionE } = evaluationResults;

    // Verificar que todos los criterios estén seleccionados
    if (!criterionA || !criterionB || !criterionC || !criterionD || !criterionE) {
      return null;
    }

    const determinants = [criterionA, criterionB, criterionC];
    const modulators = [criterionD, criterionE];

    let isLargeVolume = false;
    let appliedRule = '';

    // Regla 1: Si por lo menos uno de los criterios determinantes está en NIVEL ALTO
    if (determinants.includes('ALTO')) {
      isLargeVolume = true;
      appliedRule = 'Regla 1: Al menos un criterio determinante (A, B o C) está en NIVEL ALTO';
    }
    // Regla 2: Si por lo menos dos de los criterios determinantes están en NIVEL MEDIO
    else if (determinants.filter(d => d === 'MEDIO').length >= 2) {
      isLargeVolume = true;
      appliedRule = 'Regla 2: Dos o más criterios determinantes (A, B o C) están en NIVEL MEDIO';
    }
    // Regla 3: Si por lo menos un criterio determinante está en MEDIO Y un modulador en MEDIO o ALTO
    else if (determinants.includes('MEDIO') && (modulators.includes('MEDIO') || modulators.includes('ALTO'))) {
      isLargeVolume = true;
      appliedRule = 'Regla 3: Un criterio determinante en MEDIO y un modulador (D o E) en MEDIO o ALTO';
    }
    // Regla 4: Si los tres criterios determinantes están en NIVEL BAJO
    else if (determinants.every(d => d === 'BAJO')) {
      isLargeVolume = false;
      appliedRule = 'Regla 4: Los tres criterios determinantes (A, B y C) están simultáneamente en NIVEL BAJO';
    }
    // Por defecto
    else {
      isLargeVolume = true;
      appliedRule = 'Evaluación por defecto: Se requiere ODP';
    }

    return { isLargeVolume, appliedRule };
  };

  const handleEvaluate = () => {
    setHasEvaluated(true);
  };

  const handleReset = () => {
    setEvaluationResults({
      criterionA: null,
      criterionB: null,
      criterionC: null,
      criterionD: null,
      criterionE: null
    });
    setHasEvaluated(false);
  };

  const allCriteriaSelected = Object.values(evaluationResults).every(v => v !== null);
  const evaluationResult = hasEvaluated ? evaluateLargeVolume() : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-12 h-12" />
            <Badge variant="secondary" className="text-lg bg-white/20 text-white hover:bg-white/30">
              Resolución Directoral: N° 100-2025-JUS/DGTAIPD - Directiva M6.DGTAIPD.DI.001
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ODP Checker - Perú - Oficial de Datos Personales
          </h1>
          <p className="text-xl text-blue-100 mb-6 max-w-3xl">
            Guía Interactiva para la Designación, Desempeño y Funciones del Oficial de Datos Personales
            conforme al Reglamento de la Ley de Protección de Datos Personales (Ley N° 29733)
          </p>
          <div className="flex flex-wrap gap-4">
            <Badge className="bg-blue-800 text-white border-blue-600">
              Resolución Directoral N° 100-2025-JUS/DGTAIPD
            </Badge>
            <Badge className="bg-blue-800 text-white border-blue-600">
              Decreto Supremo N° 016-2024-JUS
            </Badge>
          </div>
          <div className="mt-6">
            <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-100 to-blue-200 bg-clip-text text-transparent">
              Roberto (Kepler Blacklock) Puyó Valladares
            </p>
            <p className="text-lg text-blue-200 font-semibold">
              Chair, AAAI Chapter of Perú | AI Strategy & Governance Leader (ISO 42001) | Executive CISO & Tech Advisor | Digital Transformation
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <Tabs defaultValue="anexo1" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-blue-100">
            <TabsTrigger value="anexo1" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white">
              <Shield className="w-4 h-4 mr-2" />
              Anexo 1
            </TabsTrigger>
            <TabsTrigger value="evaluador" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white">
              <CheckCircle className="w-4 h-4 mr-2" />
              Evaluador
            </TabsTrigger>
            <TabsTrigger value="requisitos" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white">
              <Award className="w-4 h-4 mr-2" />
              Requisitos ODP
            </TabsTrigger>
            <TabsTrigger value="funciones" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Funciones
            </TabsTrigger>
          </TabsList>

          <TabsContent value="anexo1" className="mt-8">
            <div className="space-y-6">
              <Card className="border-blue-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <BookOpen className="w-6 h-6" />
                    ANEXO N° 01: Criterios de Evaluación
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Criterios para la designación del ODP por grandes volúmenes de datos personales
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                      <h4 className="font-bold text-red-700 mb-2">Criterios Determinantes</h4>
                      <p className="text-sm text-red-600">
                        Representan la magnitud del riesgo de tratamiento (A, B, C)
                      </p>
                    </div>
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                      <h4 className="font-bold text-yellow-700 mb-2">Criterios Moduladores</h4>
                      <p className="text-sm text-yellow-600">
                        Complementan la evaluación pero no determinan por sí solos (D, E)
                      </p>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {Object.entries(criteriaData).map(([key, criterion]) => {
                      const Icon = criterion.icon;
                      return (
                        <AccordionItem key={key} value={`item-${key}`} className="border border-blue-200 rounded-lg overflow-hidden">
                          <AccordionTrigger className="hover:bg-blue-50 px-4 py-4">
                            <div className="flex items-center gap-3 w-full">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Icon className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="text-left flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className={`${criterion.type === 'Determinante' ? 'bg-red-500' : 'bg-yellow-500'} text-white`}>
                                    {criterion.type}
                                  </Badge>
                                  <h3 className="font-bold text-lg">{criterion.title}</h3>
                                </div>
                                <p className="text-sm text-gray-600">{criterion.description}</p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4 bg-gray-50">
                            <div className="space-y-3 mt-4">
                              {criterion.levels.map((level, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                                  <div className={`w-3 h-3 rounded-full mt-1.5 ${level.color} flex-shrink-0`}></div>
                                  <div>
                                    <Badge className={`${level.color} text-white mb-1`}>{level.level}</Badge>
                                    <p className="text-sm text-gray-700">{level.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </CardContent>
              </Card>

              <Card className="border-blue-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-900 text-white">
                  <CardTitle className="text-xl">Reglas de Decisión para Gran Volumen</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {[
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
                    ].map((rule, idx) => (
                      <div key={idx} className={`p-4 rounded-lg border-2 ${rule.color === 'text-red-600' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${rule.color === 'text-red-600' ? 'bg-red-500' : 'bg-green-500'}`}>
                            <AlertTriangle className={`w-4 h-4 text-white`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm mb-1 text-gray-700">{rule.condition}</p>
                            <Badge className={`${rule.color === 'text-red-600' ? 'bg-red-600' : 'bg-green-600'} text-white font-bold`}>
                              {rule.result}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="evaluador" className="mt-8">
            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  Evaluador Interactivo de Grandes Volúmenes de Datos
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Determine si su entidad requiere designar un Oficial de Datos Personales
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 pb-6">
                {/* Barra de Progreso Visual */}
                <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-600 rounded-lg shadow-md">
                        <BarChart className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-blue-900 text-lg">Progreso de Evaluación</h4>
                        <p className="text-blue-700 text-sm">Seleccione el nivel para cada criterio</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-800">
                          {Object.values(evaluationResults).filter(v => v !== null).length}
                        </div>
                        <div className="text-sm text-blue-600 font-medium">de 5</div>
                      </div>
                      <div className="w-24">
                        <div className="bg-white rounded-full h-4 overflow-hidden border-2 border-blue-200">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                            style={{ width: `${(Object.values(evaluationResults).filter(v => v !== null).length / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold ${allCriteriaSelected ? 'text-green-700' : 'text-blue-700'}`}>
                      {allCriteriaSelected ? '✓ Todos los criterios seleccionados' : '⏳ Seleccione los 5 criterios para evaluar'}
                    </span>
                  </div>
                </div>

                {/* Grid de Criterios */}
                <div className="space-y-6">
                  {Object.entries(criteriaData).map(([key, criterion], criterionIdx) => {
                    const Icon = criterion.icon;
                    const stateKey = `criterion${key}` as keyof typeof evaluationResults;
                    const currentValue = evaluationResults[stateKey];
                    const isComplete = currentValue !== null;
                    
                    console.log(`Criterio ${key} - Estado actual:`, currentValue);
                    
                    return (
                      <div 
                        key={key}
                        className={`group transition-all duration-300 border-2 rounded-xl overflow-hidden ${
                          isComplete 
                            ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-white shadow-lg' 
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                        }`}
                      >
                        {/* Header del Criterio */}
                        <div className={`p-5 ${isComplete ? 'bg-blue-600' : 'bg-gradient-to-r from-blue-600 to-blue-800'} text-white`}>
                          <div className="flex items-center gap-4">
                            <div className={`p-2.5 rounded-xl ${isComplete ? 'bg-white/20' : 'bg-white/10'} transition-colors`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={`${criterion.type === 'Determinante' ? 'bg-red-500' : 'bg-yellow-500'} text-white text-xs font-bold px-2.5 py-1`}>
                                  {criterion.type}
                                </Badge>
                                <h3 className="font-bold text-base md:text-lg leading-tight">{criterion.title}</h3>
                              </div>
                              <p className={`text-xs md:text-sm ${isComplete ? 'text-blue-100' : 'text-blue-200'} leading-relaxed`}>
                                {criterion.description}
                              </p>
                            </div>
                            {isComplete && (
                              <div className="p-2 bg-white rounded-full shadow-md">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Botones de Nivel */}
                        <div className="p-6 bg-white">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {criterion.levels.map((level, levelIdx) => {
                              const isSelected = currentValue === level.level;
                              return (
                                <Button
                                  key={levelIdx}
                                  type="button"
                                  onClick={() => {
                                    console.log('=== CLICK ===');
                                    console.log('Criterio:', key);
                                    console.log('Clave estado:', stateKey);
                                    console.log('Nivel:', level.level);
                                    
                                    setEvaluationResults({
                                      ...evaluationResults,
                                      [stateKey]: level.level
                                    });
                                  }}
                                  className={`
                                    flex-col items-center justify-center
                                    p-5 h-auto min-h-[140px] w-full
                                    transition-all duration-200
                                    ${isSelected 
                                      ? `${level.color} text-white shadow-lg scale-105 ring-4 ring-offset-2 ring-${level.color}` 
                                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md'
                                    }
                                  `}
                                >
                                  <Badge className={`
                                    mb-3 px-4 py-2 text-base font-bold
                                    ${isSelected 
                                      ? 'bg-white/30 text-white' 
                                      : 'bg-gray-200 text-gray-700'
                                    }
                                  `}>
                                    {level.level}
                                  </Badge>
                                  <span className={`
                                    text-xs text-center font-semibold mt-2
                                    ${isSelected ? 'text-white' : 'text-gray-600'}
                                  `}>
                                    {isSelected ? '✓ Seleccionado' : 'Pulse para seleccionar'}
                                  </span>
                                </Button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Tooltip informativo (se muestra al hacer hover en todo el card) */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                          <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="space-y-2">
                              <h5 className="font-semibold text-gray-800 text-sm">Referencia de Niveles:</h5>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                                {criterion.levels.map((level, idx) => (
                                  <div key={idx} className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${level.color} flex-shrink-0`}></div>
                                    <div>
                                      <Badge className={`${level.color} text-white text-xs`}>{level.level}</Badge>
                                      <p className="text-xs text-gray-600 mt-1 leading-snug">{level.description}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Botones de Acción */}
                <div className="sticky bottom-0 bg-white border-t-2 border-blue-200 pt-6 pb-6 mt-6 rounded-xl shadow-lg">
                  <div className="flex gap-4">
                    <Button
                      onClick={handleEvaluate}
                      disabled={!allCriteriaSelected || hasEvaluated}
                      className={`
                        flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                        text-white py-5 text-lg font-semibold min-h-[64px] 
                        transition-all duration-200
                        ${allCriteriaSelected && !hasEvaluated ? 'shadow-lg hover:shadow-xl hover:scale-[1.02]' : 'opacity-60 cursor-not-allowed'}
                      }
                    `}
                    >
                      <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                      <span>{hasEvaluated ? 'Evaluación Completada' : 'Evaluar Designación ODP'}</span>
                    </Button>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className={`
                        px-8 min-h-[64px] text-base font-semibold
                        border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50
                        transition-all duration-200
                      }
                    `}
                    >
                      <RefreshCw className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>Reiniciar</span>
                    </Button>
                  </div>
                </div>

                {/* Resultado de Evaluación */}
                {evaluationResult && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className={`
                      mt-6 p-6 rounded-xl border-2 shadow-xl
                      ${evaluationResult.isLargeVolume 
                        ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-400' 
                        : 'bg-gradient-to-br from-green-50 to-green-100 border-green-400'
                      }
                    `}>
                      <div className="flex items-start gap-4">
                        <div className={`
                          p-4 rounded-full shadow-lg flex-shrink-0
                          ${evaluationResult.isLargeVolume ? 'bg-red-500' : 'bg-green-500'}
                        `}>
                          {evaluationResult.isLargeVolume 
                            ? <AlertTriangle className="w-8 h-8 text-white" />
                            : <CheckCircle className="w-8 h-8 text-white" />
                          }
                        </div>
                        <div className="flex-1">
                          <h3 className={`
                            text-2xl font-bold mb-3
                            ${evaluationResult.isLargeVolume ? 'text-red-800' : 'text-green-800'}
                          `}>
                            {evaluationResult.isLargeVolume 
                              ? '⚠️ REQUIERE OFICIAL DE DATOS PERSONALES'
                              : '✅ NO REQUIERE OFICIAL DE DATOS PERSONALES'
                            }
                          </h3>
                          <p className={`
                            text-base leading-relaxed mb-4
                            ${evaluationResult.isLargeVolume ? 'text-red-700' : 'text-green-700'}
                          `}>
                            {evaluationResult.isLargeVolume
                              ? 'Su tratamiento de datos personales califica como de grandes volúmenes. Debe designar un ODP conforme a la Directiva M6.DGTAIPD.DI.001 y el Decreto Supremo N° 016-2024-JUS.'
                              : 'Su tratamiento de datos personales NO califica como de grandes volúmenes de datos. No es obligatoria la designación de un ODP bajo la normativa vigente.'
                            }
                          </p>
                          <div className={`
                            p-4 rounded-lg border-2
                            ${evaluationResult.isLargeVolume ? 'bg-white border-red-200' : 'bg-white border-green-200'}
                          `}>
                            <div className="flex items-start gap-2">
                              <Gavel className={`w-5 h-5 flex-shrink-0 mt-0.5 ${evaluationResult.isLargeVolume ? 'text-red-600' : 'text-green-600'}`} />
                              <div>
                                <h4 className={`font-bold mb-2 ${evaluationResult.isLargeVolume ? 'text-red-800' : 'text-green-800'}`}>
                                  Regla Aplicada:
                                </h4>
                                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                  {evaluationResult.appliedRule}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Nota Importante */}
                <div className="mt-6 p-5 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-300">
                  <div className="flex items-start gap-3">
                    <AlertOctagon className="w-6 h-6 text-yellow-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-yellow-900 mb-2 text-base">Nota Importante</h4>
                      <p className="text-sm text-yellow-800 leading-relaxed">
                        Esta evaluación es una herramienta de orientación diseñada para ayudarle a entender si su entidad puede requerir la designación de un ODP. 
                        La designación del ODP debe realizarse mediante un acto formal del máximo órgano de administración de la entidad pública, organización o empresa.
                      </p>
                      <p className="text-sm text-yellow-800 leading-relaxed mt-3">
                        <strong>Recomendación:</strong> Consulte la Directiva M6.DGTAIPD.DI.001 completa para entender todas las obligaciones, excepciones y requisitos aplicables, 
                        incluyendo situaciones especiales como actividades principales con datos sensibles y otros casos contemplados en la normativa vigente.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requisitos" className="mt-8">
            <div className="space-y-6">
              <Card className="border-blue-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Award className="w-6 h-6" />
                    Requisitos para la Designación del ODP
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Conforme al Artículo 38 del Reglamento de la Ley N° 29733 y Numeral 7.3 de la Directiva
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Accordion type="single" collapsible className="w-full space-y-4">

                    {/* 7.3.1 */}
                    <AccordionItem value="731" className="border border-blue-200 rounded-lg overflow-hidden">
                      <AccordionTrigger className="hover:bg-blue-50 px-4">
                        <div className="flex items-center gap-3">
                          <CheckSquare className="w-5 h-5 text-blue-600" />
                          <div className="text-left">
                            <Badge className="bg-blue-600 text-white mr-2">7.3.1</Badge>
                            <h3 className="font-bold">Cualidades Profesionales y Conocimientos</h3>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 bg-gray-50">
                        <div className="space-y-3 mt-4">
                          <p className="text-sm text-gray-700">
                            El ODP se designa considerando sus cualidades profesionales y, en particular, sus conocimientos especializados y experiencia práctica en materia de protección de datos personales, debidamente acreditados.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* 7.3.2 - Persona Natural */}
                    <AccordionItem value="732" className="border border-blue-200 rounded-lg overflow-hidden">
                      <AccordionTrigger className="hover:bg-blue-50 px-4">
                        <div className="flex items-center gap-3">
                          <UserCheck className="w-5 h-5 text-blue-600" />
                          <div className="text-left">
                            <Badge className="bg-blue-600 text-white mr-2">7.3.2</Badge>
                            <h3 className="font-bold">Persona Natural y Vinculación con Persona Jurídica</h3>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 bg-gray-50">
                        <div className="space-y-4 mt-4">
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h4 className="font-bold text-blue-700 mb-2">Designación en Persona Natural</h4>
                            <p className="text-sm text-gray-700">
                              La designación siempre recae en una persona natural, lo que no impide que esta se vincule a una persona jurídica a la que pertenece o representa para el cumplimiento de sus funciones.
                            </p>
                          </div>
                          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                              <Building2 className="w-5 h-5" />
                              Posibilidad de Contratación a través de Persona Jurídica
                            </h4>
                            <p className="text-sm text-yellow-700">
                              La entidad puede contratar los servicios de una empresa jurídica especializada, y esta empresa a su vez designará a la persona natural que ejercerá como ODP. Siempre será una persona natural el punto de contacto ante la ANPD.
                            </p>
                          </div>
                          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <h4 className="font-bold text-red-800 mb-2">Restricción</h4>
                            <p className="text-sm text-red-700">
                              No debe encontrarse impedida por configurarse el supuesto previsto en el numeral 7.3.6.2 de la presente directiva (persona jurídica responsable administrativamente por delitos de la Ley N° 30424 o inhabilitada para contratar con el Estado).
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* 7.3.3 - Experiencia Profesional */}
                    <AccordionItem value="733" className="border border-blue-200 rounded-lg overflow-hidden">
                      <AccordionTrigger className="hover:bg-blue-50 px-4">
                        <div className="flex items-center gap-3">
                          <Briefcase className="w-5 h-5 text-blue-600" />
                          <div className="text-left">
                            <Badge className="bg-blue-600 text-white mr-2">7.3.3</Badge>
                            <h3 className="font-bold">Experiencia Profesional</h3>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 bg-gray-50">
                        <div className="space-y-4 mt-4">
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <Badge className="bg-blue-600 text-white mb-2">7.3.3.1</Badge>
                            <h4 className="font-bold text-blue-700 mb-2">Experiencia General</h4>
                            <p className="text-sm text-gray-700 mb-2">No inferior a dos (2) años, desempeñando labores afines a la materia de protección de datos personales de manera continua o acumulada y/o en materias como:</p>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
                              <li>Seguridad y gestión de la información</li>
                              <li>Ciberseguridad</li>
                              <li>Gobierno digital</li>
                              <li>Inteligencia artificial</li>
                              <li>Cualquier otra materia vinculada al tratamiento de datos personales en entidades públicas y/o privadas</li>
                            </ul>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <Badge className="bg-blue-600 text-white mb-2">7.3.3.2</Badge>
                            <h4 className="font-bold text-blue-700 mb-2">Experiencia Específica</h4>
                            <p className="text-sm text-gray-700">
                              No inferior a un (1) año desempeñando labores en materia de protección de datos personales de manera continua o acumulada; la cual se puede acreditar a través de la experiencia profesional pública o privada, puede ser a nivel nacional o internacional.
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* 7.3.4 - Formación Académica y Complementaria */}
                    <AccordionItem value="734" className="border border-blue-200 rounded-lg overflow-hidden">
                      <AccordionTrigger className="hover:bg-blue-50 px-4">
                        <div className="flex items-center gap-3">
                          <GraduationCap className="w-5 h-5 text-blue-600" />
                          <div className="text-left">
                            <Badge className="bg-blue-600 text-white mr-2">7.3.4</Badge>
                            <h3 className="font-bold">Formación Académica y Complementaria</h3>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 bg-gray-50">
                        <div className="space-y-4 mt-4">
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <Badge className="bg-blue-600 text-white mb-2">7.3.4.1</Badge>
                            <h4 className="font-bold text-blue-700 mb-2">Docencia e Investigación</h4>
                            <p className="text-sm text-gray-700">
                              La formación y conocimientos en protección de datos personales se pueden acreditar mediante la experiencia probada y continua en la docencia universitaria o en la investigación sobre temas de protección de datos personales y/o afines.
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <Badge className="bg-blue-600 text-white mb-2">7.3.4.2</Badge>
                            <h4 className="font-bold text-blue-700 mb-2">Formación Académica</h4>
                            <p className="text-sm text-gray-700 mb-3">La formación académica puede ser acreditada de acuerdo a los siguientes requisitos:</p>
                            <ul className="space-y-3 text-sm text-gray-700">
                              <li className="bg-blue-50 p-3 rounded-lg">
                                <strong className="text-blue-800">a) Estudios de Posgrado o Grado Académico:</strong> Concluidos o grado académico afines a la materia de protección de datos personales y/o en materias como seguridad y gestión de la información, ciberseguridad, gobierno digital, inteligencia artificial o cualquier otra materia vinculada al tratamiento de datos personales en entidades públicas y/o privadas.
                              </li>
                              <li className="bg-blue-50 p-3 rounded-lg">
                                <strong className="text-blue-800">b) Certificados y Diplomados:</strong> Certificado de especialización y/o diplomado en protección de datos personales o las materias afines señaladas en el literal precedente, con una duración mínima:
                                <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                                  <li>90 horas lectivas para certificados</li>
                                  <li>120 horas lectivas para diplomados</li>
                                </ul>
                              </li>
                            </ul>
                          </div>
                          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <Badge className="bg-blue-600 text-white mb-2">7.3.4.3</Badge>
                            <h4 className="font-bold text-yellow-800 mb-2">Garantía de Formación de Calidad</h4>
                            <p className="text-sm text-yellow-700">
                              Para garantizar la formación académica, las capacitaciones, certificaciones o diplomados (nacionales o extranjeros) deben ser impartidos por entidades o instituciones formativas que cuenten con reconocido prestigio y trayectoria en protección de datos personales, seguridad de la información, ciberseguridad, gobierno digital, inteligencia artificial o cualquier otra materia afín al tratamiento de datos personales.
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* 7.3.5 - Conocimientos e Independencia */}
                    <AccordionItem value="735" className="border border-blue-200 rounded-lg overflow-hidden">
                      <AccordionTrigger className="hover:bg-blue-50 px-4">
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-blue-600" />
                          <div className="text-left">
                            <Badge className="bg-blue-600 text-white mr-2">7.3.5</Badge>
                            <h3 className="font-bold">Conocimientos e Independencia Funcional</h3>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 bg-gray-50">
                        <div className="space-y-4 mt-4">
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <Badge className="bg-blue-600 text-white mb-2">7.3.5.1</Badge>
                            <h4 className="font-bold text-blue-700 mb-2">Conocimiento del Sector</h4>
                            <p className="text-sm text-gray-700">
                              Constituye un criterio orientativo, el conocimiento del sector en el que se inserta la entidad pública, organización o empresa, las regulaciones aplicables al mismo y las obligaciones derivadas de ellas que incidan, directa o indirectamente, en las operaciones de tratamiento de datos personales.
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <Badge className="bg-blue-600 text-white mb-2">7.3.5.2</Badge>
                            <h4 className="font-bold text-blue-700 mb-2">Conocimiento de Normas Internas</h4>
                            <p className="text-sm text-gray-700">
                              Es indispensable que el ODP conozca las normas internas, directivas, lineamientos, y procedimientos que regulan la gestión institucional de la entidad pública, organización o empresa, en materia de protección de datos personales.
                            </p>
                          </div>
                          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <Badge className="bg-blue-600 text-white mb-2">7.3.5.3 - 7.3.5.4</Badge>
                            <h4 className="font-bold text-yellow-800 mb-2">Independencia Funcional</h4>
                            <ul className="text-sm text-yellow-700 space-y-2 ml-4 list-disc">
                              <li><strong>7.3.5.3:</strong> El ODP ejerce sus funciones con independencia funcional, lo que implica que la entidad pública, organización o empresa, no puede instruirlo o direccionarlo sobre el contenido de sus opiniones, recomendaciones o decisiones técnicas en materia de protección de datos personales.</li>
                              <li><strong>7.3.5.4:</strong> La independencia funcional no modifica la dependencia jerárquica ni la estructura organizacional.</li>
                            </ul>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <Badge className="bg-blue-600 text-white mb-2">7.3.5.5 - 7.3.5.6</Badge>
                            <h4 className="font-bold text-green-800 mb-2">Protección contra Represalias</h4>
                            <ul className="text-sm text-green-700 space-y-2 ml-4 list-disc">
                              <li><strong>7.3.5.5:</strong> El ODP, sea un servidor de la entidad pública, organización o empresa o un tercero, no puede ser sancionado, removido o sufrir cualquier forma de represalia por el contenido de sus informes, opiniones o recomendaciones en materia de protección de datos personales.</li>
                              <li><strong>7.3.5.6:</strong> El ODP reporta funcionalmente a la máxima autoridad de administración de la entidad pública, organización o empresa, garantizando en todo momento su independencia funcional.</li>
                            </ul>
                          </div>
                          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <Badge className="bg-blue-600 text-white mb-2">7.3.5.7</Badge>
                            <h4 className="font-bold text-red-800 mb-2">Responsabilidad del ODP</h4>
                            <p className="text-sm text-red-700">
                              La independencia funcional no excluye la responsabilidad del ODP en casos de dolo, negligencia o incumplimiento de las obligaciones o funciones establecidas en la LPDP, el RLPDP, el Código de Ética de la Función Pública, o contrato de prestación de servicios según corresponda.
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* 7.3.6 - Idoneidad Moral y Ética */}
                    <AccordionItem value="736" className="border border-blue-200 rounded-lg overflow-hidden">
                      <AccordionTrigger className="hover:bg-blue-50 px-4">
                        <div className="flex items-center gap-3">
                          <Scale className="w-5 h-5 text-blue-600" />
                          <div className="text-left">
                            <Badge className="bg-blue-600 text-white mr-2">7.3.6</Badge>
                            <h3 className="font-bold">Idoneidad Moral y Ética</h3>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 bg-gray-50">
                        <div className="space-y-4 mt-4">
                          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <Badge className="bg-red-600 text-white mb-2">7.3.6.1</Badge>
                            <h4 className="font-bold text-red-800 mb-2">Para Personas Naturales</h4>
                            <p className="text-sm text-red-700 mb-3">No es idónea la persona que:</p>
                            <ul className="text-sm text-red-700 space-y-2 ml-4 list-disc">
                              <li>Tenga sentencia condenatoria firme por delito doloso</li>
                              <li>Cuente con sanción y/o inhabilitación vigente a consecuencia de un procedimiento disciplinario u otro análogo</li>
                              <li>Tenga una investigación penal formal o condena por delitos informáticos</li>
                              <li>Haya sido sancionada por faltas éticas vinculadas al tratamiento de información, protección de datos personales, transparencia, confidencialidad o integridad en el ejercicio de la función pública o profesional</li>
                            </ul>
                          </div>
                          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                            <Badge className="bg-orange-600 text-white mb-2">7.3.6.2</Badge>
                            <h4 className="font-bold text-orange-800 mb-2">Para Personas Jurídicas</h4>
                            <p className="text-sm text-orange-700">
                              Si el ODP es asumido por una persona natural contratada a través de una persona jurídica, se debe verificar que dicha persona jurídica:
                            </p>
                            <ul className="text-sm text-orange-700 space-y-2 ml-4 mt-3 list-disc">
                              <li>No haya sido responsable administrativamente por los delitos señalados en el artículo 1 de la Ley N° 30424 (Ley de Prevención y Sanción de Delitos Informáticos)</li>
                              <li>Ni haya sido inhabilitada o suspendida para contratar con el Estado</li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="funciones" className="mt-8">
            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  Funciones del Oficial de Datos Personales
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Conforme al Artículo 39 del Reglamento de la Ley N° 29733 y Numeral 7.4 de la Directiva
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  
                  {/* 7.4.1 - General */}
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <Badge className="bg-blue-600 text-white mb-2">7.4.1</Badge>
                    <h4 className="font-bold text-blue-900 mb-2">Funciones Generales</h4>
                    <p className="text-sm text-blue-800">
                      El ODP desempeña las funciones previstas en la normativa vigente. Las entidades públicas y los actores privados elaboran guías, lineamientos, directrices y/o protocolos internos que expliciten los supuestos bajo los cuales se podrá requerir o solicitar la asistencia del ODP, los cuales también deben servir para regular más exhaustivamente el marco de su actuación en el desempeño de sus funciones.
                    </p>
                  </div>

                  {/* 7.4.2 - Atención a Riesgos */}
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <Badge className="bg-red-600 text-white mb-2">7.4.2</Badge>
                    <h4 className="font-bold text-red-900 mb-2">Atención a Riesgos Asociados</h4>
                    <p className="text-sm text-red-800">
                      El ODP presta especial atención a los riesgos asociados a las operaciones de tratamiento de datos personales, considerando su naturaleza, alcance, contexto y fines. Esta labor coadyuva a la entidad pública, organización o empresa en el asesoramiento para la realización de evaluación de impacto en protección de datos personales, de corresponder.
                    </p>
                  </div>

                  {/* 7.4.3 - Orientación y Propuesta */}
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                    <Badge className="bg-green-600 text-white mb-2">7.4.3</Badge>
                    <h4 className="font-bold text-green-900 mb-2">Orientación y Propuesta</h4>
                    <p className="text-sm text-green-800 mb-2">El ODP orienta y/o propone en lo siguiente:</p>
                    <ul className="text-sm text-green-700 space-y-1 ml-4 list-disc">
                      <li>Definición de la metodología a utilizar</li>
                      <li>Identificación de los ámbitos sujetos a auditoría y revisión</li>
                      <li>Programación de actividades de formación y capacitación</li>
                      <li>Identificación de las operaciones de tratamiento de datos que se lleven a cabo por la entidad pública, empresa u organización</li>
                    </ul>
                  </div>

                  {/* 7.4.4 - Funciones Específicas */}
                  <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                    <Badge className="bg-purple-600 text-white mb-2">7.4.4</Badge>
                    <h4 className="font-bold text-purple-900 mb-2">Funciones Específicas del ODP</h4>
                    <p className="text-sm text-purple-800 mb-3">El ODP, en el desarrollo de sus funciones, según sea el caso, debe:</p>
                    <div className="space-y-3 ml-4">
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <Badge className="bg-purple-600 text-white text-xs mr-2">a)</Badge>
                        <span className="text-sm text-gray-700">
                          Coordinar según corresponda, la realización de programas de capacitación y sensibilización dirigidas al personal de la entidad pública, organización o empresa, en materia de protección de datos personales.
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <Badge className="bg-purple-600 text-white text-xs mr-2">b)</Badge>
                        <span className="text-sm text-gray-700">
                          Gestionar, según corresponda, con la entidad pública, organización o empresa, la conformación de un equipo de apoyo en materia de protección de datos personales, cuando la magnitud de las funciones de supervisión o asesoramiento así lo requieran, a fin de facilitar el cumplimiento eficaz de sus responsabilidades.
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <Badge className="bg-purple-600 text-white text-xs mr-2">c)</Badge>
                        <span className="text-sm text-gray-700">
                          Elaborar informes, opiniones o recomendaciones técnicas o de supervisión, sobre el cumplimiento de la normativa en materia de protección de datos personales dentro de la entidad pública, organización o empresa, cuando se solicite o corresponda, los cuales deben ser puestos en conocimiento de la alta dirección de la entidad pública, directorio o análogo de la organización o empresa.
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <Badge className="bg-purple-600 text-white text-xs mr-2">d)</Badge>
                        <span className="text-sm text-gray-700">
                          Recabar, según corresponda, información de las unidades, oficinas o departamentos pertinentes de la entidad pública, organización o empresa, a fin de verificar el cumplimiento de la normativa aplicable en las actividades de tratamiento de datos personales.
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <Badge className="bg-purple-600 text-white text-xs mr-2">e)</Badge>
                        <span className="text-sm text-gray-700">
                          Revisar la información pertinente y realizar un examen de correspondencia de la información obtenida con los contenidos comprendidos en la LPDP y su Reglamento, o normas y documentos afines.
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <Badge className="bg-purple-600 text-white text-xs mr-2">f)</Badge>
                        <span className="text-sm text-gray-700">
                          Revisar periódicamente las resoluciones, opiniones, guías y demás documentos emitidos por la ANPD, en cuanto resulten relevantes para el cumplimiento eficiente de sus funciones.
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <Badge className="bg-purple-600 text-white text-xs mr-2">g)</Badge>
                        <span className="text-sm text-gray-700">
                          Promover una cultura de protección de datos personales dentro de la entidad pública, organización o empresa.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 7.4.5 - No Transferencia */}
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <Badge className="bg-yellow-600 text-white mb-2">7.4.5</Badge>
                    <h4 className="font-bold text-yellow-900 mb-2">No Transferencia de Responsabilidades</h4>
                    <p className="text-sm text-yellow-800">
                      Lo dispuesto en este apartado se aplican en concordancia con lo establecido en los numerales 6.5 y 6.6 de la presente directiva, respecto a la no transferencia de responsabilidades del ODP.
                    </p>
                  </div>

                  {/* 7.4.6 - Confidencialidad */}
                  <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded">
                    <Badge className="bg-teal-600 text-white mb-2">7.4.6</Badge>
                    <h4 className="font-bold text-teal-900 mb-2">Confidencialidad de Información</h4>
                    <p className="text-sm text-teal-800">
                      El ODP guarda estricta confidencialidad respecto de la información que conozca en el ejercicio de sus funciones; particularmente aquella que, de develarse, pudiera poner en riesgo o afectar la eficacia de las mismas, bajo responsabilidad administrativa, civil y/o penal, según corresponda.
                    </p>
                  </div>

                  {/* 7.4.7 - Solicitudes de Información */}
                  <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
                    <Badge className="bg-indigo-600 text-white mb-2">7.4.7</Badge>
                    <h4 className="font-bold text-indigo-900 mb-2">Solicitudes de Información - Ley de Transparencia</h4>
                    <p className="text-sm text-indigo-800">
                      En lo que respecta a aquellas solicitudes de información que reciba el ODP en el marco de sus funciones, debe deliberar sobre la atención correspondiente teniendo en cuenta, adicionalmente, las consideraciones previstas en la Ley N° 27806, Ley de Transparencia y Acceso a la Información Pública, el TUO aprobado por Decreto Supremo N° 21-2019-JUS y su Reglamento, aprobado por Decreto Supremo N° 007-2024-JUS o el que lo sustituya.
                    </p>
                  </div>

                  {/* 7.4.8 - Información Periódica */}
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                    <Badge className="bg-orange-600 text-white mb-2">7.4.8</Badge>
                    <h4 className="font-bold text-orange-900 mb-2">Información Periódica</h4>
                    <p className="text-sm text-orange-800">
                      El ODP informa periódicamente al obligado sobre las acciones realizadas en el ejercicio de sus funciones.
                    </p>
                  </div>

                  {/* 7.4.9 - Rendición de Cuentas */}
                  <div className="bg-pink-50 border-l-4 border-pink-500 p-4 rounded">
                    <Badge className="bg-pink-600 text-white mb-2">7.4.9</Badge>
                    <h4 className="font-bold text-pink-900 mb-2">Rendición de Cuentas</h4>
                    <p className="text-sm text-pink-800">
                      La confidencialidad no aplica a la rendición de cuentas que deba realizar al obligado que lo designa. Sin embargo, cuando dicha rendición comprometa la identidad de personas que informan hechos relacionados con el tratamiento de datos personales de la entidad pública, organización o empresa, el ODP se encuentra excusado de revelar tal información, salvo frente a las autoridades competentes.
                    </p>
                  </div>

                  {/* 7.4.10 - Solicitudes y Consultas */}
                  <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded">
                    <Badge className="bg-cyan-600 text-white mb-2">7.4.10</Badge>
                    <h4 className="font-bold text-cyan-900 mb-2">Supervisión de Solicitudes y Consultas</h4>
                    <p className="text-sm text-cyan-800">
                      Respecto a las solicitudes y consultas relacionadas con la protección de datos personales, estas son supervisadas por el ODP, en tanto es el responsable de velar por el cumplimiento de la normativa y de canalizar adecuadamente las comunicaciones vinculadas a la materia. Cuando dichas solicitudes o consultas requieran un análisis técnico o una recomendación del ODP, este elabora un informe técnico correspondiente.
                    </p>
                  </div>

                  {/* 7.4.11 - Derechos ARCO */}
                  <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded">
                    <Badge className="bg-rose-600 text-white mb-2">7.4.11</Badge>
                    <h4 className="font-bold text-rose-900 mb-2">Asesoría en Derechos ARCO</h4>
                    <p className="text-sm text-rose-800">
                      El ODP orienta o asesora de manera especializada a la unidad o gerencia responsable sobre la correcta tramitación, interpretación legal y cumplimiento de los plazos en la normativa vigente para la atención de las solicitudes de derechos ARCO (acceso, rectificación, cancelación y oposición), asegurando así la respuesta oportuna conforme a Ley.
                    </p>
                  </div>

                </div>

                <Separator className="my-6" />

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                    <AlertOctagon className="w-5 h-5" />
                    Importante - Naturaleza de las Funciones
                  </h4>
                  <p className="text-sm text-yellow-700">
                    Las funciones del ODP tienen un carácter técnico especializado y no deben confundirse con las ejercidas por el obligado a la designación del mismo.
                    El ODP no es responsable de determinar la finalidad, el contenido o los medios de tratamiento de los datos, ni tampoco ser el ejecutor de dicho tratamiento.
                    Su rol es de asesoría, supervisión y coordinación interna en materia de protección de datos personales.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-10 px-4 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <h3 className="text-xl font-bold mb-3">Roberto Puyo - Chair, AAAI Chapter of Perú</h3>
              <p className="text-base text-blue-100 mb-3 leading-relaxed">
                AI Strategy & Governance Leader (ISO 42001) | Executive CISO & Tech Advisor | Digital Transformation
              </p>
              <a
                href="https://www.linkedin.com/in/robertopuyo/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-5 py-3 rounded-lg transition-all duration-200 hover:scale-105"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="font-medium">Conectar en LinkedIn</span>
              </a>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-blue-100">
                  <strong>Directiva:</strong> M6.DGTAIPD.DI.001 - Versión 01
                </p>
                <p className="text-sm text-blue-100">
                  <strong>Resolución Directoral:</strong> N° 100-2025-JUS/DGTAIPD
                </p>
                <p className="text-sm text-blue-100">
                  <strong>Decreto Supremo:</strong> N° 016-2024-JUS (Reglamento de la Ley N° 29733)
                </p>
              </div>
              
            </div>
          </div>
              <div className="bg-white/10 border border-blue-600/30 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-200 leading-relaxed">
                  Esta herramienta es de carácter informativo y se proporciona "tal cual está" para orientación general.
                </p>
                <p className="text-sm text-blue-200 leading-relaxed">
                  El contenido de la guía, análisis y conclusiones no constituyen asesoría jurídica oficial ni representan la postura de la Autoridad Nacional de Protección de Datos Personales (ANPD) o de cualquier entidad estatal.
                </p>
                <p className="text-sm text-blue-200 leading-relaxed">
                  Para la toma de decisiones formales, se recomienda la revisión de la Directiva M6.DGTAIPD.DI.001 y la normativa vigente sobre designación de ODP.
                </p>
                  <p className="text-sm text-red-200 leading-relaxed mt-4">
                    <strong className="text-red-300">ODP Checker - Perú - Oficial de Datos Personales puede contener errores. Comprueba la información importante.</strong>
                  </p>

                <div className="mt-3 pt-3 border-t border-blue-600/30 space-y-2">
                  <p className="text-sm font-semibold text-white mb-2">Plataforma</p>
                  <p className="text-sm text-blue-100">Guía Interactiva para el Oficial de Datos Personales (ODP)</p>
                  <p className="text-sm text-blue-100">Tecnología: Next.js 15.5.6, TypeScript, Tailwind CSS, shadcn/ui</p>
                  <p className="text-sm text-blue-100">Versión: 1.0.0</p>
                </div>
              </div>

          <Separator className="my-6 bg-blue-700" />
          <p className="text-center text-sm text-blue-200">
            © 2025 - Guía Interactiva referencial para el Oficial de Datos Personales | Desarrollado por Kepler Blacklock
          </p>
        </div>
      </footer>
    </div>
  );
}
