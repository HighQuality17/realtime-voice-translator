# 001 Audio Translation Spike - Especificación

## Contexto y problema

Realtime Voice Translator busca facilitar conversaciones presenciales entre personas que hablan idiomas diferentes. Antes de diseñar el MVP para dos participantes, el proyecto necesita validar la parte técnica más riesgosa: capturar voz desde el navegador, enviarla por WebRTC a OpenAI Realtime Translation y recibir traducción audible con subtítulos.

Este spike no representa el MVP completo. Es una prueba unilateral para reducir incertidumbre técnica sobre audio, WebRTC, credenciales temporales, reproducción de audio traducido y recepción de subtítulos incrementales.

## Objetivo del spike

Validar que una persona pueda hablar en español desde un navegador compatible en `localhost` y recibir audio traducido y subtítulos incrementales en inglés mediante OpenAI Realtime Translation, WebRTC y `gpt-realtime-translate`, sin almacenar audio ni transcripciones.

## Hipótesis técnica

La hipótesis del spike es que la aplicación puede:

- Solicitar acceso al micrófono desde Chrome o Edge de escritorio.
- Obtener un `MediaStream` local.
- Solicitar al servidor un secreto temporal sin exponer `OPENAI_API_KEY` al navegador.
- Establecer una conexión WebRTC con OpenAI usando el secreto temporal.
- Enviar audio hablado en español por la pista local del micrófono.
- Recibir audio traducido al inglés como pista remota.
- Recibir subtítulos incrementales mediante el evento `session.output_transcript.delta`.
- Finalizar la prueba liberando micrófono, pistas, canal de datos, conexión WebRTC y referencias locales.

## Historia de usuario

Como usuario de la prueba técnica, quiero abrir una página del spike, iniciar una sesión, hablar en español y recibir audio traducido y subtítulos en inglés, para comprobar que la base técnica de traducción de voz en tiempo real funciona antes de construir el MVP presencial.

## Alcance

- Página dedicada en `/spikes/audio-translation`.
- Prueba unilateral de español hablado hacia inglés.
- Solicitud de permiso de micrófono desde el navegador.
- Captura de audio con `MediaDevices`.
- Route Handler interno en `/api/realtime/translations/session`.
- Creación de secreto temporal en servidor mediante `fetch` nativo.
- Uso de `POST https://api.openai.com/v1/realtime/translations/client_secrets` desde el servidor.
- Configuración mínima de sesión con `model: gpt-realtime-translate` y `audio.output.language: "en"`.
- Conexión WebRTC desde navegador usando `RTCPeerConnection`.
- Negociación SDP con `POST https://api.openai.com/v1/realtime/translations/calls` desde el navegador usando el secreto temporal.
- Envío de la pista de audio del micrófono.
- Recepción de audio remoto traducido mediante `pc.ontrack`.
- Creación de `RTCDataChannel` llamado `oai-events`.
- Recepción de subtítulos incrementales mediante `session.output_transcript.delta`.
- Estados principales de interfaz para mostrar progreso y errores.
- Indicadores secundarios durante la sesión activa.
- Finalización manual de la prueba.
- Limpieza de recursos al finalizar, fallar o abandonar la página.

## Fuera del alcance

- Traducción de inglés a español.
- Conversación entre dos participantes.
- Historial de conversación.
- Diseño visual definitivo.
- Registro de usuarios.
- Autenticación.
- Base de datos.
- Pagos.
- Funcionamiento sin internet.
- Traducción especializada.
- Pruebas con usuarios.
- Despliegue en producción.
- Integración con WhatsApp, Telegram, telefonía, llamadas o videollamadas.
- Uso del SDK de OpenAI.
- Uso de `response.create`.
- Persistencia de audio o transcripciones.
- Configuración de idioma de entrada mediante API. Las pruebas se harán hablando español, pero el spike no documenta ni requiere un parámetro de idioma de entrada.

## Requisitos funcionales

