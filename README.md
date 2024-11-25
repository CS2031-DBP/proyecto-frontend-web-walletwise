[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/9Ycwr4iO)

---

# **WalletWise**

### **Descripción**
**WalletWise** es una aplicación web diseñada para gestionar finanzas personales. Ofrece funcionalidades como la administración de cuentas, categorías, presupuestos, transacciones y reportes financieros, brindando una experiencia intuitiva y eficiente para los usuarios.

---

## **Características principales**
- **Gestión de cuentas**: Creación, edición y eliminación de cuentas con saldos iniciales y diferentes tipos (Ahorro, Corriente, Inversión).
- **Gestión de categorías y subcategorías**: Organización de ingresos y gastos por categorías personalizadas.
- **Gestión de presupuestos**: Configuración de límites financieros por categoría con alertas automáticas.
- **Gestión de transacciones**: Registro de ingresos y gastos asociados a cuentas y categorías.
- **Gestión de reportes**: Generación de reportes financieros permitiendo elegir entre (JSON, PDF, CSV) con detalles de las transacciones.
- **Autenticación y roles**: Acceso seguro con autenticación basada en tokens y soporte para roles como administrador y usuario regular.

---

## **Tecnologías utilizadas**
### **Frontend**
- **React**: Desarrollo de la interfaz de usuario.
- **TypeScript**: Tipado estático para un desarrollo más seguro.
- **Vite**: Herramienta de desarrollo rápido y eficiente.
- **TailwindCSS**: Framework para diseño de interfaces responsivas.
- **React Router**: Configuración de rutas y navegación.

### **Backend**
- **API REST**: Conexión con el backend para operaciones CRUD.
- **Autenticación JWT**: Tokens de acceso para proteger las rutas.
- **Base de datos relacional**: Gestión de datos financieros con soporte para múltiples entidades.

---

## **Requisitos previos**
- Node.js v16+ y npm instalados en tu máquina.
- Backend corriendo en `http://localhost:8080`.

---

## **Instalación y configuración**
1. Clona el repositorio:
   ```bash
   git clone https://github.com/tuusuario/walletwise.git
   cd walletwise
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura el archivo `vite.config.ts` para apuntar al backend:
   ```typescript
   server: {
      proxy: {
         '/api': {
            target: 'http://localhost:8080',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
         },
      },
   },
   ```

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

5. Abre tu navegador en: `http://localhost:5173`.

---

## **Estructura de carpetas**
```plaintext
├── src/
│   ├── components/       # Componentes reutilizables (botones, formularios, etc.)
│   ├── hooks/            # Hooks personalizados (manejo de tokens, etc.)
│   ├── pages/            # Páginas principales (Dashboard, Login, Reportes, etc.)
│   ├── services/         # Conexión con la API
│   ├── styles/           # Archivos de estilo globales
│   └── App.tsx           # Configuración principal de rutas
└── public/               # Archivos estáticos
```

---

## **Rutas principales**
- `/` - Página de inicio.
- `/login` - Inicio de sesión.
- `/signup` - Registro de nuevos usuarios.
- `/dashboard` - Panel principal con acceso a las principales funcionalidades.
- `/admin-dashboard` - Panel exclusivo para administradores.
- `/categories` - Gestión de categorías.
- `/subcategories` - Gestión de subcategorías.
- `/manage-transactions` - Registro y manejo de transacciones.
- `/manage-reports` - Generación y visualización de reportes.
- `/profile` - Perfil de usuario.

---

## **Contribución**
1. Realiza un fork del repositorio.
2. Crea una nueva rama para tu funcionalidad:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza cambios y haz commits:
   ```bash
   git commit -m "Descripción de los cambios"
   ```
4. Envía los cambios a tu fork:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
5. Crea un Pull Request hacia la rama principal del proyecto.

---

## **Licencia**
Este proyecto está licenciado bajo la [MIT License](https://opensource.org/licenses/MIT).

---

## **Developers**
Desarrollado por: Adrian Aaron, Mateo Ismael ,Carla Alejandra,Alejandro Mateo.

---



