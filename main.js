const { app, BrowserWindow, ipcMain, clipboard } = require('electron');
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

ipcMain.handle('buscar-productos', async (event, termino) => {
    try {
        let pool = await sql.connect(dbConfig);
        let request = pool.request();

        let query = `SELECT TOP 20 
                        strReferencia, 
                        strDescripcion, 
                        intCantidad, 
                        intValorUnitario, 
                        strCodigo 
                    FROM tblInventario`;

        if (termino && termino.trim() !== '') {
            const palabras = termino.trim().split(/\s+/);
            const condiciones = [`strReferencia NOT LIKE 'z-%'`];

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

        query += ` ORDER BY intCantidad DESC`;

        const result = await request.query(query);
        return result.recordset;
    } catch (err) {
        console.error("Error en búsqueda:", err);
        return [];
    }
});

ipcMain.handle('search-product', async (event, reference) => {
    try {
        let pool = await sql.connect(dbConfig);
        let request = pool.request();

        request.input('reference', sql.VarChar, `z-${reference}`);

        const query = `SELECT TOP 1 
                        strReferencia, 
                        strDescripcion, 
                        intCantidad, 
                        intValorUnitario, 
                        strCodigo 
                    FROM tblInventario 
                    WHERE strReferencia = @reference`;

        const result = await request.query(query);
        return result.recordset;
    } catch (err) {
        console.error("Error en búsqueda de producto:", err);
        return [];
    }
});

ipcMain.on('copiar-a-portapapeles', (event, texto) => {
    clipboard.writeText(texto);
});

app.whenReady().then(createWindow);