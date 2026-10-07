# Mejoras SEO posteriores a 41b7053

Fecha: 7 de octubre de 2026. Repositorio: Black1599/CEO_CA. Rama: work. Base comparada: 41b70535575203bb6b06ce0799983d447fc53438.

## Resultado y alcance

Esta iteración conserva las mejoras previas y aplica únicamente ajustes pendientes de datos estructurados y carga de una fuente ya existente. Los BODY de las 38 páginas son idénticos byte a byte tras su parseo respecto a la base; también se conservan títulos, descripciones, meta robots, canonical, hreflang y los datos locales. CSS, JavaScript, imágenes y fuentes permanecen sin cambios.

## Cambios y beneficio

| Grupo | Cambio aplicado | Beneficio y límite |
| --- | --- | --- |
| Datos estructurados de artículos | about pasa de cadenas a entidades Thing con name; se incorpora articleSection desde la categoría visible original. | Se ajusta al rango esperado por Schema.org y describe la clasificación real del artículo. No añade servicios ni cambia contenido jurídico. |
| Catalán | Se traducen exclusivamente los conceptos existentes de about/keywords en los 13 artículos CA. | Coherencia con inLanguage y con el idioma del texto visible, sin incorporar nuevos conceptos ni ubicaciones. |
| Arquitectura de entidades | Se completa el WebPage ya existente en mainEntityOfPage de los 26 artículos y se conecta con artículo, sitio e itinerario de navegación. Los dos listados Blog incorporan su WebPage y referencias a los 13 BlogPosting de cada idioma. | Explicita la relación entre el documento, su contenido y el blog; quedan representadas las 38 páginas mediante WebPage o ProfilePage, sin duplicar el negocio o la persona. |
| Navegación estructurada | ProfilePage se conecta con su BreadcrumbList existente. | Asocia explícitamente el itinerario a su página; conserva la navegación y todas sus URLs. |
| Entidad local | Las dos declaraciones de LegalService añaden founder con el identificador compartido de Maria Carandell. | Vincula el despacho con su fundadora real, ya identificada en los textos y en Person. Se mantiene una única oficina en El Masnou; Alella y Teià siguen siendo áreas de servicio. |
| Rendimiento | Una precarga as=font para Inter regular, con la misma URL que CSS y crossorigin=anonymous, antes de los estilos. | Adelanta el descubrimiento de una fuente ya solicitada en todas las páginas. Una sola solicitud por documento, misma cantidad de bytes, misma tipografía y apariencia. No se han precargado fuentes no utilizadas ni recursos opcionales. |

No se han repetido cambios en canonical, hreflang, lang, x-default, enlaces internos, ALT o dimensiones que ya eran correctos. Sitemap y robots.txt permanecen intactos: las URLs no cambian y lastmod ya corresponde al mismo día de estos cambios. Las fechas editoriales de artículos se conservan.

## Archivos modificados: inventario exacto

