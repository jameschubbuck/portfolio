package main

import (
	"embed"
	"encoding/json"
	"io"
	"io/fs"
	"log"
	"net/http"
	"path"
	"sort"
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
	mux.Handle("GET /ponderings/", ponderingHandler(publicSub))
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

func ponderingHandler(publicFS fs.FS) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		clean := path.Clean("/" + r.URL.Path)

		if clean == "/ponderings/list" {
			entries, err := fs.ReadDir(publicFS, "ponderings")
			if err != nil {
				http.Error(w, "Internal error", http.StatusInternalServerError)
				return
			}
			var list []map[string]string
			for _, e := range entries {
				name := e.Name()
				if !strings.HasSuffix(name, ".md") || e.IsDir() {
					continue
				}
				parts := strings.SplitN(name, " - ", 2)
				if len(parts) != 2 {
					continue
				}
			list = append(list, map[string]string{
				"id":         strings.TrimSpace(parts[0]),
				"title":      strings.TrimSuffix(name, ".md"),
				"shortTitle": strings.TrimSuffix(strings.TrimSpace(parts[1]), ".md"),
				"file":       name,
			})
			}
			sort.Slice(list, func(i, j int) bool { return list[i]["id"] > list[j]["id"] })
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(list)
			return
		}

		filePath := strings.TrimPrefix(clean, "/")
		if filePath != "" && exists(publicFS, filePath) {
			http.ServeFileFS(w, r, publicFS, filePath)
			return
		}
		http.ServeFileFS(w, r, publicFS, "html/ponderings.html")
	}
}
