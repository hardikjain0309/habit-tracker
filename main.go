package main

import (
	"context"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

func setupDB() (*pgxpool.Pool, error) {
	return pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
}

func setupRouter(dbClient *DBClient) {
	router := gin.Default()
	router.LoadHTMLFiles("./ui/build/index.html")
	router.Static("/static", "./ui/build/static")
	router.GET("/", func (c *gin.Context) {
		c.HTML(200, "index.html", nil)
	})
	bindHabitAPIHandlers(router, dbClient)
	router.Run(os.Getenv("SERVER_URL"))
}


func main() {
	godotenv.Load()
	pool, dbSetupErr := setupDB()
	if dbSetupErr != nil {
		panic("Failed to setup DB returning")
	}
	dbClient := initDB(pool)
	defer pool.Close()
	setupRouter(dbClient)
}