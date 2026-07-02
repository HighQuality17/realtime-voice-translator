# 001 Audio Translation Spike - Tareas

## Preparación

- [ ] Crear la ruta de página `/spikes/audio-translation` con contenido visible del spike.
- [ ] Mantener la página principal actual sin cambios funcionales.
- [ ] Definir tipos estrictos para estados principales e indicadores secundarios.
- [ ] Verificar que la implementación futura no agregue dependencias sin justificación.
- [ ] Confirmar en documentación oficial los detalles exactos de payloads, cabeceras y respuestas de OpenAI antes de codificar llamadas.

## Route Handler

- [ ] Crear el Route Handler `POST /api/realtime/translations/session`.
- [ ] Leer `OPENAI_API_KEY` solo desde el entorno del servidor.
- [ ] Devolver error normalizado si `OPENAI_API_KEY` no está configurada.
- [ ] Implementar llamada con `fetch` nativo a `POST https://api.openai.com/v1/realtime/translations/client_secrets`.
- [ ] Enviar configuración mínima con `model: gpt-realtime-translate`.
- [ ] Enviar configuración mínima con `audio.output.language: "en"`.
- [ ] Devolver al navegador solo los datos seguros necesarios para negociar la sesión.
- [ ] Verificar que la respuesta del Route Handler no incluya `OPENAI_API_KEY`.

## Captura de micrófono

- [ ] Validar soporte de `navigator.mediaDevices.getUserMedia` antes de solicitar audio.
- [ ] Solicitar permiso de micrófono al pulsar iniciar.
- [ ] Obtener un `MediaStream` de audio cuando el permiso sea concedido.
- [ ] Mostrar error comprensible si el permiso es denegado.
- [ ] Mostrar error comprensible si no hay micrófono disponible.
- [ ] Conservar referencia temporal al `MediaStream` local para poder liberarlo.

## WebRTC

- [ ] Validar soporte de `RTCPeerConnection`.
- [ ] Crear `RTCPeerConnection` después de obtener micrófono y secreto temporal.
- [ ] Añadir la pista de audio del micrófono al peer connection.
- [ ] Configurar `pc.ontrack` antes de completar la negociación.
- [ ] Crear `RTCDataChannel` llamado `oai-events`.
- [ ] Crear oferta SDP.
- [ ] Configurar la oferta SDP como local description.
- [ ] Enviar la oferta SDP a `POST https://api.openai.com/v1/realtime/translations/calls` usando el secreto temporal.
- [ ] Configurar la respuesta SDP como remote description.
- [ ] Observar cambios de conexión para detectar fallo o pérdida de conexión.

## Audio remoto

- [ ] Asociar la pista o stream remoto recibido en `pc.ontrack` a un elemento de audio.
- [ ] Reproducir el audio traducido en inglés cuando esté disponible.
- [ ] Mostrar indicador secundario de reproducción de audio durante `active`.
- [ ] Mostrar error comprensible si la reproducción de audio falla.
- [ ] Limpiar `srcObject` del elemento de audio al finalizar.

## Subtítulos

- [ ] Escuchar mensajes del canal `oai-events`.
- [ ] Parsear mensajes del canal de forma defensiva.
- [ ] Detectar eventos `session.output_transcript.delta`.
- [ ] Extraer el fragmento incremental según el contrato oficial validado.
- [ ] Mostrar subtítulos incrementales en inglés.
- [ ] Mostrar indicador secundario de recepción de subtítulos durante `active`.
- [ ] Evitar persistir subtítulos fuera del estado temporal de la página.

## Estados

- [ ] Mostrar estado `idle` antes de iniciar.
- [ ] Mostrar estado `requesting-permission` durante solicitud de micrófono.
- [ ] Mostrar estado `creating-session` durante solicitud al Route Handler.
- [ ] Mostrar estado `connecting` durante creación y negociación WebRTC.
- [ ] Mostrar estado `active` cuando la prueba esté lista o en curso.
- [ ] Mostrar estado `stopping` durante limpieza de recursos.
- [ ] Mostrar estado `stopped` después de finalizar correctamente.
- [ ] Mostrar estado `error` ante errores terminales.
- [ ] Representar micrófono activo, recibiendo subtítulos y reproduciendo audio como indicadores secundarios compatibles con `active`.

## Errores

- [ ] Manejar navegador sin soporte de micrófono.
- [ ] Manejar navegador sin soporte de WebRTC.
- [ ] Manejar navegador sin soporte de `RTCDataChannel`.
- [ ] Manejar permiso de micrófono denegado.
- [ ] Manejar fallo al obtener `MediaStream`.
- [ ] Manejar fallo del Route Handler.
- [ ] Manejar fallo al crear secreto temporal.
- [ ] Manejar fallo de negociación SDP.
- [ ] Manejar pérdida de conexión WebRTC.
- [ ] Manejar cierre inesperado del canal `oai-events`.
- [ ] Manejar error del proveedor durante la sesión.
- [ ] Manejar fallo de reproducción de audio remoto.
- [ ] Evitar mostrar secretos o respuestas internas completas en mensajes de error.

## Limpieza

- [ ] Detener todas las pistas del `MediaStream` local.
- [ ] Cerrar el canal de datos `oai-events` si existe.
- [ ] Cerrar `RTCPeerConnection` si existe.
- [ ] Limpiar handlers asociados a WebRTC.
- [ ] Limpiar referencias a streams locales y remotos.
- [ ] Limpiar referencia `srcObject` del elemento de audio.
- [ ] Limpiar subtítulos temporales al finalizar la prueba.
- [ ] Ejecutar limpieza al finalizar manualmente.
- [ ] Ejecutar limpieza ante error terminal.
- [ ] Ejecutar limpieza al desmontar la página.
- [ ] Hacer que la limpieza tolere recursos parcialmente inicializados.

## Seguridad

- [ ] Confirmar que `OPENAI_API_KEY` no aparece en código cliente.
- [ ] Confirmar que `OPENAI_API_KEY` no aparece en respuestas del Route Handler.
- [ ] Confirmar que no se usa SDK de OpenAI.
- [ ] Confirmar que no se usa `response.create`.
- [ ] Confirmar que no se crea base de datos ni persistencia.
- [ ] Confirmar que no se agrega autenticación.
- [ ] Confirmar que logs de desarrollo no incluyen secretos, audio ni subtítulos.

## Validación

- [ ] Ejecutar `npm run lint` y obtener resultado exitoso.
- [ ] Ejecutar `npm run typecheck` y obtener resultado exitoso.
- [ ] Ejecutar `npm run build` y obtener resultado exitoso.
- [ ] Probar carga de `/spikes/audio-translation` en `localhost`.
- [ ] Probar flujo completo en Chrome de escritorio hablando español.
- [ ] Probar flujo completo en Edge de escritorio hablando español.
- [ ] Verificar recepción de audio traducido en inglés.
- [ ] Verificar recepción de `session.output_transcript.delta`.
- [ ] Verificar que el micrófono queda apagado al finalizar.
- [ ] Verificar que la conexión WebRTC queda cerrada al finalizar.
- [ ] Verificar ausencia de persistencia de audio y transcripciones.

## Documentación

- [ ] Documentar detalles oficiales confirmados de endpoints, cabeceras, payloads y eventos.
- [ ] Documentar errores encontrados durante pruebas manuales.
- [ ] Documentar cualquier desviación respecto a esta especificación.
- [ ] Documentar si la hipótesis técnica del spike fue validada o rechazada.
