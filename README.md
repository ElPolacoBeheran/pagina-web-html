# Portfolio (GitHub Pages)

Estructura: `/es` y `/en` (inicio con contacto + 3 proyectos más recientes), `/proyects` (todos los proyectos), `/proyects/fullproyect/<slug>/` (página completa de cada proyecto).

## Agregar un proyecto
1. Creá `proyects/thumbnails/<slug>/` con una imagen de portada (`cover.png`, `cover.jpg`, `cover.svg`...) y un `thumbnail.json`:
   ```json
   {
     "title": "Mi proyecto",
     "description": { "es": "Descripción breve.", "en": "Short description." },
     "github": "https://github.com/usuario/repo",
     "page": "https://web-externa.com",
     "date": "2026-10-20"
   }
   ```
2. Botón **Page**: si creás `proyects/fullproyect/<slug>/index.html` apunta ahí solo; si ponés `page` con una URL, apunta a esa; si no hay ninguna, queda deshabilitado. El botón **Git hub** usa `github`.
3. "Más recientes": se ordena por `date`; si no la ponés, usa la fecha en que la carpeta se agregó a git.
4. Push a `main`: la Action regenera `projects.json` y publica. (`hidden: true` oculta un proyecto.)

## Configurar
- `site.json`: nombre, textos y contacto. whatsapp, instagram y cv aceptan URL completa o número/usuario. Si omitís un campo (ej. phone o email), ese ícono no aparece.
- CV: ya apunta a tu PDF online; podés usar `{ "es": "...", "en": "..." }` para uno por idioma.
- Colores: variables `--orange`, `--bg`, `--edge` en `assets/style.css`.
- GitHub: Settings > Pages > Source: **GitHub Actions**.

## Probar local
```
node scripts/build.mjs
npx serve .
```
