package main

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type HabitValue struct {
	Id int
	Value string
}

type HabitLog struct {
	HabitValues []HabitValue
	CreatedDateTime time.Time
}

type DBClient struct {
	Pool *pgxpool.Pool
}

func initDB(pool *pgxpool.Pool) *DBClient {
	return &DBClient{
		Pool: pool,
	}
}

func (dbClient DBClient) getHabitLogs() ([]HabitLog, error) {
	rows, queryErr := dbClient.Pool.Query(context.Background(), "SELECT createdat, habit_values from habit_logs")
	defer rows.Close()
	if (queryErr != nil) {
		return nil, queryErr
	}
	parsedHabitLogs := []HabitLog{}
	for rows.Next() {
		var habitLog HabitLog
		parseErr := rows.Scan(&habitLog.CreatedDateTime, &habitLog.HabitValues)
		if (parseErr != nil) {
		  return nil, parseErr
		}
		parsedHabitLogs = append(parsedHabitLogs, habitLog)
	}
	if (rows.Err() != nil) {
		return nil, rows.Err()
	}
	return parsedHabitLogs, nil
}

func (dbClient DBClient) addHabitLog(addHabitPayload AddHabitPayload) (*HabitLog, error) {
	habitValues := addHabitPayload.HabitValues
	_, dbExecErr := dbClient.Pool.Exec(context.Background(), `
		INSERT INTO habit_logs (habit_values)
		VALUES (
			$1::jsonb
		)
	`, habitValues)
	if dbExecErr != nil {
		return nil, dbExecErr
	}
	return &HabitLog{
		HabitValues: habitValues,
		CreatedDateTime: time.Now(),
	}, nil
}

func (dbClient *DBClient) updateHabitLog(updatedHabitLog *HabitLog) (*HabitLog, error) {
	_, dbExecErr := dbClient.Pool.Exec(context.Background(), `
		UPDATE habit_logs
		SET habit_values = $1::jsonb
		WHERE createdAt = $2::timestamp
	`, updatedHabitLog.HabitValues, updatedHabitLog.CreatedDateTime)
	if dbExecErr != nil {
		return nil, dbExecErr
	}
	return updatedHabitLog, nil
}