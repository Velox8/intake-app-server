const dotenv = require('dotenv');
dotenv.config();

const mysql = require('mysql2');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const http = require('https');
const httpProxy = require('http-proxy');
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'https://sprightly-tulumba-2baacf.netlify.app');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     if (req.method === 'OPTIONS') {
//         res.sendStatus(200);
//     } else {
//         next();
//     }
// });
const port = process.env.PORT || 3000;

// const PORT = 5000;
// app.listen(PORT, () => {
// 	console.log(`Server is running on port ${PORT}`);
// });

app.use(cors());

app.use(express.json());
app.use(helmet());

function customCors(req, res, next) {
	// Adres, z którego chcesz zezwolić na żądania (możesz zmienić ten adres)
	// const allowedOrigin = 'https://maksymilianliczy.netlify.app';
	const allowedOrigin = 'http://localhost:3000';

	// Sprawdź, czy żądanie pochodzi z dozwolonego adresu
	const requestOrigin = req.headers.origin;
	if (requestOrigin === allowedOrigin) {
		res.setHeader('Access-Control-Allow-Origin', requestOrigin);
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
		res.setHeader(
			'Access-Control-Allow-Headers',
			'Content-Type, Authorization'
		);
	}

	// Obsługa żądań OPTIONS (preflight requests)
	if (req.method === 'OPTIONS') {
		res.writeHead(200);
		res.end();
		return;
	}

	next(); // Kontynuuj przetwarzanie żądania
}

// Użycie naszego własnego middleware CORS
app.use(customCors);

// const allowedOrigin = process.env.REACT_APP_BACKEND_URL

// app.use(cors({
//   origin: [process.env.REACT_APP_BACKEND_URL],
// }));
// app.use(express.json()); // Parsowanie danych jako JSON
// app.use(helmet()); // Dodanie zabezpieczeń Helmet
// app.use(
//   cors({
//     origin: process.env.REACT_APP_BACKEND_URL,
//     methods: ['GET', 'POST'], // Dozwolone metody
//     allowedHeaders: ['Content-Type', 'Authorization'], // Dozwolone nagłówki
//   })
// );
// app.options('/addTask', cors());
// app.options('/register', cors());
// app.options('/odbierzDane', cors());
// app.options('/test', cors());

// app.options("/register", (req, res) => {
//   res.header("Access-Control-Allow-Origin", allowedOrigin);
//   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.send();
// });

// app.options("/odbierzDane", (req, res) => {
//   res.header("Access-Control-Allow-Origin", allowedOrigin);
//   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.send();
// });
// app.post("/odbierzDane", (req, res) => {
//   const receivedData = req.body.data;
//   console.log("Otrzymane dane:", receivedData);

//   const responseMessage = "Dane odebrane pomyślnie";
//   res.status(200).json({ message: responseMessage });
// });

// Obsługa proxy dla zewnętrznego zasobu - tu jest poprawka
// const proxy = httpProxy.createProxyServer();
// app.use('/proxy', (req, res) => {
//   proxy.web(req, res, { target: 'http://localhost:3000' });
// });

// const proxy = httpProxy.createProxyServer();
// app.options('/register', (req, res) => {
// 	res.header('Access-Control-Allow-Origin', 'https://sprightly-tulumba-2baacf.netlify.app');
// 	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
// 	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
// 	res.send(); // Odpowiedź pusta dla zapytań OPTIONS
//   });
// app.use(cors({
//   origin: 'https://sprightly-tulumba-2baacf.netlify.app',
//   methods: ['GET', 'POST', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'application/json'],

//   credentials: true,
// }));

// app.use('/test', (req, res) => {
//   proxy.web(req, res, { target: 'http:/localhost:3000' });
// });
// app.get('/test', (req, res) => {
// 	const testUrl = 'https://sprightly-tulumba-2baacf.netlify.app';

// 	// Wykonaj żądanie GET za pomocą modułu http
// 	http.get(testUrl, (response) => {
// 		let data = '';

// 		response.on('data', (chunk) => {
// 			data += chunk;
// 		});

// 		response.on('end', () => {
// 			console.log('Odpowiedź z serwera testUrl:', data);
// 			res.send(data); // Odeślij odpowiedź do klienta Express
// 		});
// 	}).on('error', (error) => {
// 		console.error('Błąd podczas połączenia z testUrl:', error);
// 		res.status(500).send('Błąd podczas pobierania danych'); // Odeślij błąd do klienta Express
// 	});
// });
// app.use(
// 	'/proxy',
// 	createProxyMiddleware({
// 		target: 'https://sprightly-tulumba-2baacf.netlify.app',
// 		changeOrigin: true,
// 		pathRewrite: {
// 			'^/proxy': '',
// 		},
// 		secure: false, // Jeśli adres docelowy używa HTTPS
// 	})
// );

// Endpoint '/test' w twojej aplikacji serwerowej

// app.use((req, res, next) => {
// 	res.header('Access-Control-Allow-Origin', 'https://nodejsclusters-158150-0.cloudclusters.net');
// 	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
// 	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
// 	res.header('Access-Control-Allow-Credentials', 'true');
// 	next();
//   });
// const db = mysql.createConnection({
// 	host: 'mysql-157993-0.cloudclusters.net',
// 	port: 10039,
// 	user: 'admin',
// 	password: 'AgLEorrf',
// 	database: 'products',
// });
// const db = mysql.createConnection({
// 	host: 'host491364.hostido.net.pl',
// 	// port: 21,
// 	user: 'host491364_products',
// 	password: 'Panpascal69',
// 	database: 'host491364_products',
// });
const db = mysql.createConnection({
	host: 'viaduct.proxy.rlwy.net',
	port: 47341,
	user: 'root',
	password: '4G2BdHHBfC3B214AcBb4cCC4hdD66h1C',
	database: 'railway',
});
db.connect((err) => {
	if (err) {
		console.error('Błąd podczas nawiązywania połączenia z bazą danych:', err);
		return;
	}
	console.log('Połączono z bazą danych MySQL!');

	const setGlobalQuery = 'SET GLOBAL host_cache_size=0';
	db.query(setGlobalQuery, (err, results) => {
		if (err) {
			console.error('Błąd podczas wykonywania polecenia SET GLOBAL:', err);
			return;
		}

		console.log('Pomyślnie wykonano polecenie SET GLOBAL host_cache_size=0');
	});
});
// app.get('/test', async (req, res) => {
// 	try {
// 		const testUrl = 'https://maksymalnytrener.pl/';
// 		const response = await fetch(testUrl);
// 		const data = await response.text();
// 		console.log('Odpowiedź z serwera:', data);
// 		res.send('Odpowiedź na zapytanie GET na /test');
// 	} catch (error) {
// 		console.error('Błąd podczas połączenia:', error);
// 		res.status(500).send('Błąd podczas pobierania danych');
// 	}
// });

// const testUrl = 'https://maksymalnytrener.pl/';

// https
// 	.get(testUrl, (response) => {
// 		let data = '';
// 		response.on('data', (chunk) => {
// 			data += chunk;
// 		});

// 		response.on('end', () => {
// 			console.log('Odpowiedź z serwera:', data);
// 		});
// 	})
// 	.on('error', (error) => {
// 		console.error('Błąd podczas połączenia:', error);
// 	});

// const url = 'https://maksymalnytrener.pl';

// https
// 	.get(url, (response) => {
// 		let data = '';
// 		response.on('data', (chunk) => {
// 			data += chunk;
// 		});

// 		response.on('end', () => {
// 			console.log('Odpowiedź z serwera:', data);
// 		});
// 	})
// 	.on('error', (error) => {
// 		console.error('Błąd podczas połączenia:', error);
// 	});

app.get('/getProducts/:username', (req, res) => {
	const username = req.params.username;
	const userToken = req.headers.authorization.split(' ')[1];

	try {
		const decoded = jwt.verify(userToken, secretKey);
		console.log('Decoded token:', decoded);

		if (decoded.username !== username) {
			console.log('Authorization failed or mismatched username.');
			return res.status(401).json({ message: 'Unauthorized' });
		}

		console.log('Username from URL:', username);
		console.log('User token from headers:', req.headers.authorization);

		db.query(
			'SELECT * FROM products WHERE username = ?',
			[username],
			(err, rows) => {
				if (err) {
					console.error(err.message);
					res.status(500).send('Error fetching productLibrary from database');
				} else {
					console.log('ProductLibrary fetched:', rows);
					res.status(200).json(rows);
				}
			}
		);
	} catch (error) {
		console.error('Token verification error:', error);
		res.status(401).json({ message: 'Unauthorized' });
	}
});

app.options('/addProduct', cors());

app.post('/addProduct', (req, res) => {
	const { username, name, category, calories, proteins } = req.body;

	if (!name || !category || !calories || !proteins) {
		return res.status(400).json({ error: 'Missing required fields' });
	}

	const sql = `INSERT INTO products (username, name, category, calories, proteins) VALUES (?, ?, ?, ?, ?)`;
	db.query(
		sql,
		[username, name, category, calories, proteins],
		(err, result) => {
			if (err) {
				console.error(err.message);
				return res.status(500).send('Error adding product to the database');
			}
			res.status(200).send('Product added to the database');
		}
	);
});
// app.delete('/deleteProduct/:productId', (req, res) => {
// 	const productId = req.params.productId;

  
// 	const userToken = req.headers.authorization;

// 	console.log('Received user token:', userToken); // Console log otrzymanego tokenu

// 	// Funkcja sprawdzająca poprawność tokenu JWT
// 	function userTokenIsValid(token) {
// 		try {
// 			const decoded = jwt.verify(token.replace('Bearer ', ''), secretKey);
// 			console.log('Decoded token:', decoded); // Console log zdekodowanego tokenu
// 			return decoded;
// 		} catch (err) {
// 			return false;
// 		}
// 	}
// 	if (!userTokenIsValid(userToken)) {
// 		return res.status(401).json({ message: 'Brak autoryzacji.' });
// 	}
  
// 	const deleteProductQuery = `DELETE FROM products WHERE id = ${productId}`;
  
// 	db.query(deleteProductQuery, (error, results) => {
// 	  if (error) {
// 		console.error('Błąd podczas usuwania produktu:', error);
// 		return res.status(500).json({ message: 'Wystąpił błąd podczas usuwania produktu' });
// 	  }
  
// 	  if (results.affectedRows === 0) {
// 		return res.status(404).json({ message: 'Produkt nie znaleziony' });
// 	  }
  
// 	  return res.status(200).json({ message: 'Produkt został usunięty' });
// 	});
//   });

app.delete('/deleteProduct/:username/:productName', (req, res) => {
	const username = req.params.username;
	const productName = req.params.productName;
	const userToken = req.headers.authorization;
  
	console.log('Received user token:', userToken); // Console log otrzymanego tokenu
  
	// Funkcja sprawdzająca poprawność tokenu JWT
	function userTokenIsValid(token) {
	  try {
		const decoded = jwt.verify(token.replace('Bearer ', ''), secretKey);
		console.log('Decoded token:', decoded); // Console log zdekodowanego tokenu
		return decoded;
	  } catch (err) {
		return false;
	  }
	}
  
	if (!userTokenIsValid(userToken)) {
	  return res.status(401).json({ message: 'Brak autoryzacji.' });
	}
  
	const deleteProductQuery = `DELETE FROM products WHERE username = ? AND name = ?`;
  
	db.query(deleteProductQuery, [username, productName], (error, results) => {
	  if (error) {
		console.error('Błąd podczas usuwania produktu:', error);
		return res.status(500).json({ message: 'Wystąpił błąd podczas usuwania produktu' });
	  }
  
	  if (results.affectedRows === 0) {
		return res.status(404).json({ message: 'Produkt nie znaleziony' });
	  }
  
	  return res.status(200).json({ message: 'Produkt został usunięty' });
	});
  });
  
// Pozostała część kodu bez zmian

db.connect((err) => {
	if (err) {
		console.error('Błąd połączenia z bazą danych', err);
	} else {
		console.log('Połączenie z bazą danych MySQL udane!');
	}
});

app.get('/allTasks/:username', (req, res) => {
	const username = req.params.username;
	const userToken = req.headers.authorization.split(' ')[1];

	try {
		const decoded = jwt.verify(userToken, secretKey);
		if (decoded.username !== username) {
			console.log('Authorization failed or mismatched username.');
			return res.status(401).json({ message: 'Unauthorized' });
		}

		console.log('Username from URL:', username);
		console.log('User token from headers:', req.headers.authorization);

		db.query(
			'SELECT * FROM tasks WHERE username = ?',
			[username],
			(err, rows) => {
				if (err) {
					console.error(err.message);
					res.status(500).send('Error fetching tasks from database');
				} else {
					console.log('Tasks fetched:', rows);
					res.status(200).json(rows);
				}
			}
		);
	} catch (error) {
		console.error('Token verification error:', error);
		res.status(401).json({ message: 'Unauthorized' });
	}
});

// app.post('/register', (req, res) => {
// 	const { username, password, email } = req.body;

// 	const payload = {
// 		username: username,
// 		email: email,
// 	};
// 	const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

// 	const sql = `INSERT INTO users (username, password, email, token) VALUES (?, ?, ?, ?)`;
// 	db.query(sql, [username, password, email, token], (err, result) => {
// 		if (err) {
// 			console.error('Błąd podczas rejestracji użytkownika:', err);
// 			return res
// 				.status(500)
// 				.json({ message: 'Błąd podczas rejestracji użytkownika.' });
// 		}
// 		console.log('Użytkownik został zarejestrowany:', { username, email });
// 		res
// 			.status(201)
// 			.json({ message: 'Użytkownik został zarejestrowany.', token: token });
// 	});
// });

app.post('/login', (req, res) => {
	const { username, password } = req.body;

	const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
	db.query(sql, [username, password], (err, results) => {
		if (err) {
			console.error('Błąd podczas logowania:', err);
			return res.status(500).json({ message: 'Błąd logowania.' });
		}

		if (results.length === 0) {
			return res.status(401).json({ message: 'Nieprawidłowe dane logowania.' });
		}

		const row = results[0];
		const payload = {
			username: row.username,
			email: row.email,
		};
		const token = jwt.sign(payload, secretKey, { expiresIn: '5h' });

		const updateTokenQuery = `UPDATE users SET token = ? WHERE id = ?`;
		db.query(updateTokenQuery, [token, row.id], (err, result) => {
			if (err) {
				console.error('Błąd podczas aktualizacji tokenu:', err);
				return res.status(500).json({ message: 'Błąd logowania.' });
			}

			console.log('Użytkownik zalogowany:', {
				username: row.username,
				email: row.email,
			});
			res
				.status(200)
				.json({ message: 'Zalogowano użytkownika.', token: token });
		});
	});
});
const crypto = require('crypto');
const { create } = require('domain');

// Generowanie klucza tajnego o długości 64 bajtów
const secretKey = crypto.randomBytes(32).toString('hex');
console.log('Wygenerowany klucz tajny:', secretKey);
const createUserTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    token TEXT
  )
