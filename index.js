
```javascript
const http = require('http');
const url = require('url');

// Mini servidor HTTP con rutas básicas
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Configurar headers CORS y Content-Type
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  // Manejo de OPTIONS
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Rutas básicas
  if (pathname === '/' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      mensaje: 'Bienvenido al mini servidor HTTP',
      rutas_disponibles: [
        'GET /',
        'GET /api/productos',
        'GET /api/usuarios',
        'POST /api/datos',
        'GET /saludo?nombre=Juan',
        'GET /error'
      ]
    }, null, 2));
  }

  else if (pathname === '/api/productos' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      productos: [
        { id: 1, nombre: 'Laptop', precio: 1000 },
        { id: 2, nombre: 'Mouse', precio: 25 },
        { id: 3, nombre: 'Teclado', precio: 75 }
      ]
    }, null, 2));
  }

  else if (pathname === '/api/usuarios' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      usuarios: [
        { id: 1, nombre: 'Alice', email: 'alice@example.com' },
        { id: 2, nombre: 'Bob', email: 'bob@example.com' },
        { id: 3, nombre: 'Charlie', email: 'charlie@example.com' }
      ]
    }, null, 2));
  }

  else if (pathname === '/api/datos' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const datos = JSON.parse(body);
        res.writeHead(201);
        res.end(JSON.stringify({
          mensaje: 'Datos recibidos correctamente',
          datos_procesados: datos,
          timestamp: new Date().toISOString()
        }, null, 2));
      } catch {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'JSON inválido' }, null, 2));
      }
    });
  }

  else if (pathname === '/saludo' && req.method === 'GET') {
    const nombre = query.nombre || 'Usuario';
    res.writeHead(200);
    res.end(JSON.stringify({
      saludo: `¡Hola, ${nombre}!`,
      hora: new Date().toLocaleTimeString('es-ES')
    }, null, 2));
  }

  else if (pathname === '/error' && req.method === 'GET') {
    res.writeHead(500);
    res.end(JSON.stringify({
      error: 'Error interno del servidor',
      codigo: 500,
      detalles: 'Esta es una ruta de demostración de errores'
    }, null, 2));
  }

  else {
    res.writeHead(404);
    res.end(JSON.stringify({
      error: 'Ruta no encontrada',
      codigo: 404,
      ruta_solicitada: pathname
    }, null, 2));
  }
});

// Configuración del servidor
const PORT = process.env.PORT || 3000;
const HOSTNAME = 'localhost';

server.listen(PORT, HOSTNAME, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   Mini Servidor HTTP Iniciado              ║
╠════════════════════════════════════════════╣
║ URL: http://${HOSTNAME}:${PORT}
║                                            ║
║ Rutas Disponibles:                         ║
║ • GET  /                                   ║
║ • GET  /api/productos                      ║
║ • GET  /api/usuarios                       ║
║ • POST /api/datos                          ║
║ • GET  /saludo?nombre=Juan                 ║
║ • GET  /error                              ║
║                                            ║
║ Presiona Ctrl+C para detener               ║
╚════════════════════════════════════════════╝
  `);
});

// Manejo de errores del servidor
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Puerto ${PORT} ya está en uso`);
  } else {
    console.error('Error del servidor:', err);
  }
  process.exit(1);
});

// Manejo de señales de terminación
process.on('SIGTERM', () => {
  console.log('\nServidor terminado por SIGTERM');
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nServidor terminado por SIGINT');
  server.close(() => {
    console.log('Servidor cer