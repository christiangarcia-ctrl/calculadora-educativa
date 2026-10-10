# Calculadora educativa

Adaptación de calculadora-retiro2, base `2203d70a20b28e6773dd8ef70b707a7f76ae7e1d`.
Reutiliza la identidad visual y activos del repositorio y la matriz de bonos de
`garba-advisor-educacion`, contrastada con el documento oficial.

## Uso

Abrir index.html junto con projection.js y los activos existentes, o servir la
carpeta como sitio estático. No necesita un modelo de IA ni backend.

Las cuatro vistas son Datos Generales, Resumen, Proyección y Coberturas y
condiciones. Las exportaciones incluyen PNG de cada vista, PDF vertical para teléfono, breve, sin universidades ni brecha y CSV anual. html2canvas 1.4.1 y jsPDF 2.5.1 se cargan desde jsDelivr.
No guarda nombres, RFC ni datos del hijo en almacenamiento o servicios externos.

## Fuentes y actualización

- Documento ofrecido por Allianz al consultar el sitio el 09/10/2026:
  https://www.allianz.com.mx/seguros/ahorro-e-inversion/seguro-educacion.html
- Folleto enlazado (2025), páginas 8–11:
  https://www.allianz.com.mx/content/dam/onemarketing/iberolatam/allianz-mx/ahorro---educaci%C3%B3n/educaci%C3%B3n-documentos/Folleto%20OptiMaxx%20educaci%C3%B3n%202025.pdf
- UDI inicial: 8.851528 pesos, 09/10/2026; DOF/Banco de México.
- Actualizar UDI de hoy consulta directamente, sin autenticación:
  https://sidof.segob.gob.mx/dof/sidof/indicadores/
  Documentación: https://sidof.segob.gob.mx/datos_abiertos/getPDF/61
  Usa `ListaIndicadores`, `codTipoIndicador=159`, `fecha` y `valor`.
  Se verificaron HTTP 200, JSON y Access-Control-Allow-Origin: *.
  Solo acepta fechas válidas no futuras y hasta siete días anteriores;
  un dato anterior aparece como último disponible, nunca como dato de hoy.
  Ante timeout (12 segundos), error o respuesta inválida conserva el valor.
  La fecha de hoy se evalúa en America/Hermosillo.

Cargos máximos precargados: apertura 500 MXN; administración 1.5% trimestral
sobre saldo inicial; gestión 0.1% mensual sobre saldo total; fijo 25 UDIS desde
mes 19. Estos valores siguen editables. La variación futura UDI (4% precargado)
es un supuesto, no una previsión oficial. La tasa bruta se captura manualmente.
Los nombres y porcentajes de portafolios se capturan y deben sumar 100%.

## Alcance del modelo

Proyección ilustrativa; falta conciliación numérica con una corrida del
simulador oficial. El folleto no publica todas las tarifas de seguro ni el
orden exacto de valuación intramensual. La prima mensual de coberturas debe
capturarse de una cotización o identificarse como supuesto. No se deriva
actuarialmente de edades o sumas aseguradas. Se mantiene constante.

Aportaciones al inicio del mes; bono en doce abonos durante primer año;
gestión y costos mensuales antes del rendimiento; administración al cierre
trimestral. Tasa anual efectiva convertida a mensual equivalente.
Las primeras 18 aportaciones y el bono se separan del saldo comprometido.
Disponible anual antes de cargo de retiro e impuestos: comprometido antes del
vencimiento, fondo completo al final. No calcula cancelación total, impuestos,
siniestros, descansos, aportaciones adicionales ni tipos de cambio por cartera.
Si los fondos no alcanzan para un cargo, lo señala como escenario insuficiente.

## Verificación

`node tests/projection.test.cjs`

Verificados bonos en límites, todos los plazos 10–25, incrementos, deducción
de cargos y separación de liquidez. Pruebas de navegador: cuatro vistas,
validación, cambio de datos invalida resultados, diseño móvil y exportación PDF.
Botón UDI: transporte oficial probado con solicitud HTTP; lógica en navegador
probada con esa respuesta registrada y falla simulada. La consulta en navegador
con red real queda sujeta a conectividad del entorno de publicación.

No se hizo commit, push, renombrado del repositorio ni despliegue.

## Personalización educativa
Nombre y teléfono del asesor obligatorios; aparecen en las cuatro vistas y el PDF. Se utiliza el logo de Distribuidor Autorizado Allianz proporcionado por el usuario. Fotografías distintas extraídas del folleto OptiMaxx educación 2025, conservando su origen.

El objetivo universitario reutiliza las referencias del repositorio mi-punto-de-partida-educacion; no se etiquetan como precios oficiales vigentes. Se pueden reemplazar costo anual, campus, carrera, fuente y fecha por una cotización. Los sitios oficiales de Tecmilenio e IBERO se enlazan para consulta; no existe actualización automática de colegiaturas en esta versión. La inflación educativa inicial de 6% es un supuesto independiente del rendimiento y de la UDI. Meta = costo anual × duración × (1 + inflación educativa)^plazo. Se valúa toda la carrera al final del plan; no incluye incrementos durante los estudios, vivienda, manutención ni becas. El porcentaje compara el fondo final con esa meta y el faltante nunca es negativo.

## PDF para celular
Generación independiente de las cuatro capturas: páginas de 360 × 640 puntos, texto vectorial seleccionable, cifras principales de 23 puntos y lectura por bloques. La proyección anual completa permanece en la herramienta y en CSV; el PDF de transición omite universidades, brecha y tabla anual. CTA final: «Quiero avanzar con el plan», enlace PDF URI a wa.me con teléfono internacional del asesor y mensaje preparado. Solo se abre WhatsApp; no envía mensajes. El teléfono debe comenzar con + y contener el código de país. El formato habitual es de cuatro páginas; textos excepcionalmente largos pueden necesitar una continuación para conservar la legibilidad.

## Valores iniciales y alternativas ilustrativas
Tasa bruta inicial de 10% anual efectiva, editable y no garantizada. Incremento de aportación de 4% anual activado inicialmente, editable o desactivable; se aplica cada año sobre la aportación del año anterior. Son supuestos de la corrida y no tasas prometidas por Allianz. Las sugerencias de portafolios reutilizan las categorías visibles en el simulador oficial de educación: Pesos (Conservador, Balanceado, Dinámico, Revaluables), Dólares y Euros (Conservador, Balanceado, Dinámico), Dedicados (BRIC, China, Brasil, Oro, Mercados Emergentes). Confirmar disponibilidad en la Guía de Inversión; no se modelan rendimientos independientes ni fluctuaciones cambiarias.
