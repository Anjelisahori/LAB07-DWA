
# 🐾 AuthApp - Sistema de Autenticación con Roles (User/Admin)

Aplicación web desarrollada con **Node.js**, **Express**, **MongoDB** y **EJS**, que permite el registro e inicio de sesión de usuarios con manejo de roles: **usuario estándar** y **administrador**.

---

## 🚀 Tecnologías utilizadas

- **Node.js + Express** → Backend y rutas API  
- **MongoDB + Mongoose** → Base de datos y modelos de usuario  
- **EJS** → Motor de plantillas para vistas  
- **bcrypt** → Encriptación de contraseñas  
- **jsonwebtoken (JWT)** → Autenticación mediante tokens  
- **dotenv + cors** → Configuración de entorno y seguridad  
- **Materialize CSS** → Estilos del frontend  

---

## ⚙️ Configuración inicial

1. Clonar este repositorio:

   ```bash
   git clone https://github.com/tuusuario/AuthApp.git
   cd AuthApp
````

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/authapp
   JWT_SECRET=miclaveultrasecreta
   JWT_EXPIRES_IN=1h
   BCRYPT_SALT_ROUNDS=10
   ```

4. Iniciar el servidor:

   ```bash
   npm start
   ```

   Luego abre en tu navegador:
   👉 [http://localhost:3000](http://localhost:3000)

---

## 🧩 Estructura del proyecto

```
src/
 ├── controllers/
 │    └── AuthController.js
 ├── models/
 │    ├── User.js
 │    └── Role.js
 ├── routes/
 │    ├── auth.routes.js
 │    ├── users.routes.js
 │    └── views.routes.js
 ├── utils/
 │    ├── seedRoles.js
 │    └── seedUsers.js
 ├── views/
 │    ├── auth/
 │    │    ├── signIn.ejs
 │    │    └── signUp.ejs
 │    ├── user/
 │    │    ├── dashboard.ejs
 │    │    └── profile.ejs
 │    └── admin/
 │         └── dashboard.ejs
 └── server.js
```

---

## 👤 Creación de usuarios

### 🔸 Registro desde el formulario

Los usuarios pueden **crear su cuenta directamente** desde la ruta:

👉 [http://localhost:3000/signUp](http://localhost:3000/signUp)

Deberán completar los siguientes campos:

* Nombre
* Apellido
* Teléfono
* Fecha de nacimiento
* Correo electrónico
* Contraseña (mínimo 8 caracteres, con una mayúscula, un número y un carácter especial)
* Dirección *(opcional)*

El nuevo usuario se registrará automáticamente con el **rol `user`**.

---

## 👑 Usuario Administrador

Para ingresar como **Administrador**, ya existe un usuario preconfigurado:

```
Correo: ricardo.admin@example.com
Contraseña: Admin123@
```

Puedes iniciar sesión con estas credenciales desde:

👉 [http://localhost:3000/signIn](http://localhost:3000/signIn)

Al autenticarse con esta cuenta, el sistema detectará el rol **admin** y redirigirá al panel de administrador en la vista:

```
/admin/dashboard
```

---

## 🔐 Endpoints principales (API REST)

| Método | Endpoint           | Descripción                            |
| :----- | :----------------- | :------------------------------------- |
| POST   | `/api/auth/signUp` | Registro de nuevo usuario              |
| POST   | `/api/auth/signIn` | Inicio de sesión con JWT               |
| GET    | `/api/users`       | Listar todos los usuarios (solo admin) |
| GET    | `/api/users/:id`   | Obtener perfil del usuario             |
| GET    | `/dashboard`       | Dashboard protegido (según rol)        |

---

## 🧰 Comandos útiles

| Acción                 | Comando                            |
| :--------------------- | :--------------------------------- |
| Iniciar servidor       | `npm start`                        |
| Ejecutar con nodemon   | `npm run dev`                      |
| Conectar base de datos | Se hace automáticamente al iniciar |

---

## 🧾 Notas finales

* Si el servidor se ejecuta correctamente, verás en consola:

  ```
  ✅ Mongo connected
  🚀 Servidor en http://localhost:3000
  ```

