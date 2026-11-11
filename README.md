# Panel de monitoreo de servidores

Página web de demostración para visualizar y administrar de forma básica una infraestructura de servidores en la nube. El panel reúne métricas ilustrativas, una tabla de instancias y controles de configuración y reinicio.

## Contenido

- **Navegación:** menú lateral con accesos al panel, servidores, métricas y configuración. En pantallas pequeñas, el menú se abre con el botón ☰.
- **Resumen de infraestructura:** tarjetas con una gráfica ilustrativa de uso de CPU y RAM, disponibilidad del clúster, tráfico de red e instancias activas.
- **Registro de servidores:** tabla con nombre, dirección IP, región, estado y acciones. El campo de búsqueda filtra por nombre o IP.
- **Configuración:** panel lateral para editar un alias, añadir notas de mantenimiento, elegir una fecha de revisión y región, y activar el modo de mantenimiento automático.
- **Confirmación de reinicio:** diálogo de confirmación antes de ejecutar la acción sobre una instancia.
- **Tema y accesibilidad:** alternancia entre tema claro y oscuro, diseño adaptable, etiquetas accesibles y controles de teclado para los diálogos.

## Tecnologías

- HTML5 para la estructura y los formularios.
- CSS3 para los estilos, el diseño adaptable, las tarjetas y los temas.
- JavaScript nativo para las interacciones del menú, la búsqueda, los diálogos y los formularios.

## Archivos

- `Interfaces.html`: estructura y contenido de la página.
- `Estilo_3.css`: estilos y diseño adaptable.
- `Estilo.js`: comportamiento interactivo.

Los archivos CSS y JavaScript se cargan desde `Interfaces.html`; deben permanecer en la misma carpeta para que las referencias funcionen.

## Cómo abrir

Abre `Interfaces.html` directamente en un navegador moderno. No requiere instalación de dependencias ni servidor web.

## Alcance de la demostración

Los indicadores y las filas de servidores son datos estáticos de ejemplo. Las acciones de guardar y reiniciar muestran una confirmación simulada en el navegador; no se conectan a servidores reales ni a una API.
