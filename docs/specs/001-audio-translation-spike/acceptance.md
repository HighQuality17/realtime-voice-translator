# 001 Audio Translation Spike - Criterios de aceptación

## Criterios automatizables

### Carga de la página del spike

Given que la aplicación está ejecutándose en `localhost`
When se visita `/spikes/audio-translation`
Then la página del spike se renderiza correctamente
And muestra que la prueba es unilateral de español hablado hacia inglés

### Página principal conservada

Given que la aplicación está ejecutándose en `localhost`
When se visita `/`
Then la página principal actual sigue disponible
And no fue reemplazada por la página del spike

### Creación segura del secreto temporal

Given que `OPENAI_API_KEY` está configurada solo en servidor
When el navegador solicita `POST /api/realtime/translations/session`
Then el Route Handler solicita un secreto temporal a OpenAI
And usa `POST https://api.openai.com/v1/realtime/translations/client_secrets`
And usa `fetch` nativo
And no usa SDK de OpenAI

### Configuración mínima de sesión

Given que el Route Handler crea el secreto temporal
When construye la solicitud hacia OpenAI
Then la configuración incluye `model: gpt-realtime-translate`
And incluye `audio.output.language: "en"`
And no inventa ni requiere un parámetro de idioma de entrada

### Ausencia de OPENAI_API_KEY en cliente

Given que el Route Handler responde al navegador
When se inspecciona la respuesta y el bundle cliente
Then `OPENAI_API_KEY` no aparece en la respuesta
And `OPENAI_API_KEY` no aparece en código ejecutado por el cliente

### Ausencia de response.create

Given que se revisa la implementación del spike
When se buscan llamadas o eventos de creación de respuesta
Then no existe uso de `response.create`

### Ausencia de persistencia

Given que se revisa la implementación del spike
When se inspeccionan rutas, módulos y almacenamiento local
Then no existe base de datos
And no se persiste audio
And no se persisten transcripciones
And no se usa autenticación

### Estados principales

Given que la página del spike está cargada
When el flujo avanza por inicio, permisos, sesión, conexión, actividad, finalización y error
Then la UI usa los estados principales definidos
And los estados principales son `idle`, `requesting-permission`, `creating-session`, `connecting`, `active`, `stopping`, `stopped` y `error`

### Indicadores secundarios

Given que la prueba está en estado `active`
When el micrófono está activo, llegan subtítulos o se reproduce audio
Then la UI representa esos datos como indicadores secundarios
And no trata `listening`, `translating` ni `playing` como estados principales mutuamente excluyentes

### Limpieza invocable

Given que existen referencias a tracks, canal de datos, audio remoto y peer connection
When se invoca la finalización de la prueba
Then la lógica intenta detener pistas
And intenta cerrar `oai-events`
And intenta cerrar `RTCPeerConnection`
And limpia referencias locales aunque algunos recursos no existan

## Criterios que requieren prueba manual con micrófono y audio real

### Permiso concedido

Given que el usuario abre `/spikes/audio-translation` en Chrome o Edge de escritorio
When pulsa iniciar y concede permiso de micrófono
Then el navegador obtiene un `MediaStream` de audio
And la interfaz avanza desde `requesting-permission` hacia `creating-session`

### Permiso denegado

Given que el usuario abre `/spikes/audio-translation` en Chrome o Edge de escritorio
When pulsa iniciar y deniega permiso de micrófono
Then la prueba no continúa hacia WebRTC
And se muestra un mensaje de error comprensible
And no queda el micrófono activo

### Conexión WebRTC

Given que el permiso de micrófono fue concedido y existe un secreto temporal válido
When el navegador crea la oferta SDP y la envía a `POST https://api.openai.com/v1/realtime/translations/calls`
Then recibe una respuesta SDP
And configura esa respuesta como remote description
And la interfaz llega al estado `active`

### Envío de audio

Given que la conexión WebRTC está activa
When el usuario habla en español frente al micrófono
Then la pista de audio del micrófono se envía por `RTCPeerConnection`
And la sesión permanece activa durante la prueba

### Recepción de audio en inglés

Given que el usuario está hablando en español y la conexión está activa
When OpenAI devuelve audio traducido
Then el navegador recibe una pista remota mediante `pc.ontrack`
And reproduce audio traducido en inglés

### Recepción de session.output_transcript.delta

Given que el canal `oai-events` está abierto
When OpenAI emite `session.output_transcript.delta`
Then la interfaz muestra subtítulos incrementales en inglés
And los subtítulos no se guardan de forma persistente

### Finalización manual

Given que la prueba está activa
When el usuario pulsa finalizar
Then la interfaz pasa por `stopping`
And termina en `stopped` si la limpieza se completa

### Cierre del micrófono

Given que la prueba usó el micrófono
When el usuario finaliza la prueba
Then todas las pistas locales quedan detenidas
And el navegador deja de indicar uso activo del micrófono

### Cierre de RTCPeerConnection

Given que la prueba creó un `RTCPeerConnection`
When el usuario finaliza la prueba
Then el peer connection queda cerrado
And no continúa enviando audio

### Cierre del canal de datos

Given que la prueba creó el canal `oai-events`
When el usuario finaliza la prueba
Then el canal de datos queda cerrado o sin referencias activas
And no se siguen procesando eventos de subtítulos

### Pérdida de conexión

Given que la prueba está activa
When se pierde la conexión de red o falla WebRTC
Then la interfaz muestra un error comprensible
And ejecuta limpieza de recursos

### Error del proveedor

Given que OpenAI devuelve un error al crear el secreto, negociar SDP o procesar la sesión
When la aplicación recibe el error
Then la interfaz muestra un mensaje comprensible
And no muestra secretos, tokens, cabeceras privadas ni respuestas internas completas

### Ausencia de persistencia durante uso real

Given que el usuario completa una prueba hablando en español
When finaliza la prueba
Then no queda audio almacenado por la aplicación
And no quedan transcripciones almacenadas por la aplicación
And recargar la página no restaura subtítulos previos

## Criterio final de aceptación

Given que los criterios automatizables pasan y la prueba manual funciona en Chrome o Edge de escritorio en `localhost`
When una persona habla en español durante el spike
Then recibe audio traducido y subtítulos incrementales en inglés
And puede finalizar la prueba liberando micrófono, canal de datos y `RTCPeerConnection`
And `OPENAI_API_KEY` nunca llega al navegador
And no se almacena audio ni transcripciones
And no existe uso de `response.create`