`;

const createTasksTableQuery = `
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255),
    name TEXT NOT NULL,
    category TEXT,
    date TEXT,
    grams INTEGER,
    calories INTEGER,
    proteins INTEGER,
    productWholeCalories INTEGER,
	FOREIGN KEY (username) REFERENCES users(username)
  )
`;

const createProductsTableQuery = `
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255),
    name TEXT NOT NULL,
    category TEXT,
    calories INTEGER,
    proteins INTEGER,
	FOREIGN KEY (username) REFERENCES users(username)
  )
`;

db.query(createUserTableQuery, (err, result) => {
	if (err) {
		console.error('Błąd podczas tworzenia tabeli users:', err);
	} else {
		console.log('Tabela users utworzona pomyślnie.');
	}
});

db.query(createTasksTableQuery, (err, result) => {
	if (err) {
		console.error('Błąd podczas tworzenia tabeli tasks:', err);
	} else {
		console.log('Tabela tasks utworzona pomyślnie.');
	}
});

db.query(createProductsTableQuery, (err, result) => {
	if (err) {
		console.error('Błąd podczas tworzenia tabeli products:', err);
	} else {
		console.log('Tabela products utworzona pomyślnie.');
	}
});

// app.post('/register', (req, res) => {
// 	const { username, password, email } = req.body;

// 	const token = jwt.sign({ username, email }, secretKey, { expiresIn: '1h' });

// 	const sql = `INSERT INTO users (username, password, email, token) VALUES (?, ?, ?, ?)`;
// 	db.run(sql, [username, password, email, token], (err) => {
// 		if (err) {
// 			console.error('Błąd podczas rejestracji użytkownika:', err);
// 			return res
// 				.status(500)
// 				.json({ message: 'Błąd podczas rejestracji użytkownika.' });
// 		}
// 		console.log('Użytkownik został zarejestrowany:', { username, email });
// 		res
// 			.status(201)
// 			.json({ message: 'Użytkownik został zarejestrowany.', token });
// 	});
// 	console.log('Received POST request:', req.body); // Logowanie danych żądania
//   res.send('Response from server')
// });
const { createProxyMiddleware } = require('http-proxy-middleware');

app.use(helmet());
app.use(express.json());
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', allowedOrigin); // Zmodyfikuj na właściwy adres Twojego localhost
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     if (req.method === 'OPTIONS') {
//       res.sendStatus(200); // Odpowiedź 200 na żądania OPTIONS
//     } else {
//       next(); // Przejdź do kolejnego middleware'u dla innych rodzajów żądań
//     }
//   });
//   app.use('/api', createProxyMiddleware({
// 	target: process.env.REACT_APP_BACKEND_URL,
// 	changeOrigin: true,
//   }));
app.post('/register', (req, res) => {
	const { username, password, email } = req.body;

	const token = jwt.sign({ username, email }, 'secretKey', { expiresIn: '5h' });

	const sql = `INSERT INTO users (username, password, email, token) VALUES (?, ?, ?, ?)`;
	db.query(sql, [username, password, email, token], (err, result) => {
		if (err) {
			console.error('Błąd podczas rejestracji użytkownika:', err);
			return res
				.status(500)
				.json({ message: 'Błąd podczas rejestracji użytkownika.' });
		}
		console.log('Użytkownik został zarejestrowany:', { username, email }); 
		res
			.status(201)
			.json({ message: 'Użytkownik został zarejestrowany.', token });
	});
});
// Endpoint logowania użytkownika
app.post('/login', (req, res) => {
	const { username, password } = req.body;
	const token = jwt.sign({ username, email: row.email }, secretKey, {
		expiresIn: '1h',
	});

	console.log('Generated token:', token); // Dodaj log tokena

	// Twój obecny kod aktualizacji tokenu...

	console.log('Updated token:', token); // Dodaj log zaktualizowanego tokenu

	const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
	db.query(sql, [username, password], (err, row) => {
		if (err) {
			console.error('Błąd podczas logowania:', err);
			return res.status(500).json({ message: 'Błąd logowania.' });
		}

		if (!row) {
			return res.status(401).json({ message: 'Nieprawidłowe dane logowania.' });
		}

		const token = jwt.sign({ username, email: row.email }, secretKey, {
			expiresIn: '1h',
		});

		const updateTokenQuery = `UPDATE users SET token = ? WHERE id = ?`;
		db.query(updateTokenQuery, [token, row.id], (err) => {
			if (err) {
				console.error('Błąd podczas aktualizacji tokenu:', err);
				return res.status(500).json({ message: 'Błąd logowania.' });
			}
			console.log('Użytkownik zalogowany:', { username, email: row.email });
			res.status(200).json({ message: 'Zalogowano użytkownika.', token });
		});
	});
});

// Endpoint dodawania zadań przez użytkownika
app.post('/addTask', (req, res) => {
	const { tasks } = req.body;
	const userToken = req.headers.authorization;

	console.log('Received user token:', userToken); // Console log otrzymanego tokenu

	// Funkcja sprawdzająca poprawność tokenu JWT
	function userTokenIsValid(token) {
		try {
			const decoded = jwt.verify(token.replace('Bearer ', ''), secretKey);
			console.log('Decoded token:', decoded); // Console log zdekodowanego tokenu
			return decoded;
		} catch (err) {
			return false;
		}
	}
	if (!userTokenIsValid(userToken)) {
		return res.status(401).json({ message: 'Brak autoryzacji.' });
	}

	tasks.forEach((task) => {
		const {
			username, 
			name,
			category,
			date,
			grams,
			calories,
			proteins,
			productWholeCalories,
		} = task;

		const sql = `INSERT INTO tasks (username, name, category, date, grams, calories, proteins, productWholeCalories) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
		db.query(
			sql,
			[
				username,
				name,
				category,
				date,
				grams,
				calories,
				proteins,
				productWholeCalories,
			],
			(err) => {
				if (err) {
					console.error('Błąd podczas dodawania zadania:', err);
					return res
						.status(500)
						.json({ message: 'Błąd podczas dodawania zadania.' });
				}
				console.log('Zadanie zostało dodane:', { name, date });
			}
		);
	});

	res.status(201).json({ message: 'Zadania zostały dodane.' });
});
app.post('/updateTasks/:username', (req, res) => {
	let { editedTasks } = req.body;
	const userToken = req.headers.authorization;

	const editedTaskUsername = req.params.username; // Zmiana nazwy na unikatową

	console.log(req.body);
	if (typeof editedTasks !== 'undefined') {
		// Wykonaj kod, który używa zmiennej editedTasks
	} else {
		console.log('editedTasks jest niezdefiniowane');
	}
	console.log('Received user token:', userToken);

	function userTokenIsValid(token) {
		try {
			const decoded = jwt.verify(token.replace('Bearer ', ''), secretKey);
			console.log('Decoded token:', decoded);
			return decoded;
		} catch (err) {
			return false;
		}
	}

	if (!userTokenIsValid(userToken)) {
		return res.status(401).json({ message: 'Brak autoryzacji.' });
	}

	editedTasks.forEach((editedTask) => {
		const {
			name,
			category,
			date,
			grams,
			calories,
			proteins,
			productWholeCalories,
			id,
		} = editedTask;

		console.log('Zadanie do aktualizacji:', { id });
		console.log('Zadanie do aktualizacji:', { editedTaskUsername });

		const sql = `UPDATE tasks SET username=?, name=?, category=?, date=?, grams=?, calories=?, proteins=?,  productWholeCalories=? WHERE id=?`;
		db.query(
			sql,
			[
				editedTaskUsername, // Zmiana na editedTaskUsername
				name,
				category,
				date,
				grams,
				calories,
				proteins,
				productWholeCalories,
				id,
			],
			(err) => {
				if (err) {
					console.error('Błąd podczas aktualizowania zadania:', err);
				}
				console.log('Zadanie zostało zaktualizowane:', { id });
			}
		);
	});

	res.status(200).json({ message: 'Zadania zostały zaktualizowane.' });
});
app.delete('/deleteTask/:taskId', (req, res) => {
	const taskId = req.params.taskId;
	const userToken = req.headers.authorization;

	console.log('Received user token:', userToken); // Console log otrzymanego tokenu

	// Funkcja sprawdzająca poprawność tokenu JWT
	function userTokenIsValid(token) {
		try {
			const decoded = jwt.verify(token.replace('Bearer ', ''), secretKey);
			console.log('Decoded token:', decoded); // Console log zdekodowanego tokenu
			return decoded;
		} catch (err) {
			return false;
		}
	}
	if (!userTokenIsValid(userToken)) {
		return res.status(401).json({ message: 'Brak autoryzacji.' });
	}
	const deleteQuery = `DELETE FROM tasks WHERE id = ${taskId}`;

	db.query(deleteQuery, (error, results) => {
		if (error) {
			console.error('Błąd podczas usuwania zadania:', error);
			return res
				.status(500)
				.json({ message: 'Wystąpił błąd podczas usuwania zadania' });
		}

		if (results.affectedRows === 0) {
			return res.status(404).json({ message: 'Zadanie nie znalezione' });
		}

		return res.status(200).json({ message: 'Zadanie zostało usunięte' });
	});
});

