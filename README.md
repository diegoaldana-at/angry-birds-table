# El Flock - Angry Birds

Una aplicación web desarrollada con Astro, TypeScript y Tailwind CSS para gestionar un rebaño ("Flock") de jugadores, calculando su "Ratio" basado en sus Puntos y Poder, y permitiendo la exportación de una tabla de clasificación (ranking) como imagen.

## Características

- **Gestión de Jugadores**: Añade, edita y elimina jugadores del Flock de manera rápida y sencilla.
- **Cálculo y Ranking**: El sistema ordena automáticamente a los jugadores en función de sus estadísticas (Puntos, Poder y Ratio).
- **Filtro y Limpieza**: Búsqueda en tiempo real por nombre de jugador y una opción de "Vaciar flock" para limpieza masiva.
- **Exportación a Imagen**: Genera una vista de la tabla en Canvas para previsualizar los resultados y descargarlos en formato de imagen (`.png`).
- **Persistencia Local**: Los datos de los jugadores se almacenan en el almacenamiento local (`localStorage`) del navegador.
- **Diseño Responsivo**: Adaptado para una experiencia de usuario óptima en la vista móvil y escritorio.

## Tecnologías Utilizadas

- **[Astro](https://astro.build/)**: Estructura de la aplicación web y componentes estáticos rápidos.
- **[TypeScript](https://www.typescriptlang.org/)**: Tipado estricto en el dominio y los controladores de la aplicación.
- **[Tailwind CSS](https://tailwindcss.com/)**: Interfaz y diseño modular.
- **HTML5 Canvas API**: Utilizado para dibujar y generar la tabla como un archivo de imagen descargable.

## Instalación y Configuración

Asegúrate de tener [Node.js](https://nodejs.org/) y [pnpm](https://pnpm.io/) instalados.

1. **Clona este repositorio:**
   ```bash
   git clone https://github.com/diegoaldana-at/angry-birds-table.git
   cd angry-birds-table
   ```

2. **Instala las dependencias:**
   ```bash
   pnpm install
   ```

3. **Inicia el servidor de desarrollo:**
   ```bash
   pnpm dev
   ```
   *La aplicación estará disponible localmente, por defecto en `http://localhost:4321`.*

4. **Compilar para producción:**
   ```bash
   pnpm build
   ```
   *Los archivos optimizados para producción se generarán en la carpeta `dist/`.*
