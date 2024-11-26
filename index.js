const express = require("express");
const app = express();
app.use(express.json());
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const PORT = 3000;
app.use(cors(corsOptions));

const corsOptions = {
    origin: "http://localhost:3000", 
};

const verCancion = (req, res, next) => {
    if (!fs.existsSync("./repertorio.json")) {
        fs.writeFileSync("./repertorio.json", "[]");
    }
    next();
};
app.use(verCancion);


const leerCanciones = () => {
    return JSON.parse(fs.readFileSync("./repertorio.json", "utf-8"));
};

const guardarCanciones = (canciones) => {
    fs.writeFileSync("./repertorio.json", JSON.stringify(canciones, null, 2));
};

// Conectar con HTML
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/canciones", (req, res) => {
    try {
        const canciones = leerCanciones();
        res.send(canciones);
    } catch (error) {
        res.send("Error al leer archivo");
    }
});

// Agregar Cancion
app.post("/canciones", (req, res) => {
    const nuevaCancion = req.body;
    const canciones = leerCanciones();
    canciones.push(nuevaCancion);
    guardarCanciones(canciones);
    res.send("Nueva canción agregada con éxito");
});

// Editar Cancion
app.put("/canciones/:id", (req, res) => {
    const {id} = req.params;
    const editarCancion = req.body;
    try {
        const canciones = leerCanciones();
        const index = canciones.findIndex((cancion) => cancion.id == id);
        if (index === -1) {
            return res.send("Canción no encontrada");
        }
        canciones[index] = editarCancion;
        guardarCanciones(canciones);
    } catch (error) {
        res.send("Error al editar canción");
    }
});

// Eliminar Cancion
app.delete('/canciones/:id', (req, res) => {
    const {id} = req.params;
    const canciones = leerCanciones();
    const index = canciones.findIndex((cancion) => cancion.id != id);
    if(index === -1) {
        return res.send('Canción no encontrada');  
    }
    canciones.splice(index, 1);
    guardarCanciones(canciones);
    res.send("Canción eliminada con éxito");
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/`);
});