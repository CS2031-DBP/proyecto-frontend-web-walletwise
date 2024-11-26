[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/9Ycwr4iO)

---
# WalletWise

Nuestro sistema de gestión financiera **WalletWise** surge como una solución integral para que los usuarios puedan manejar sus finanzas personales de manera eficiente y controlada. La plataforma no solo permite registrar transacciones financieras de forma simple, sino que también integra una serie de funcionalidades avanzadas que convierten el manejo del dinero en una experiencia dinámica y completamente automatizada.

El sistema permite a los usuarios crear y gestionar cuentas financieras, controlar sus presupuestos, categorizar sus ingresos y gastos, y recibir alertas personalizadas cuando se acercan a sus límites financieros. A diferencia de soluciones tradicionales, hemos optado por un enfoque en tiempo real, donde cada transacción realizada actualiza de inmediato el estado del presupuesto y genera notificaciones automáticas vía correo electrónico.

## Objetivos del Proyecto

- Desarrollar una aplicación que permita a los usuarios gestionar de manera eficiente sus finanzas personales.
- Proporcionar funcionalidades para registrar, categorizar y monitorear transacciones financieras.
- Implementar presupuestos con alertas para que los usuarios controlen mejor sus gastos y no excedan sus límites financieros.
- Ofrecer una experiencia segura mediante autenticación JWT y roles diferenciados para usuarios y administradores.
- Enviar notificaciones por correo para que los usuarios se mantengan informados sobre sus movimientos financieros.
- Facilitar la categorización de transacciones para un análisis detallado de los ingresos y gastos.
- Generar reportes de las transacciones en rangos de fechas para un mejor manejo y seguimiento del dinero del usuario.

## Identificación del Problema o Necesidad

### Descripción del Problema

Muchos usuarios tienen dificultades para gestionar sus finanzas de manera eficiente, lo que puede llevar a un descontrol en sus gastos y, en algunos casos, a endeudamiento. Existen pocas herramientas personalizadas que ofrezcan un seguimiento preciso de los presupuestos asignados y las transacciones realizadas en tiempo real, dificultando el análisis de gastos e ingresos.

### Justificación

La solución es importante porque ofrece a los usuarios una plataforma integral de gestión financiera que, además de registrar sus transacciones, les permite establecer presupuestos y recibir alertas antes de alcanzar sus límites de gasto. Además, ofrece una categorización detallada de ingresos y gastos, lo que ayuda a los usuarios a tomar decisiones informadas sobre sus finanzas. Esta plataforma también facilita el monitoreo de cuentas bancarias y el manejo de presupuestos, mejorando la salud financiera del usuario.

## Descripción de la Solución

### Funcionalidades Implementadas

- **Gestión de Cuentas**: Los usuarios pueden crear y gestionar múltiples cuentas financieras (corriente, ahorro, inversión) y realizar un seguimiento de sus saldos.
- **Registro y Categorización de Transacciones**: Cada transacción se puede asociar a una cuenta específica y a una categoría (como Alimentación, Transporte, etc.), lo que facilita la organización de los gastos y los ingresos.
- **Asignación de Ítems en Transacciones**: Las transacciones permiten desglosar ítems, lo que ofrece un nivel de detalle más alto para el análisis financiero.
- **Presupuestos Personalizados**: Los usuarios pueden definir presupuestos para cada categoría de gasto y recibir alertas cuando están cerca de superar su límite mensual.
- **Notificaciones por Correo Electrónico**: Cada vez que se registra una transacción, el usuario recibe un correo con información detallada de su transacción y una actualización sobre su presupuesto.
- **Autenticación Segura con JWT**: El sistema asegura las cuentas de usuario mediante autenticación con JWT, protegiendo la información personal y financiera.

## Estructura del Proyecto

La aplicación está estructurada en varias carpetas y archivos clave:

- **components**: Contiene componentes reutilizables de la interfaz de usuario.
- **hooks**: Contiene hooks personalizados para lógica compartida.
- **pages**: Contiene las páginas principales de la aplicación.
- **services**: Contiene servicios para interactuar con la API backend.
- **src**: Contiene el archivo principal `App.tsx` y la configuración de Vite.

## Instalación y Ejecución

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/tu-usuario/walletwise.git
   ```

2. **Navega al directorio del proyecto:**

   ```bash
   cd walletwise
   ```

3. **Instala las dependencias:**

   ```bash
   npm install
   ```

4. **Inicia la aplicación:**

   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:3000`.
5. **Configuración del backend:**

El backend está configurado para correr en http://3.208.89.209:8080. Esta URL ya está incluida en el archivo vite.config.ts, donde se define el proxy para redirigir las solicitudes al backend.

