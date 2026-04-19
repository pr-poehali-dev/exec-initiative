CREATE TABLE IF NOT EXISTS t_p92715436_exec_initiative.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p92715436_exec_initiative.sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p92715436_exec_initiative.users(id),
    token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p92715436_exec_initiative.passports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p92715436_exec_initiative.users(id),
    name VARCHAR(255),
    address TEXT,
    area VARCHAR(50),
    year VARCHAR(10),
    floors VARCHAR(10),
    grade VARCHAR(5),
    date VARCHAR(100),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);