| Archivo | Resumen individual |
| --- | --- |
| `aviso-legal.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía. |
| `blog/coche-segunda-mano-averias-ocultas.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; BlogPosting: temas Thing válidos, categoría real y WebPage existente conectado con artículo, sitio e itinerario de navegación. |
| `blog/despido-estando-de-baja-medica.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; BlogPosting: temas Thing válidos, categoría real y WebPage existente conectado con artículo, sitio e itinerario de navegación. |
| `blog/divorcio-o-ruptura-de-pareja-estable.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; BlogPosting: temas Thing válidos, categoría real y WebPage existente conectado con artículo, sitio e itinerario de navegación. |
| `blog/herencia-con-deudas.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; BlogPosting: temas Thing válidos, categoría real y WebPage existente conectado con artículo, sitio e itinerario de navegación. |
| `blog/hipoteca-para-comprar-vivienda.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; BlogPosting: temas Thing válidos, categoría real y WebPage existente conectado con artículo, sitio e itinerario de navegación. |
| `blog/index.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; Blog: WebPage del listado y referencias a los 13 artículos que realmente aparecen en el idioma correspondiente. |
| `blog/mascotas-tras-divorcio-en-cataluna.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; BlogPosting: temas Thing válidos, categoría real y WebPage existente conectado con artículo, sitio e itinerario de navegación. |
| `blog/no-firmes-arras-sin-asesoramiento.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; BlogPosting: temas Thing válidos, categoría real y WebPage existente conectado con artículo, sitio e itinerario de navegación. |
| `blog/que-es-la-legitima-en-cataluna.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; BlogPosting: temas Thing válidos, categoría real y WebPage existente conectado con artículo, sitio e itinerario de navegación. |
| `blog/que-hacer-al-recibir-una-herencia-en-cataluna.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; BlogPosting: temas Thing válidos, categoría real y WebPage existente conectado con artículo, sitio e itinerario de navegación. |
| `blog/que-hacer-antes-de-comprar-vivienda.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; BlogPosting: temas Thing válidos, categoría real y WebPage existente conectado con artículo, sitio e itinerario de navegación. |
| `blog/requisitos-para-desheredar-en-cataluna.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; BlogPosting: temas Thing válidos, categoría real y WebPage existente conectado con artículo, sitio e itinerario de navegación. |
| `blog/se-puede-cortar-la-luz-a-un-okupa.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; BlogPosting: temas Thing válidos, categoría real y WebPage existente conectado con artículo, sitio e itinerario de navegación. |
| `blog/tipos-de-despido-en-cataluna.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; BlogPosting: temas Thing válidos, categoría real y WebPage existente conectado con artículo, sitio e itinerario de navegación. |
| `cat/avis-legal.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía. |
| `cat/blog/acomiadament-estant-de-baixa-medica.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; BlogPosting: temas Thing válidos, categoría real y WebPage existente conectado con artículo, sitio e itinerario de navegación; Traducción al catalán de temas y palabras clave existentes, manteniendo los mismos conceptos jurídicos. |
| `cat/blog/cotxe-segona-ma-avaries-ocultes.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; BlogPosting: temas Thing válidos, categoría real y WebPage existente conectado con artículo, sitio e itinerario de navegación; Traducción al catalán de temas y palabras clave existentes, manteniendo los mismos conceptos jurídicos. |
| `cat/blog/divorci-o-ruptura-de-parella-estable.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; BlogPosting: temas Thing válidos, categoría real y WebPage existente conectado con artículo, sitio e itinerario de navegación; Traducción al catalán de temas y palabras clave existentes, manteniendo los mismos conceptos jurídicos. |
| `cat/blog/es-pot-tallar-la-llum-a-un-ocupa.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; BlogPosting: temas Thing válidos, categoría real y WebPage existente conectado con artículo, sitio e itinerario de navegación; Traducción al catalán de temas y palabras clave existentes, manteniendo los mismos conceptos jurídicos. |
| `cat/blog/herencia-amb-deutes.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; BlogPosting: temas Thing válidos, categoría real y WebPage existente conectado con artículo, sitio e itinerario de navegación; Traducción al catalán de temas y palabras clave existentes, manteniendo los mismos conceptos jurídicos. |
| `cat/blog/hipoteca-per-comprar-habitatge.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; BlogPosting: temas Thing válidos, categoría real y WebPage existente conectado con artículo, sitio e itinerario de navegación; Traducción al catalán de temas y palabras clave existentes, manteniendo los mismos conceptos jurídicos. |
| `cat/blog/index.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; Blog: WebPage del listado y referencias a los 13 artículos que realmente aparecen en el idioma correspondiente. |
| `cat/blog/mascotes-despres-divorci-catalunya.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; BlogPosting: temas Thing válidos, categoría real y WebPage existente conectado con artículo, sitio e itinerario de navegación; Traducción al catalán de temas y palabras clave existentes, manteniendo los mismos conceptos jurídicos. |
| `cat/blog/no-signis-arres-sense-assessorament.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; BlogPosting: temas Thing válidos, categoría real y WebPage existente conectado con artículo, sitio e itinerario de navegación; Traducción al catalán de temas y palabras clave existentes, manteniendo los mismos conceptos jurídicos. |
| `cat/blog/que-es-la-legitima-catalunya.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; BlogPosting: temas Thing válidos, categoría real y WebPage existente conectado con artículo, sitio e itinerario de navegación; Traducción al catalán de temas y palabras clave existentes, manteniendo los mismos conceptos jurídicos. |
| `cat/blog/que-fer-abans-de-comprar-habitatge.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; BlogPosting: temas Thing válidos, categoría real y WebPage existente conectado con artículo, sitio e itinerario de navegación; Traducción al catalán de temas y palabras clave existentes, manteniendo los mismos conceptos jurídicos. |
| `cat/blog/que-fer-en-rebre-una-herencia-catalunya.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; BlogPosting: temas Thing válidos, categoría real y WebPage existente conectado con artículo, sitio e itinerario de navegación; Traducción al catalán de temas y palabras clave existentes, manteniendo los mismos conceptos jurídicos. |
| `cat/blog/requisits-per-desheretar-catalunya.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; BlogPosting: temas Thing válidos, categoría real y WebPage existente conectado con artículo, sitio e itinerario de navegación; Traducción al catalán de temas y palabras clave existentes, manteniendo los mismos conceptos jurídicos. |
| `cat/blog/tipus-acomiadament-catalunya.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; BlogPosting: temas Thing válidos, categoría real y WebPage existente conectado con artículo, sitio e itinerario de navegación; Traducción al catalán de temas y palabras clave existentes, manteniendo los mismos conceptos jurídicos. |
| `cat/index.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; LegalService: vínculo con la fundadora real Maria Carandell; sin modificar ubicación ni áreas atendidas. |
| `cat/maria-carandell.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; ProfilePage: conexión con BreadcrumbList existente, sin duplicar persona ni perfil. |
| `cat/politica-cookies.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía. |
| `cat/privacitat.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía. |
| `index.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; LegalService: vínculo con la fundadora real Maria Carandell; sin modificar ubicación ni áreas atendidas. |
| `maria-carandell.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía; ProfilePage: conexión con BreadcrumbList existente, sin duplicar persona ni perfil. |
| `politica-cookies.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía. |
| `privacidad.html` | Precarga de la fuente Inter regular ya utilizada; misma URL, CORS y tipografía. |
| `SEO-AUDIT.md` | Nota histórica que identifica el informe de la primera iteración y enlaza este informe actualizado. |
| `SEO-IMPROVEMENTS.md` | Nuevo documento de revisión con inventario, beneficios, comprobaciones, límites y recomendaciones pendientes. |

Total: 38 HTML modificados, un documento existente actualizado y un documento nuevo; ningún archivo eliminado.

## Verificación

- **38 páginas / 19 parejas ES/CA:** canonical propio, lang, hreflang, x-default recíproco y correspondencia con sitemap comprobados en todas.
- **HTTP:** 38 URLs canónicas y los 75 archivos existentes en la base responden 200; contenido HTTP comparado con los archivos actuales. También se comprueba este nuevo informe.
- **Enlaces y recursos:** 1140 referencias locales, incluidos fragmentos, selector de idioma, imágenes, CSS, JS y la nueva precarga. Ningún destino roto. Las fuentes y fondos CSS también existen.
- **Schema.org:** 38 bloques JSON-LD parseables; 38 entidades WebPage/ProfilePage representando las 38 páginas, 104 temas Thing, 26 categorías reales, 26 referencias Blog→BlogPosting y 30 relaciones con BreadcrumbList. Los rangos de las propiedades nuevas se contrastaron con el vocabulario oficial de Schema.org obtenido de su repositorio https://github.com/schemaorg/schemaorg/blob/main/data/schema.ttl.
- **Identidad local:** un identificador LegalService, uno WebSite y uno Person compartidos; una única dirección física distinta en El Masnou. Founder reutiliza el identificador de la persona real y explicita Person y su nombre; no crea otra identidad. Alella y Teià únicamente como áreas atendidas.
- **Sitemap/robots:** XML válido, 38 URLs únicas, alternancias coincidentes con HTML, rastreo permitido a Googlebot/Bingbot y bloqueo de GPTBot preservado. Sin cambios en esos archivos.
- **Integridad:** BODY de todas las páginas idéntico al estado anterior después del parseo; títulos, descripciones, metas, canonical y hreflang idénticos. CSS, JS, imágenes y fuentes idénticos byte a byte. Imágenes con ALT y dimensiones reales correctos. No se han cambiado fechas editoriales.
- **Visual:** 76 capturas completas comparadas pixel a pixel a 1280×900 y 390×900: cero diferencias. Geometría de imágenes idéntica y ningún desbordamiento horizontal. Para hacer reproducibles las capturas se desactivaron intervalos de autoplay y animaciones solo en el navegador de prueba; las interacciones/autoplay se comprobaron aparte con el JavaScript original.
- **Funcionamiento:** 331 grupos de comprobaciones. Menú, diálogo de contacto, estado del teléfono en escritorio/móvil, rechazo de cookies y cambio de idioma comprobados en las 38 páginas a ambos tamaños. Configuración y retirada del consentimiento de mapas, carruseles manuales, autoplay y buscador/limpieza/submit del blog ES/CA comprobados adicionalmente. No se activaron llamadas ni se enviaron comunicaciones.
- **Errores:** cero excepciones JS y cero respuestas HTTP locales fallidas. node --check pasa en los cinco JS y git diff --check pasa.
- **Precarga:** Inter se solicita exactamente una vez por documento en las 76 navegaciones. El iniciador pasa de css a link. En estas ejecuciones locales, la mediana de inicio de solicitud fue aproximadamente 48,8 ms antes y 16,0 ms después; no es una medición controlada de Core Web Vitals ni extrapolable a CDmon. La respuesta de la primera carga transfirió los mismos 348980 bytes, incluidas cabeceras, en ambas versiones.
- **Límites:** solicitudes externas bloqueadas, sin acceso a producción. Capturas y scripts de comprobación conservados fuera del repositorio en /tmp/carandell-seo durante esta sesión; los informes de resultados sí forman parte del commit.

## Problemas y oportunidades no aplicados

- Los H1 de portada siguen siendo párrafos largos. Su modificación puede cambiar saltos de línea y composición; no se han tocado.
- No se cambia el texto comercial ni se crean páginas de servicios o municipios. Solo se usarían servicios reales aprobados y contenido local útil; nunca se presentarían oficinas en Alella o Teià.
- No se inventan coordenadas, identificadores de Maps, especialidades, números de colegiación, premios, experiencia ni datos de reseñas. No se añade AggregateRating/Review.
- Las imágenes de recepción usadas por los artículos como imagen social ya existían. Sustituirlas por ilustraciones temáticas requeriría nuevos recursos aprobados; no se ha cambiado ese material.
- Se conserva el comportamiento del selector de idioma como botón y la navegación existente. Hreflang y sitemap proporcionan las equivalencias; no se han añadido elementos visuales ni modificado controles.
- No se minifica/reorganiza CSS ni JavaScript, no se alteran animaciones/carruseles, no se recodifican JPEG con pérdida ni se cambia el formato de imágenes o fuentes. Una prueba de compresión PNG sin modificar originales solo ofrecía ahorros pequeños (hasta 305 bytes por archivo), por lo que se descartó.
- No se aplican redirecciones, reglas .htaccess, compresión o caché del servidor: requieren comprobar CDmon y autorización para una tarea de producción, que esta tarea no incluye.

## RECOMENDACIÓN PENDIENTE DE APROBACIÓN

1. Revisar editorialmente un H1 de portada más breve, centrado de forma natural en el despacho de El Masnou, con una propuesta visual comprobada antes de aplicarlo.
2. Ampliar contenido local visible solo con información real aprobada: ubicación principal El Masnou y atención a clientes de Alella/Teià, sin oficinas ficticias ni repetición de palabras clave.
3. Preparar contenido de servicios o preguntas frecuentes únicamente a partir de servicios realmente confirmados, con revisión jurídica y sin cambiar la arquitectura automáticamente.

## Advertencias y producción

NO VERIFICADO EN PRODUCCIÓN: la configuración de CDmon (índices de directorio, aliases index.html, barras finales, dominio/protocolo, redirecciones y versión realmente servida). No se ha accedido a CDmon ni cambiado su configuración.

Google Maps y Analytics externos no se han solicitado en las pruebas: se comprueba la lógica local de consentimiento y la asignación/bloqueo de la URL del mapa, no el servicio externo. No se certifica indexación efectiva, rich results, rankings ni Core Web Vitals de producción. La precarga tiene evidencia local de descubrimiento anticipado; no garantiza una mejora concreta de LCP o posición.

La comprobación visual utiliza Chromium a 1280 y 390 px; no equivale a probar todos los navegadores/tamaños. Los identificadores compartidos del negocio y la persona se conservan. Repetir sus declaraciones en documentos traducidos no crea oficinas o personas nuevas.

## Revisión y entrega

Los cambios se entregan mediante commit y push exclusivamente a work. No se hace merge a main ni publicación en CDmon. Los dos documentos SEO son para revisión y no necesitan subirse al alojamiento.
