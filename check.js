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
app.use(cors());

app.use(express.json()); // Parsowanie danych jako JSON
app.use(helmet());

const port = process.env.PORT || 3000;

// app.use(cors({
// 	origin: ["https://sprightly-tulumba-2baacf.netlify.app"],
//   }));
//   app.options('/register', cors());
//   app.options('/login', cors());
//   app.options('/test', cors());
//   app.options('/addTask', cors());
//   app.options('/odbierzDane', cors());
//   app.use((req, res, next) => {
// 	  res.setHeader('Access-Control-Allow-Origin', 'https://sprightly-tulumba-2baacf.netlify.app');
// 	  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
// 	  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
// 	  res.setHeader('Access-Control-Allow-Credentials', true);

// 	  if (req.method === 'OPTIONS') {
// 		  res.sendStatus(200);
// 	  } else {
// 		  next();
// 	  }
//   });

// function customCors(req, res, next) {
//     // Adres, z którego chcesz zezwolić na żądania (możesz zmienić ten adres)
//     const allowedOrigin = 'https://sprightly-tulumba-2baacf.netlify.app';

//     // Sprawdź, czy żądanie pochodzi z dozwolonego adresu
//     const requestOrigin = req.headers.origin;
//     if (requestOrigin === allowedOrigin) {
//         res.setHeader('Access-Control-Allow-Origin', requestOrigin);
//         res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//         res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     }

//     // Obsługa żądań OPTIONS (preflight requests)
//     if (req.method === 'OPTIONS') {
//         res.writeHead(200);
//         res.end();
//         return;
//     }

//     next(); // Kontynuuj przetwarzanie żądania
// }

// // Użycie naszego własnego middleware CORS
// app.use(customCors);

app.use((req, res, next) => {
	res.header(
		'Access-Control-Allow-Origin',
		'https://sprightly-tulumba-2baacf.netlify.app'
	);
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	next();
});
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
// const corsOptions = {
// 	origin: 'https://sprightly-tulumba-2baacf.netlify.app',
// 	methods: 'POST',
// 	allowedHeaders: ['Content-Type', 'Authorization'],
//   };
app.post('/register', (req, res) => {
	const { username, password, email } = req.body;

	const token = jwt.sign({ username, email }, 'secretKey', { expiresIn: '1h' });

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
	db.get(sql, [username, password], (err, row) => {
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
		db.run(updateTokenQuery, [token, row.id], (err) => {
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
app.post('/updateTasks', (req, res) => {
	const { editedTasks } = req.body; // Dane przesłane z przeglądarki
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
	// Iteracja przez każde zadanie w editedTasks
	editedTasks.forEach((editedTask) => {
		const {
			username,
			name,
			category,
			date,
			grams,
			calories,
			proteins,
			productWholeCalories,
		} = editedTask;

		const sql = `UPDATE tasks SET username=?, name=?, category=?, date=?, grams=?, proteins=?, calories=?, productWholeCalories=?`;
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
					console.error('Błąd podczas aktualizowania zadania:', err);
					// Jeśli chcesz przerwać działanie pętli w przypadku błędu, możesz zwrócić tutaj odpowiedź:
					// return res.status(500).json({ message: 'Błąd podczas aktualizowania zadania.' });
				}
				console.log('Zadanie zostało zaktualizowane:', { id });
			}
		);
	});

	res.status(200).json({ message: 'Zadania zostały zaktualizowane.' });
});

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.listen(port, '0.0.0.0', () => {
	console.log(`Server is running on port ${port}`);
});