1. La aplicación debe conservar la página principal actual sin reemplazarla.
2. La prueba técnica debe estar disponible en `/spikes/audio-translation`.
3. La página del spike debe indicar que la prueba es unilateral de español hablado hacia inglés.
4. La página debe permitir iniciar la prueba manualmente.
5. Al iniciar, el navegador debe solicitar permiso para usar el micrófono.
6. Si el permiso se concede, el navegador debe obtener un `MediaStream` con audio.
7. El navegador debe solicitar un secreto temporal al Route Handler `/api/realtime/translations/session`.
8. El servidor debe crear el secreto temporal con `fetch` nativo, sin SDK de OpenAI.
9. El servidor debe llamar a `POST https://api.openai.com/v1/realtime/translations/client_secrets` usando `OPENAI_API_KEY` solo desde el entorno del servidor.
10. La configuración mínima de sesión debe incluir `model: gpt-realtime-translate`.
11. La configuración mínima de sesión debe incluir `audio.output.language: "en"`.
12. El servidor debe devolver al navegador únicamente la respuesta segura necesaria, incluyendo el secreto temporal.
13. El servidor nunca debe devolver `OPENAI_API_KEY` al navegador.
14. El navegador debe crear un `RTCPeerConnection` para la sesión.
15. El navegador debe añadir la pista de audio del micrófono al `RTCPeerConnection`.
16. El navegador debe configurar recepción de audio remoto mediante `pc.ontrack`.
17. El navegador debe crear un `RTCDataChannel` llamado `oai-events`.
18. El navegador debe crear una oferta SDP.
19. El navegador debe enviar el SDP a `POST https://api.openai.com/v1/realtime/translations/calls` usando el secreto temporal.
20. El navegador debe configurar la respuesta SDP como remote description.
21. El audio traducido debe recibirse como pista remota y reproducirse en el navegador.
22. Los subtítulos traducidos deben recibirse mediante el evento `session.output_transcript.delta`.
23. La interfaz debe mostrar el texto traducido incremental en inglés.
24. La interfaz debe mostrar estados principales durante el ciclo de vida de la prueba.
25. Durante el estado `active`, la interfaz debe mostrar indicadores secundarios para micrófono activo, recepción de subtítulos y reproducción de audio.
26. La página debe permitir finalizar la prueba manualmente.
27. Al finalizar, la aplicación debe detener pistas, cerrar el canal de datos, cerrar `RTCPeerConnection` y limpiar referencias.
28. La aplicación debe manejar errores principales con mensajes comprensibles para el usuario.
29. La implementación no debe usar `response.create`.

## Requisitos no funcionales

1. La implementación futura debe mantener TypeScript en modo estricto.
2. La implementación futura no debe instalar dependencias sin justificación explícita.
3. La prueba debe ejecutarse inicialmente en `localhost`.
4. Los navegadores iniciales soportados para el spike son Chrome y Edge de escritorio.
5. El spike no debe almacenar audio.
6. El spike no debe almacenar transcripciones.
7. El spike no debe usar base de datos.
8. El spike no debe usar autenticación.
9. Los errores visibles no deben exponer secretos ni detalles sensibles del proveedor.
10. La API key privada debe existir únicamente en servidor.
11. La interfaz debe ser mínima, clara y no equivalente al diseño final del MVP.
12. La finalización de la prueba debe ser idempotente desde la perspectiva del usuario.
13. La limpieza de recursos debe ejecutarse al finalizar, al fallar y al desmontar la página.
14. Los logs de desarrollo no deben incluir audio, transcripciones ni secretos.
15. El comportamiento debe documentarse antes de implementarse, siguiendo Spec-Driven Development.

## Estados principales

- `idle`: la página está cargada y la prueba no se ha iniciado.
- `requesting-permission`: el navegador está solicitando acceso al micrófono.
- `creating-session`: el navegador está solicitando el secreto temporal al servidor.
- `connecting`: el navegador está creando y negociando la conexión WebRTC.
- `active`: la conexión está activa o lista para enviar audio y recibir resultados.
- `stopping`: la aplicación está liberando recursos.
- `stopped`: la prueba terminó y los recursos fueron liberados.
- `error`: la prueba no puede continuar o requiere reinicio por un error.

## Indicadores secundarios durante active

- Micrófono activo.
- Recibiendo subtítulos.
- Reproduciendo audio.

