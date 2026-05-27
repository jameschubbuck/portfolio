package main

import (
	"embed"
	"html/template"
	"io/fs"
	"log"
	"math/rand"
	"net/http"
	"strings"
)

//go:embed all:templates
var templateFS embed.FS

//go:embed all:static
var staticFS embed.FS

//go:embed all:public
var publicFS embed.FS

var (
	indexTmpl    *template.Template
	notfoundTmpl *template.Template
	lackeysText  string
	richardText  string
	splashes     []string
)

type PageData struct {
	Dark    bool
	Lackeys string
	Richard string
}

type NotFoundData struct {
	Dark    bool
	Lackeys string
	Richard string
	Splash  string
}

func main() {
	readPublicFiles()

	base := template.Must(template.ParseFS(templateFS, "templates/base.html"))
	indexTmpl = template.Must(template.Must(base.Clone()).ParseFS(templateFS, "templates/index.html"))
	notfoundTmpl = template.Must(template.Must(base.Clone()).ParseFS(templateFS, "templates/404.html"))

	publicSub, _ := fs.Sub(publicFS, "public")
	publicHandler := http.FileServer(http.FS(publicSub))
	staticSub, _ := fs.Sub(staticFS, "static")
	staticHandler := http.StripPrefix("/static/", http.FileServer(http.FS(staticSub)))

	mux := http.NewServeMux()
	mux.Handle("GET /static/", staticHandler)
	mux.Handle("GET /cursors/", publicHandler)
	mux.Handle("GET /resume.pdf", publicHandler)
	mux.Handle("GET /resume.tex", publicHandler)
	mux.Handle("GET /splashes.txt", publicHandler)
	mux.Handle("GET /lackeys.txt", publicHandler)
	mux.Handle("GET /richard.txt", publicHandler)
	mux.Handle("GET /swish.svg", publicHandler)
	mux.Handle("GET /icon.png", publicHandler)
	mux.Handle("GET /thoughts/", http.StripPrefix("/", publicHandler))

	mux.HandleFunc("GET /{$}", handleIndex)
	mux.HandleFunc("GET /404", handle404)
	mux.HandleFunc("GET /", handleCatchAll)

	log.Println("Listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}

func readPublicFiles() {
	data, err := publicFS.ReadFile("public/lackeys.txt")
	if err == nil {
		lackeysText = string(data)
	}
	data, err = publicFS.ReadFile("public/richard.txt")
	if err == nil {
		richardText = string(data)
	}
	data, err = publicFS.ReadFile("public/splashes.txt")
	if err == nil {
		splashes = strings.Split(strings.TrimSpace(string(data)), "\n")
	}
}

func isDark(r *http.Request) bool {
	c, err := r.Cookie("theme")
	if err != nil {
		return false
	}
	return c.Value == "dark"
}

func handleIndex(w http.ResponseWriter, r *http.Request) {
	data := PageData{
		Dark:    isDark(r),
		Lackeys: lackeysText,
		Richard: richardText,
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	indexTmpl.ExecuteTemplate(w, "base.html", data)
}

func handle404(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotFound)
	data := NotFoundData{
		Dark:    isDark(r),
		Lackeys: lackeysText,
		Richard: richardText,
		Splash:  splashes[rand.Intn(len(splashes))],
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	notfoundTmpl.ExecuteTemplate(w, "base.html", data)
}

func handleCatchAll(w http.ResponseWriter, r *http.Request) {
	handle404(w, r)
}
