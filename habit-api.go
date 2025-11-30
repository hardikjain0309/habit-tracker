package main

import (
	"errors"
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

type AddHabitPayload struct {
	HabitValues []HabitValue
}

type ErrorResponse struct {
	Message string
	Error error
}

var db *DBClient

func findTodaysHabitLog(habitLogs []HabitLog) *HabitLog {
	var todaysHabitLog *HabitLog
	todaysDate := time.Now().Format("dd/mm/yyyy")
	for _, habitLog := range habitLogs {
		habitLogDate := habitLog.CreatedDateTime.Format("dd/mm/yyyy")
		if habitLogDate == todaysDate {
			todaysHabitLog = &habitLog
		}
	}
	return todaysHabitLog
}

func getHabitLogsApiHandler (c *gin.Context) {
	habitLogs, err := db.getHabitLogs()
	if (err != nil) {
		c.AbortWithStatusJSON(500, err)
		return
	}
	c.JSON(200, habitLogs)
}

func addHabitLogApiHandler (c *gin.Context) {
	var addHabitPayload AddHabitPayload
	parsePayloadError := c.Bind(&addHabitPayload)
	if (parsePayloadError != nil) {
		c.AbortWithStatusJSON(400, parsePayloadError)
		return
	}
	habitLogs, getLogsErr := db.getHabitLogs()
	if getLogsErr != nil {
		c.AbortWithStatusJSON(500, getLogsErr)
		return
	}
	todaysHabitLog := findTodaysHabitLog(habitLogs)
	if todaysHabitLog != nil {
		c.AbortWithStatusJSON(400, ErrorResponse{
			Message: "Habit for today already exists, edit it instead",
			Error: errors.New("Habit for today already exists, edit it instead"),
		})
		return
	} 

	addedHabitLog, addErr :=  db.addHabitLog(addHabitPayload)
	if (addErr != nil) {
		c.AbortWithStatusJSON(500, addErr)
		return
	}
	c.JSON(201, addedHabitLog)
}

func updateHabitLogApiHandler (c *gin.Context) {
	var updateHabitPayload AddHabitPayload
	parsePayloadError := c.Bind(&updateHabitPayload)
	if (parsePayloadError != nil) {
		c.AbortWithStatusJSON(400, ErrorResponse{
			Message: "Failed to parse the request body",
			Error: parsePayloadError,
		})
		return
	}
	habitLogs, getLogsErr := db.getHabitLogs()
	if getLogsErr != nil {
		c.AbortWithStatusJSON(500, ErrorResponse{
			Message: "Failed to get existing habit logs",
			Error: getLogsErr,
		})
		return
	}
	todaysHabitLog := findTodaysHabitLog(habitLogs)
	if todaysHabitLog == nil {
		c.AbortWithStatusJSON(400, ErrorResponse{
			Message: "No habit logs exists for today",
			Error: errors.New(""),
		})
		return
	}
	todaysHabitLog.HabitValues = updateHabitPayload.HabitValues
	log.Print(todaysHabitLog)
	updatedHabitLog, updateErr := db.updateHabitLog(todaysHabitLog)
	if updateErr != nil {
		c.AbortWithStatusJSON(500, ErrorResponse{
			Message: "Failed to update habit log",
			Error: updateErr,
		})
		return
	}
	c.JSON(200, updatedHabitLog)
	return
}

func bindHabitAPIHandlers (router* gin.Engine, dbClient *DBClient) {
	db = dbClient
	router.GET("habitlogs/list", getHabitLogsApiHandler)
	router.POST("habitlogs/add", addHabitLogApiHandler)
	router.PUT("habitlogs/update", updateHabitLogApiHandler)
}