## Descripción de Componentes y Páginas

### Components

- **Alert.tsx**: Componente para mostrar mensajes de alerta al usuario. Soporta diferentes tipos de alertas como éxito, error, advertencia e información. Útil para notificar al usuario sobre acciones realizadas o errores.

- **Button.tsx**: Componente de botón reutilizable que soporta diferentes estilos (primario, secundario, peligro) y puede ser personalizado. Facilita la consistencia en los botones de la aplicación.

- **Card.tsx**: Componente de tarjeta para presentar información encapsulada con un título y contenido. Utilizado en diversas páginas para mostrar datos de manera organizada.

- **Footer.tsx**: Componente de pie de página que se muestra en la parte inferior de las páginas. Incluye información de derechos de autor.

- **Header.tsx**: Componente de encabezado que muestra el título de la página y, opcionalmente, un botón para cerrar sesión. Se utiliza para mantener la navegación y el contexto del usuario.

- **InputField.tsx**: Componente de campo de entrada de texto reutilizable con soporte para diferentes tipos (texto, correo, contraseña, etc.). Incluye etiquetas y placeholders.

- **LoadingSpinner.tsx**: Componente para indicar que una operación está en curso. Se muestra durante las operaciones asíncronas como llamadas a la API.

- **Modal.tsx**: Componente modal para mostrar contenido emergente. Se utiliza para formularios de creación y edición sin salir de la página actual.

- **Select.tsx**: Componente de selección desplegable para permitir al usuario elegir una opción de una lista. Soporta opciones dinámicas.

- **TextArea.tsx**: Componente de área de texto para entradas más largas. Utilizado en descripciones y comentarios.

### Hooks

- **useToken.ts**: Hook personalizado para manejar el token de autenticación JWT. Proporciona funciones para obtener y establecer el token, así como sincronizarlo entre pestañas.

### Pages

- **AdminDashboard.tsx**: Panel de administración donde los administradores pueden gestionar la configuración del sistema y la información de los usuarios. Accesible solo para usuarios con rol de administrador.

- **CrearCategoria.tsx**: Página para crear nuevas categorías financieras. Permite a los usuarios personalizar cómo se clasifican sus transacciones.

- **Dashboard.tsx**: Página principal que muestra un resumen de las cuentas y opciones para navegar a diferentes funcionalidades como gestionar transacciones, presupuestos y reportes.

- **EditAccount.tsx**: Página para editar los detalles de una cuenta existente. Permite actualizar información como el nombre, saldo y tipo de cuenta.

- **Home.tsx**: Página de inicio que presenta las principales características de WalletWise y opciones para registrarse o iniciar sesión.

- **Login.tsx**: Página de inicio de sesión para usuarios existentes. Autentica al usuario y establece el token JWT.

- **ManageAccounts.tsx**: Página para gestionar las cuentas financieras del usuario. Muestra una lista de cuentas y opciones para eliminarlas.

- **ManageBudgets.tsx**: Página para crear, editar y eliminar presupuestos. Permite asignar presupuestos a categorías específicas.

- **ManageCategories.tsx**: Página para gestionar categorías financieras. Los usuarios pueden crear, editar y eliminar categorías.

- **ManageItems.tsx**: Página para gestionar los ítems asociados a una transacción. Permite desglosar transacciones en detalles más específicos.

- **ManageReports.tsx**: Página para generar y visualizar reportes financieros. Los usuarios pueden crear reportes en diferentes formatos y para distintos rangos de fechas.

- **ManageSubcategories.tsx**: Página para gestionar subcategorías y asignarlas a categorías principales. Ayuda en una clasificación más detallada de las transacciones.

- **ManageTransactions.tsx**: Página para gestionar las transacciones financieras. Incluye opciones para crear, editar y eliminar transacciones, así como acceder a sus ítems.

- **Profile.tsx**: Página de perfil del usuario donde puede ver y editar su información personal.

- **Signup.tsx**: Página de registro para nuevos usuarios. Permite crear una cuenta proporcionando información básica y credenciales de acceso.

### Services

- **api.ts**: Archivo que centraliza las llamadas a la API del backend. Incluye funciones para autenticación, gestión de cuentas, categorías, subcategorías, transacciones, presupuestos, ítems y reportes.

### Otros Archivos

- **App.tsx**: Archivo principal que define las rutas de la aplicación utilizando `react-router-dom`. Gestiona la navegación entre páginas.

- **vite.config.ts**: Archivo de configuración para Vite. Incluye la configuración del proxy para redirigir las solicitudes de API al backend.

## Licencia

Este proyecto está bajo la Licencia MIT. 

---



