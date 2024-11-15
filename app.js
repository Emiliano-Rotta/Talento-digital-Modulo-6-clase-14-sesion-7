const express = require('express')
const fs = require('fs'); //agregar esto
const app = express()
const PORT = 3000
app.use(express.json()); 

const path = './usuarios.json' //agregar esto

//funcion nueva
const leerUsuarios = () =>{
    if(!fs.existsSync(path)){
        fs.writeFileSync(path, JSON.stringify([]))// Si el archivo no existe, lo creamos vacío
    }
    const data = fs.readFileSync(path, "utf-8")
    return JSON.parse(data)
}
//funcion nueva
const escribirUsuario  = (data) =>{
    fs.writeFileSync(path, JSON.stringify(data, null, 2))
}


function validarUsuario(req, res, next) {
    const { nombre, edad } = req.body;
    const keys = Object.keys(req.body); 
    if(keys.length !== 2 || !keys.includes('nombre') || !keys.includes('edad') ){
        return res.status(400).json({ mensaje: 'Solo se permite nombre y edad como propiedades.' });
    }
    if (typeof nombre !== 'string' || typeof edad !== 'number') {
        return res.status(400).json({ mensaje: 'El nombre debe ser un texto y el edad un número.' });
      }

    next();
}

app.get("/usuarios",(req, res)=>{
    const usuarios = leerUsuarios()//agregar esto
    res.send(usuarios)
})

app.post('/usuarios',validarUsuario, (req, res) => {
    const usuarios = leerUsuarios()//agregar esto
    console.log(usuarios) //trae datos viejos

    const { nombre } = req.body;

    //2 metodos para verificar que el nombre no se repita..
    const existeUsuario = usuarios.some(u => u.nombre === nombre);
    if (existeUsuario) {
        return res.status(400).json({ mensaje: "El nombre ya existe, no se puede agregar un usuario duplicado." });
    }
    // for (let i = 0; i < usuarios.length; i++) {
    //     if (usuarios[i].nombre === nombre) {
    //         return res.status(400).json({ mensaje: "El nombre ya existe, no se puede agregar un usuario duplicado." });
    //     }
    // }


    const nuevoUsuario = { id: usuarios.length + 1, ...req.body}; 

    usuarios.push(nuevoUsuario)
    console.log(usuarios) //trae datos nuevos
    escribirUsuario(usuarios) //el usuario con el dato nuevo es el que paso
    res.status(201).json(nuevoUsuario);
})

app.put("/usuarios/:id", validarUsuario, (req, res)=>{
    const usuarios = leerUsuarios()//agregar esto
    const id = parseInt(req.params.id)
    const index = usuarios.findIndex((producto) => producto.id === id);

    if (index !== -1) {
      usuarios[index] = { ...usuarios[index], ...req.body };
      escribirUsuario(usuarios)
      res.json(usuarios[index]);
    } else {
      res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
  });

app.delete("/usuarios/:id",(req, res)=>{
    let usuarios = leerUsuarios();
    const id = parseInt(req.params.id)
    const nuevosUsuarios = usuarios.filter((u) => u.id !== id);

    if (usuarios.length !== nuevosUsuarios.length) {
        escribirUsuario(nuevosUsuarios); // Guardamos la lista actualizada en el archivo
        res.json({ mensaje: `Usuario con ID ${id} eliminado` });

    } else {
        res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
})


app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
})



//------------------------------------------------------------------------------------------------
// Ejercicio 1: Gestión de Libros
// Consigna
// Crea una API REST que permita gestionar una lista de libros. Cada libro debe tener un id, titulo y autor. Implementa las siguientes rutas:

// POST /libros: Agregar un nuevo libro. Valida que solo se envíen titulo (de tipo string) y autor (de tipo string).
// GET /libros: Listar todos los libros.
// PUT /libros/:id: Actualizar el título o el autor de un libro según su id.
// DELETE /libros/:id: Eliminar un libro por su id.

// const express = require('express');
// const app = express();
// app.use(express.json()); //necesario para las rutas post put
// const PORT = 3000

// let libros = [
//     { id: 1, titulo: 'Cien Años de Soledad', autor: 'Gabriel García Márquez' },
//     { id: 2, titulo: 'Don Quijote', autor: 'Miguel de Cervantes' },
// ];

// function validarLibro(req, res, next) {
//     const { titulo, autor } = req.body
//     const keys = Object.keys(req.body)
//     if (keys.length !== 2 || !keys.includes('titulo') || !keys.includes('autor')) {
//         return res.status(400).json({ mensaje: 'Solo se permite titulo y autor como propiedades.' });
//     }
//     if (typeof titulo !== 'string' || typeof autor !== 'string') {
//         return res.status(400).json({ mensaje: 'El titulo y el autor deben ser texto.' });
//     }
//     next();
// }

// app.post('/libros', validarLibro, (req, res) => {
//     const nuevoLibro = { id: libros.length + 1, ...req.body }
//     libros.push(nuevoLibro)
//     res.status(201).json(nuevoLibro)
// })

// app.get('/libros', (req, res) => {
//     res.json(libros)
// })

// app.put('/libros/:id', validarLibro, (req, res) => {
//     const id = parseInt(req.params.id);
//     const index = libros.findIndex((lib) => lib.id === id)
//     if (index !== -1) {
//         libros[index] = { ...libros[index], ...req.body };
//         res.json(libros[index])
//     } else {
//         res.status(404).json({ mensaje: 'Libro no encontrado' });
//     }
// })


