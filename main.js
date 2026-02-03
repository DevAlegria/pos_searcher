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
        let query = `SELECT TOP 10 strReferencia, strDescripcion, intCantidad FROM tblInventario`;

        if (termino) {
            query += ` WHERE strReferencia LIKE @p OR strDescripcion LIKE @p`;
        }

        const result = await pool.request()
            .input('p', sql.VarChar, `%${termino}%`)
            .query(query);

        return result.recordset;
    } catch (err) {
        console.error(err);
        return [];
    }
});

app.whenReady().then(createWindow);