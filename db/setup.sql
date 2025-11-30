CREATE TABLE habit_logs (
    id SERIAL PRIMARY KEY,
    habit_values JSONB NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW()
);