Estos indicadores no reemplazan los estados principales y pueden coexistir durante `active`.

## Casos de error

- El navegador no soporta `navigator.mediaDevices.getUserMedia`.
- El navegador no soporta `RTCPeerConnection`.
- El navegador no soporta `RTCDataChannel`.
- El usuario deniega el permiso de micrófono.
- No hay dispositivo de micrófono disponible.
- El micrófono se desconecta durante la prueba.
- La captura de audio falla después de conceder permiso.
- Falta `OPENAI_API_KEY` en el entorno del servidor.
- OpenAI rechaza la creación del secreto temporal.
- El Route Handler devuelve una respuesta inválida o no segura.
- El secreto temporal no permite negociar la llamada.
- La negociación SDP falla.
- La conexión WebRTC falla o se pierde.
- El canal `oai-events` falla o se cierra inesperadamente.
- El proveedor devuelve un error durante la sesión.
- El navegador bloquea o falla la reproducción de audio remoto.
- El usuario finaliza mientras la prueba aún está iniciando.
- La limpieza de recursos encuentra referencias ya cerradas o inexistentes.

## Seguridad y privacidad

- `OPENAI_API_KEY` solo puede leerse en servidor.
- El navegador solo puede recibir el secreto temporal y datos seguros necesarios para negociar la sesión.
- El Route Handler no debe registrar secretos en logs.
- El navegador no debe persistir audio ni transcripciones.
- El servidor no debe persistir audio ni transcripciones.
- No se usará base de datos.
- No se usará autenticación en este spike.
- Los errores enviados al cliente deben ser normalizados y no deben incluir cabeceras, tokens, secretos ni respuestas internas completas.
- Los archivos `.env` reales deben permanecer fuera de Git.
- La prueba debe permitir liberar el micrófono al finalizar.

## Suposiciones

- La prueba se ejecutará inicialmente en `localhost`.
- El usuario probará hablando español.
- El único idioma configurado mediante API será el idioma objetivo `"en"`.
- Chrome y Edge de escritorio tienen soporte suficiente para micrófono, WebRTC, `RTCPeerConnection` y `RTCDataChannel`.
- La cuenta de OpenAI usada por el servidor tiene acceso a OpenAI Realtime Translation y al modelo `gpt-realtime-translate`.
- El endpoint de creación de secretos temporales acepta la configuración mínima documentada para este spike.
- El endpoint de negociación SDP acepta una oferta SDP enviada desde el navegador con el secreto temporal.

## Riesgos técnicos

- El contrato exacto de los endpoints de OpenAI puede cambiar o requerir campos adicionales.
- La disponibilidad real de `gpt-realtime-translate` puede depender de la cuenta o región.
- La recepción de `session.output_transcript.delta` puede requerir detalles adicionales de formato de eventos.
- La reproducción de audio puede ser bloqueada por políticas del navegador si no está vinculada a una interacción del usuario.
- WebRTC puede fallar por red, firewall, proxy o restricciones del entorno local.
- La latencia real puede no ser aceptable para el MVP aunque el spike funcione.
- Un cierre incompleto de tracks puede dejar el indicador del micrófono activo en el navegador.
- Los errores del proveedor pueden ser difíciles de reproducir automáticamente.
- Sin pruebas automatizadas de navegador con audio real, parte de la validación dependerá de prueba manual.

## Criterio de éxito del spike

El spike se considera exitoso si, en Chrome o Edge de escritorio ejecutando en `localhost`, una persona puede iniciar la prueba, conceder permiso de micrófono, hablar en español, recibir audio traducido en inglés, ver subtítulos incrementales derivados de `session.output_transcript.delta`, finalizar manualmente y comprobar que el micrófono y la conexión WebRTC quedaron cerrados, sin exponer `OPENAI_API_KEY` ni almacenar audio o transcripciones.

## Criterio de fallo del spike

El spike se considera fallido si no es posible establecer la sesión WebRTC con OpenAI Realtime Translation, si no se recibe audio traducido o subtítulos incrementales, si la API key privada llega al navegador, si se requiere persistir audio o transcripciones para funcionar, o si no se pueden liberar correctamente el micrófono y la conexión al finalizar.
