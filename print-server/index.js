const express = require('express');
const cors = require('cors');
const { SerialPort } = require('serialport');
require('dotenv').config();

const app = express();
app.use(cors());
// Permitimos enviar arrays de bytes un poco grandes
app.use(express.json({ limit: '10mb' }));

const portName = process.env.PRINTER_PORT || 'COM3';
const baudRate = parseInt(process.env.BAUD_RATE || '9600');

// ── RUTA PRINCIPAL PARA IMPRIMIR ──────────────────────────────────────────────
app.post('/print', (req, res) => {
  const { data } = req.body;
  
  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ error: 'Faltan los datos de impresión (array de números)' });
  }

  // Abrir la conexión con la impresora
  const port = new SerialPort({ path: portName, baudRate: baudRate }, (err) => {
    if (err) {
      console.error('❌ Error abriendo el puerto:', err.message);
      return res.status(500).json({ error: 'Error abriendo el puerto COM. ¿La impresora está conectada y encendida?', details: err.message });
    }
  });

  // Convertir el array de números (bytes) que nos manda React a un Buffer de Node.js
  const buffer = Buffer.from(data);
  
  port.write(buffer, (err) => {
    if (err) {
      console.error('❌ Error escribiendo en el puerto:', err.message);
      port.close();
      return res.status(500).json({ error: 'Error enviando datos a la impresora' });
    }
    
    console.log(`✅ ${buffer.length} bytes impresos exitosamente en el puerto ${portName}`);
    
    // drain() espera a que todo el buffer haya salido físicamente por el cable USB antes de cerrar
    port.drain(() => {
      port.close();
      res.json({ success: true, message: 'Impresión exitosa' });
    });
  });
});

// ── RUTA DE AYUDA PARA LISTAR LOS PUERTOS COM DISPONIBLES ─────────────────────
app.get('/ports', async (req, res) => {
  try {
    const ports = await SerialPort.list();
    res.json(ports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\n=============================================================`);
  console.log(`🖨️  MICRO-SERVICIO DE IMPRESIÓN INICIADO`);
  console.log(`=============================================================`);
  console.log(`🌐 Escuchando órdenes en: http://localhost:${PORT}/print`);
  console.log(`🔌 Impresora configurada: ${portName} a ${baudRate} baudios\n`);
});
