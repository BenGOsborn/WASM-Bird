package main

import (
	"fmt"
	"net/http"
)

func main() {
	PORT := ":6000"
	FILE_DIR := "./src_go/static"

	fmt.Println("Listening on http://localhost" + PORT)
	fmt.Println(http.ListenAndServe(PORT, http.FileServer(http.Dir(FILE_DIR))))
}
