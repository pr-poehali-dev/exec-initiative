ALTER TABLE t_p92715436_exec_initiative.users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

UPDATE t_p92715436_exec_initiative.users SET role = 'admin' WHERE email = 'aleksandruhlinov@gmail.com';