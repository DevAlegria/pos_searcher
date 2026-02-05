const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sql = require('mssql');

require('dotenv').config();

// Configuración de tu DB
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

async function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'src/preload.js')
        }
    });

    win.loadFile('src/renderer/index.html');
}

// Escuchador de peticiones del Frontend
ipcMain.handle('buscar-productos', async (event, termino) => {
    try {
        let pool = await sql.connect(dbConfig);
        let request = pool.request();
        
        // Base de la consulta
        let query = `SELECT TOP 20 
                        strReferencia, 
                        strDescripcion, 
                        intCantidad, 
                        intPrecio, 
                        strCodigo 
                    FROM tblInventario`;

        if (termino && termino.trim() !== '') {
            // 1. Limpiamos y separamos el término por espacios
            // Ejemplo: "kit eco honda" -> ["kit", "eco", "honda"]
            const palabras = termino.trim().split(/\s+/);
            
            // 2. Construimos el WHERE dinámico
            // La primera palabra debe coincidir al inicio (según tu requerimiento)
            // Las demás pueden estar en cualquier parte.
            const condiciones = [];
            
            palabras.forEach((palabra, index) => {
                const paramName = `p${index}`;
                if (index === 0) {
                    // Primera palabra: debe empezar con...
                    request.input(paramName, sql.VarChar, `${palabra}%`);
                    condiciones.push(`(strDescripcion LIKE @${paramName} OR strReferencia LIKE @${paramName})`);
                } else {
                    // Siguientes palabras: en cualquier parte
                    request.input(paramName, sql.VarChar, `%${palabra}%`);
                    condiciones.push(`(strDescripcion LIKE @${paramName} OR strReferencia LIKE @${paramName})`);
                }
            });

            query += ` WHERE ` + condiciones.join(' AND ');
        }

        // 3. Ordenamos por cantidad (De mayor a menor disponibilidad)
        query += ` ORDER BY intCantidad DESC`;

        const result = await request.query(query);
        return result.recordset;
    } catch (err) {
        console.error("Error en búsqueda:", err);
        return [];
    }
});

app.whenReady().then(createWindow);