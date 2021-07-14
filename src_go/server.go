package main

import (
	"flag"
	"log"
	"net/http"
)

var (
	listen = flag.String("listen", ":3000", "listen address");
	dir = flag.String("dir", "./static", "directory to serve");
)

func main() {
	flag.Parse();
	log.Printf("Listening on %q...", *listen)
	log.Fatal(http.ListenAndServe(*listen, http.FileServer(http.Dir(*dir))))
}