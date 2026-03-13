
<div style="display:flex; width=100%; justify-content: center;">
    <img src="./assets/VoxPopuli.png" alt="logo" width="350" height="350" style="border-radius: 30%;"/>
</div>
<br>

# <p style="text-align: center; font-size: larger;">VoxPopuli 🗣️📣</p>

Una aplicacion de votacion para Android realizada para un final del instituto.

### Tabla de contenidos

- [Resumen](#resumen)
- [Uso](#uso)
  - [Iniciar sesión y registrarse](#iniciar-sesión-y-registrarse)
  - [Perfil](#perfil)
  - [Creación de encuestas](#creación-de-encuestas)
  - [Búsqueda de encuestas](#búsqueda-de-encuestas)
  - [Votación](#votación)
  - [Resultados](#resultados)
- [Stack Tecnológico](#stack-tecnológico)
- [Configuración](#configuración)
  - [Instalación](#instalación)
  - [Ejecución](#ejecución)
- [Muchas Gracias](#muchas-gracias)

# Resumen

**VoxPopuli** es una aplicación de votaciones en tiempo real construida con **React Native**, **Typescript** y **Expo**. Permite a los usuarios **crear encuestas, votar y visualizar resultados en tiempo real** mediante gráficos.

## Uso

### Iniciar Sesión y Registrarse

La aplicación comienza con un formulario de inicio de sesión que permite al usuario ingresar mediante:

- Email o nombre de usuario
- Contraseña

Debajo de este formulario se encuentra un enlace que permite **crear una nueva cuenta.**

Para registrarse en la aplicación se deben completar los siguientes campos:

- Nombre de usuario
- Email
- Contraseña
- Repetir la contraseña

Si ocurre algún error al completar cualquiera de estos formularios, se mostrará un **mensaje indicando el problema** para que el usuario pueda corregirlo.

### Perfil

La aplicación cuenta con un **perfil de usuario** donde se muestran las **encuestas creadas por ese usuario.** 
Si el perfil pertenece al usuario actualmente autenticado, también funcionará como **menú de navegación**, desde donde se puede:

- Crear nuevas encuestas
- Buscar encuestas existentes

### Creación de encuestas

Para crear una encuesta se deben completar los siguientes datos:

- Título
- Descripción
- Opciones de respuesta
- Fecha de inicio
- Fecha de finalización

### Búsqueda de encuestas

Las encuestas se pueden buscar mediante una **barra de búsqueda.** 
Debajo de la barra se encuentran **filtros** que permiten especificar la búsqueda según:

- El estado de la encuesta (activa, finalizada o en espera.)
- Ordenar los resultados según la fecha de creación de la encuesta.

#### Resultados

Los resultados de la busqueda tienen un limite de 5, si la cantidad total de resultados supera la cantidad limite se podra buscar más resultados presionado un boton que aparece al final de la lista de resultados.

### Votación

Los usuarios pueden **votar en una encuesta** seleccionando una opción y confirmando la acción.

Una vez realizado el voto:

- **No se puede modificar**
- **No se puede eliminar**

Esto garantiza la **integridad de los resultados.**

### Resultados

Existe una sección que **permite visualizar los resultados en tiempo real.**

Los resultados pueden mostrarse mediante:

- **Gráficos de barras**
- **Gráficos circulares**

## Stack Tecnológico

- **React Native** — 0.83.2
- **Expo** — ^55.0.4
- **TypeScript** — ~5.9.2
- **React Native Paper** — 5.14.5
- **React Navigation** — 7.3.26
- **Supabase** — 2.75.0 
  - Backend como servicio (autenticación, base de datos)

# Configurar

## Instalación

1. Clona el repositorio y navega a la carpeta del proyecto.

```bash
git clone https://github.com/Alejoqest/VoxPopuli-Fork
```

2. Navega a la carpeta del proyecto.

```bash
cd VoxPopuli-Fork
```

3. Ejecuta el siguiente comando para instalar las dependencias:

```bash
npm install
```

4. Crear el archivo `.env` en la carpeta principal del proyecto y agregar las siguientes variables de entorno.

```env
EXPO_PUBLIC_SUPABASE_URL=supabase-url
EXPO_PUBLIC_SUPABASE_KEY=supabse-key
```

## Ejecución

### Servidor de desarrollo

```bash
npm start
```

### Para Android

```bash
npm run android
```

# Muchas Gracias!

Espero que este proyecto sea útil para cualquier persona que esté leyendo esto.  
Gracias por tomarse el tiempo de revisar y explorar **VoxPopuli**.  

-- A