app.get('/', (req, res) => {
	res.send('Hello World!');
});



// const restartServer = () => {
// 	// Wyświetlenie informacji o restarcie serwera
// 	console.log('Restarting server...');
	
// 	// Zamknięcie serwera
// 	server.close(() => {
// 	  // Po zamknięciu serwera otwórz go ponownie
// 	  const reopenedServer = app.listen(port, '0.0.0.0', () => {
// 		console.log(`Server is running on port ${port}`);
// 	  });
  
// 	  // Ustawienie nowego serwera jako serwer do dalszego użytku
// 	  server = reopenedServer;
	  
// 	  // Po ponownym uruchomieniu wyświetlenie informacji o ponownym uruchomieniu serwera
// 	  console.log('Server restarted.');
// 	});
//   };
//   app.listen(port, '0.0.0.0', () => {
// 	console.log(`Server is running on port ${port}`)
//   })
  // Uruchomienie serwera
//   let server = app.listen(port, '0.0.0.0', () => {
// 	console.log(`Server is running on port ${port}`);
//   });
  
//   // Uruchomienie interwału do restartowania co 24 godziny (86400000 milisekund)
//   const interval = setInterval(restartServer, 12 * 60 * 60 * 1000);
  
//   // Obsługa zdarzenia SIGINT (Ctrl+C), czyszczenie interwału i zamykanie serwera
//   process.on('SIGINT', () => {
// 	clearInterval(interval); // Wyczyszczenie interwału
// 	server.close(() => {
// 	  console.log('Server shut down.');
// 	  process.exit(0); // Wyjście z procesu Node.js
// 	}); 
//   });

app.get('/health', (req, res) => {
	res.status(200).send('OK');
  });
     












app.listen(port, '0.0.0.0', () => {
	console.log(`Server is running on port ${port}`);
});
