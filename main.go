package main

import (
	"embed"
	"io"
	"io/fs"
	"log"
	"net/http"
	"path"
	"strings"
)

//go:embed all:static
var staticFS embed.FS

//go:embed all:public
var publicFS embed.FS

func main() {
	publicSub, _ := fs.Sub(publicFS, "public")
	staticSub, _ := fs.Sub(staticFS, "static")
	staticHandler := http.StripPrefix("/static/", http.FileServer(http.FS(staticSub)))

	mux := http.NewServeMux()
	mux.Handle("GET /static/", staticHandler)
	mux.Handle("/", publicHandler(publicSub))

	log.Println("Listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}

func publicHandler(publicFS fs.FS) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		clean := path.Clean("/" + r.URL.Path)
		if strings.HasPrefix(clean, "/static/") {
			w.WriteHeader(http.StatusNotFound)
			return
		}
		filePath := strings.TrimPrefix(clean, "/")
		if filePath == "" || strings.HasSuffix(clean, "/") {
			filePath = path.Join("html", filePath, "index.html")
		}
		if exists(publicFS, filePath) {
			http.ServeFileFS(w, r, publicFS, filePath)
			return
		}
		w.WriteHeader(http.StatusNotFound)
		f, err := publicFS.Open("html/404.html")
		if err != nil {
			return
		}
		defer f.Close()
		io.Copy(w, f)
	})
}

func exists(root fs.FS, name string) bool {
	if name == "" {
		return false
	}
	info, err := fs.Stat(root, name)
	if err != nil {
		return false
	}
	return !info.IsDir()
}