// app.delete('/libros/:id', (req, res) => {
//     const id = parseInt(req.params.id);
//     libros = libros.filter((lib) => lib.id !== id)
//     res.json({ mensaje: `Libro con ID ${id} eliminado` });
// })



// app.listen(PORT, () => {
//     console.log(`Servidor corriendo en puerto ${PORT}`)
// })





// Ejercicio 2: Gestión de Cursos
// Consigna
// Crea una API REST para gestionar una lista de cursos. Cada curso debe tener un id, nombre, duracion (en horas). Implementa las siguientes rutas:

// POST /cursos: Agregar un nuevo curso, validando que el nombre (string) y duracion (número) sean correctos.
// GET /cursos: Obtener la lista completa de cursos.
// PUT /cursos/:id: Actualizar el nombre o la duración de un curso mediante su id.
// DELETE /cursos/:id: Eliminar un curso por su id.

// const express = require('express');
// const app = express();
// app.use(express.json()); //necesario para las rutas post put
// const PORT = 3000

// let cursos = [
//     { id: 1, nombre: 'JavaScript Básico', duracion: 40 },
//     { id: 2, nombre: 'Python Avanzado', duracion: 60 },
// ];

// function validarCurso(req, res, next) {
//     const { nombre, duracion } = req.body;
//     const keys = Object.keys(req.body);

//     if (keys.length !== 2 || !keys.includes('nombre') || !keys.includes('duracion')) {
//         return res.status(400).json({ mensaje: 'Solo se permite nombre y duracion como propiedades.' });
//     }

//     if (typeof nombre !== 'string' || typeof duracion !== 'number') {
//         return res.status(400).json({ mensaje: 'El nombre debe ser texto y la duracion un número.' });
//     }

//     next();
// }


// app.post('/cursos', validarCurso, (req, res) => {
//     const nuevoCurso = { id: cursos.length + 1, ...req.body };
//     cursos.push(nuevoCurso);
//     res.status(201).json(nuevoCurso);
// });

// app.get('/cursos', (req, res) => {
//     res.json(cursos);
// });

// app.put('/cursos/:id', validarCurso, (req, res) => {
//     const id = parseInt(req.params.id);
//     const index = cursos.findIndex((curso) => curso.id === id);
//     if (index !== -1) {
//         cursos[index] = { ...cursos[index], ...req.body };
//         res.json(cursos[index]);
//     } else {
//         res.status(404).json({ mensaje: 'Curso no encontrado' });
//     }
// });

// app.delete('/cursos/:id', (req, res) => {
//     const id = parseInt(req.params.id);
//     cursos = cursos.filter((curso) => curso.id !== id);
//     res.json({ mensaje: `Curso con ID ${id} eliminado` });
// });

// app.listen(PORT, () => {
//     console.log(`Servidor corriendo en puerto ${PORT}`)
// })


// Ejercicio 3: Gestión de Empleados
// Consigna
// Crea una API REST para gestionar una lista de empleados. Cada empleado debe tener un id, nombre y puesto. Implementa las siguientes rutas:

// POST /empleados: Agregar un nuevo empleado, validando que se envíen únicamente nombre (string) y puesto (string).
// GET /empleados: Obtener la lista completa de empleados.
// PUT /empleados/:id: Actualizar el nombre o el puesto de un empleado mediante su id.
// DELETE /empleados/:id: Eliminar un empleado por su id.

// express = require('express');
// const app = express();
// app.use(express.json());
// const PORT = 3000

// let empleados = [
//   { id: 1, nombre: 'Carlos Pérez', puesto: 'Desarrollador' },
//   { id: 2, nombre: 'Ana Gómez', puesto: 'Diseñadora' },
// ];

// // Validación de empleado
// function validarEmpleado(req, res, next) {
//   const { nombre, puesto } = req.body;
//   const keys = Object.keys(req.body);

//   if (keys.length !== 2 || !keys.includes('nombre') || !keys.includes('puesto')) {
//     return res.status(400).json({ mensaje: 'Solo se permite nombre y puesto como propiedades.' });
//   }

//   if (typeof nombre !== 'string' || typeof puesto !== 'string') {
//     return res.status(400).json({ mensaje: 'El nombre y el puesto deben ser texto.' });
//   }

//   next();
// }

// // Rutas
// app.post('/empleados', validarEmpleado, (req, res) => {
//   const nuevoEmpleado = { id: empleados.length + 1, ...req.body };
//   empleados.push(nuevoEmpleado);
//   res.status(201).json(nuevoEmpleado);
// });

// app.get('/empleados', (req, res) => {
//   res.json(empleados);
// });

// app.put('/empleados/:id', validarEmpleado, (req, res) => {
//   const id = parseInt(req.params.id);
//   const index = empleados.findIndex((empleado) => empleado.id === id);
//   if (index !== -1) {
//     empleados[index] = { ...empleados[index], ...req.body };
//     res.json(empleados[index]);
//   } else {
//     res.status(404).json({ mensaje: 'Empleado no encontrado' });
//   }
// });

// app.delete('/empleados/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   empleados = empleados.filter((empleado) => empleado.id !== id);
//   res.json({ mensaje: `Empleado con ID ${id} eliminado` });
// });

// app.listen(PORT, () => {
//     console.log(`Servidor corriendo en puerto ${PORT}`)
// })