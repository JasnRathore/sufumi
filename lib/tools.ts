export type DocSection = {
    id: string;
    title: string;
    content: DocBlock[];
};

export type DocBlock =
    | { type: "p"; text: string }
    | { type: "code"; lang: string; code: string }
    | { type: "h3"; text: string }
    | { type: "ul"; items: string[] }
    | { type: "table"; headers: string[]; rows: string[][] }
    | { type: "callout"; kind: "tip" | "warn" | "info"; text: string };

export type Tool = {
    id: string;
    slug: string;
    lang: string;
    title: string;
    tagline: string;
    description: string;
    accent: string;
    github: string;
    chips: string[];
    badge?: string;
    highlights: { icon: string; label: string; text: string }[];
    docs: DocSection[];
};

export const TOOLS: Tool[] = [
    // ──────────────────────────────────────────────
    // JHR
    // ──────────────────────────────────────────────
    {
        id: "JHR",
        slug: "jhr",
        lang: "Java",
        title: "Java Hot Reloader",
        tagline: "Live reload for Java — built for game dev.",
        description:
            "JHR watches your Java source files and reloads changed classes at runtime without restarting the JVM. Includes an inbuilt error/log window so you can debug without leaving your app.",
        accent: "#FF6B2B",
        github: "https://github.com/JasnRathore/jhr",
        chips: ["hot-reload", "game dev", "debug window", "Java"],
        badge: "stable",
        highlights: [
            { icon: "⚡", label: "No JVM restart", text: "Classes reload in-place — keep your game state running." },
            { icon: "🪟", label: "Inbuilt log window", text: "Errors and logs surface in a floating panel inside your app." },
            { icon: "🔍", label: "Precise reload", text: "Only recompiles changed files, not the whole project." },
        ],
        docs: [
            {
                id: "overview",
                title: "Overview",
                content: [
                    {
                        type: "p",
                        text: "JHR (Java Hot Reloader) is a lightweight hot-reload utility targeting Java game development. It watches a source directory, detects file changes, recompiles the affected classes, and swaps them into the running JVM using the Instrumentation API — all without restarting.",
                    },
                    {
                        type: "callout",
                        kind: "info",
                        text: "JHR works best with projects that separate game logic from engine code. Hot-reloading works on logic classes; engine/renderer classes that hold JVM-level state should be restarted normally.",
                    },
                    {
                        type: "h3",
                        text: "How it works",
                    },
                    {
                        type: "ul",
                        items: [
                            "Attaches to the running JVM as a Java agent via -javaagent flag.",
                            "Uses WatchService to monitor .java source files for modifications.",
                            "On change, invokes javac on the modified file in-process.",
                            "Redefines the class via Instrumentation.redefineClasses().",
                            "Logs all events (compile errors, reload success/fail) to the inbuilt window.",
                        ],
                    },
                ],
            },
            {
                id: "installation",
                title: "Installation",
                content: [
                    {
                        type: "h3",
                        text: "Via JPM (recommended)",
                    },
                    {
                        type: "code",
                        lang: "powershell",
                        code: `jpm install jhr`,
                    },
                    {
                        type: "h3",
                        text: "Manual (JAR)",
                    },
                    {
                        type: "p",
                        text: "Download the latest jhr-agent.jar from the GitHub releases page and place it anywhere on your system.",
                    },
                    {
                        type: "code",
                        lang: "powershell",
                        code: `# Download
Invoke-WebRequest -Uri https://github.com/JasnRathore/jhr/releases/latest/download/jhr-agent.jar -OutFile jhr-agent.jar`,
                    },
                    {
                        type: "callout",
                        kind: "tip",
                        text: "Add the JAR path to your JAVA_TOOLS_OPTIONS environment variable so it's always available.",
                    },
                ],
            },
            {
                id: "usage",
                title: "Usage",
                content: [
                    {
                        type: "h3",
                        text: "Attaching the agent",
                    },
                    {
                        type: "p",
                        text: "Pass JHR as a -javaagent when launching your application. Point it at your source directory.",
                    },
                    {
                        type: "code",
                        lang: "powershell",
                        code: `java -javaagent:jhr-agent.jar=src=./src/main/java -jar MyGame.jar`,
                    },
                    {
                        type: "h3",
                        text: "Agent options",
                    },
                    {
                        type: "table",
                        headers: ["Option", "Default", "Description"],
                        rows: [
                            ["src", ".", "Root directory to watch for .java changes"],
                            ["classpath", ".", "Classpath used when recompiling changed files"],
                            ["window", "true", "Show the inbuilt log/error window"],
                            ["poll", "300", "File poll interval in milliseconds"],
                        ],
                    },
                    {
                        type: "code",
                        lang: "powershell",
                        code: `# Multiple options separated by comma
java -javaagent:jhr-agent.jar=src=./src,classpath=./lib/*,poll=500 -jar MyGame.jar`,
                    },
                    {
                        type: "h3",
                        text: "Maven / Gradle integration",
                    },
                    {
                        type: "code",
                        lang: "xml",
                        code: `<!-- Maven: add to surefire or exec plugin JVM args -->
<configuration>
  <argLine>-javaagent:\${project.basedir}/jhr-agent.jar=src=src/main/java</argLine>
</configuration>`,
                    },
                    {
                        type: "code",
                        lang: "groovy",
                        code: `// Gradle
tasks.named('run') {
    jvmArgs "-javaagent:jhr-agent.jar=src=src/main/java"
}`,
                    },
                ],
            },
            {
                id: "log-window",
                title: "Log Window",
                content: [
                    {
                        type: "p",
                        text: "JHR ships with a built-in overlay window that shows live compile errors and reload events. It floats over your application and can be toggled with a hotkey.",
                    },
                    {
                        type: "table",
                        headers: ["Hotkey", "Action"],
                        rows: [
                            ["Ctrl+Shift+L", "Toggle log window visibility"],
                            ["Ctrl+Shift+C", "Clear all log entries"],
                            ["Ctrl+Shift+R", "Force reload all watched classes"],
                        ],
                    },
                    {
                        type: "callout",
                        kind: "tip",
                        text: "Set window=false in agent options to disable the overlay in production builds.",
                    },
                ],
            },
            {
                id: "limitations",
                title: "Limitations",
                content: [
                    {
                        type: "callout",
                        kind: "warn",
                        text: "The standard JVM Instrumentation API only supports redefining method bodies. Adding/removing fields or changing class hierarchies requires a full restart.",
                    },
                    {
                        type: "ul",
                        items: [
                            "Cannot add new fields or methods to existing classes.",
                            "Cannot change a class's superclass or implemented interfaces.",
                            "Static initializer blocks run only once on first load.",
                            "Works on HotSpot JVM (Oracle/OpenJDK). Other JVMs untested.",
                        ],
                    },
                ],
            },
        ],
    },

    // ──────────────────────────────────────────────
    // JPM
    // ──────────────────────────────────────────────
    {
        id: "JPM",
        slug: "jpm",
        lang: "Go · Turso",
        title: "Windows Package Manager",
        tagline: "Install your tools. No ceremony.",
        description:
            "JPM is a minimal package manager for Windows built to make installing personal and community dev tools a one-liner. It ships with a custom instruction parser so packages can define their own install steps.",
        accent: "#FFB830",
        github: "https://github.com/JasnRathore/jpm",
        chips: ["CLI", "custom parser", "windows", "Go"],
        badge: "active",
        highlights: [
            { icon: "📦", label: "Simple registry", text: "Packages live in a flat registry — easy to publish, easy to audit." },
            { icon: "🧩", label: "Custom parser", text: "Each package ships install instructions in a tiny DSL — no shell scripts." },
            { icon: "⚡", label: "Fast installs", text: "Written in Go. Parallel downloads, instant extracts." },
        ],
        docs: [
            {
                id: "overview",
                title: "Overview",
                content: [
                    {
                        type: "p",
                        text: "JPM (Jasn Package Manager) is a lightweight Windows package manager designed for developers who want a simple, scriptable way to manage personal tools. Unlike winget or choco, JPM is tiny, requires no admin rights for user-scoped installs, and uses a human-readable instruction format instead of XML manifests.",
                    },
                    {
                        type: "callout",
                        kind: "info",
                        text: "JPM bootstraps itself — once you have the binary, every other sufumi tool installs via jpm install <name>.",
                    },
                ],
            },
            {
                id: "installation",
                title: "Installation",
                content: [
                    {
                        type: "h3",
                        text: "Bootstrap install",
                    },
                    {
                        type: "p",
                        text: "Run the bootstrap script in PowerShell. This downloads the JPM binary and adds it to your user PATH.",
                    },
                    {
                        type: "code",
                        lang: "powershell",
                        code: `irm https://raw.githubusercontent.com/JasnRathore/jpm/main/install.ps1 | iex`,
                    },
                    {
                        type: "h3",
                        text: "Manual",
                    },
                    {
                        type: "code",
                        lang: "powershell",
                        code: `# Download latest release
Invoke-WebRequest -Uri https://github.com/JasnRathore/jpm/releases/latest/download/jpm.exe -OutFile "$env:LOCALAPPDATA\\jpm\\jpm.exe"
# Add to PATH
[Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";$env:LOCALAPPDATA\\jpm", "User")`,
                    },
                ],
            },
            {
                id: "commands",
                title: "Commands",
                content: [
                    {
                        type: "table",
                        headers: ["Command", "Description"],
                        rows: [
                            ["jpm install <pkg>", "Download and install a package"],
                            ["jpm remove <pkg>", "Uninstall a package"],
                            ["jpm list", "List all installed packages"],
                            ["jpm search <query>", "Search the registry"],
                            ["jpm update", "Update all installed packages"],
                            ["jpm update <pkg>", "Update a specific package"],
                            ["jpm info <pkg>", "Show package metadata"],
                        ],
                    },
                    {
                        type: "h3",
                        text: "Install flags",
                    },
                    {
                        type: "code",
                        lang: "powershell",
                        code: `# Install to a specific directory
jpm install glide --dir C:\\tools

# Install specific version
jpm install jhr@1.2.0

# Skip confirmation prompts
jpm install arlo --yes`,
                    },
                ],
            },
            {
                id: "packages",
                title: "Writing Packages",
                content: [
                    {
                        type: "p",
                        text: "A JPM package is a folder with a jpm.pkg file — a plain-text instruction file that describes how to fetch and install the tool.",
                    },
                    {
                        type: "h3",
                        text: "jpm.pkg format",
                    },
                    {
                        type: "code",
                        lang: "text",
                        code: `name: mytool
version: 1.0.0
description: Does one thing well.
author: your-github

fetch:
  url: https://github.com/you/mytool/releases/latest/download/mytool.exe
  checksum: sha256:abc123...

install:
  copy mytool.exe -> %LOCALAPPDATA%/mytool/mytool.exe
  addpath %LOCALAPPDATA%/mytool

uninstall:
  remove %LOCALAPPDATA%/mytool
  removepath %LOCALAPPDATA%/mytool`,
                    },
                    {
                        type: "h3",
                        text: "Instruction reference",
                    },
                    {
                        type: "table",
                        headers: ["Instruction", "Description"],
                        rows: [
                            ["copy <src> -> <dest>", "Copy a file from the download to a destination path"],
                            ["addpath <dir>", "Add a directory to the user PATH"],
                            ["removepath <dir>", "Remove a directory from PATH"],
                            ["remove <path>", "Delete a file or directory"],
                            ["mkdir <dir>", "Create a directory"],
                            ["run <cmd>", "Execute a shell command (use sparingly)"],
                        ],
                    },
                    {
                        type: "callout",
                        kind: "tip",
                        text: "Use %LOCALAPPDATA%, %APPDATA%, and %USERPROFILE% environment variables in paths. JPM expands them automatically.",
                    },
                ],
            },
        ],
    },

    // ──────────────────────────────────────────────
    // ARLO
    // ──────────────────────────────────────────────
    {
        id: "ARLO",
        slug: "arlo",
        lang: "Go · Vite",
        title: "Fullstack Web Framework",
        tagline: "Go backend + Vite frontend. One binary.",
        description:
            "Arlo is a lightweight fullstack framework that bundles a Go HTTP server and a Vite-powered frontend into a single deployable binary. No Dockerfiles, no separate deploys.",
        accent: "#3ddc84",
        github: "https://github.com/JasnRathore/arlo",
        chips: ["single binary", "Go backend", "Vite frontend", "fullstack"],
        badge: "active",
        highlights: [
            { icon: "🏗️", label: "One binary", text: "Your entire app — frontend and backend — ships as a single .exe or Linux binary." },
            { icon: "⚡", label: "Vite dev server", text: "Full HMR in dev mode, optimized Vite build embedded in prod." },
            { icon: "🔌", label: "Go API", text: "Write your backend in idiomatic Go. No framework lock-in." },
        ],
        docs: [
            {
                id: "overview",
                title: "Overview",
                content: [
                    {
                        type: "p",
                        text: "Arlo combines a Go HTTP server with a Vite frontend project. In development, it proxies the Vite dev server for HMR. In production, it embeds the built frontend assets using Go's embed package and serves them from the same binary as your API.",
                    },
                    {
                        type: "h3",
                        text: "Project structure",
                    },
                    {
                        type: "code",
                        lang: "text",
                        code: `my-app/
├── main.go          # Entry point — starts Arlo
├── routes/
│   ├── api.go       # Your Go API handlers
│   └── ...
├── frontend/        # Standard Vite project
│   ├── index.html
│   ├── src/
│   └── vite.config.ts
└── arlo.config.toml # Optional config`,
                    },
                ],
            },
            {
                id: "installation",
                title: "Installation",
                content: [
                    {
                        type: "code",
                        lang: "powershell",
                        code: `# Via JPM
jpm install arlo

# Via Go
go install github.com/JasnRathore/arlo/cmd/arlo@latest`,
                    },
                    {
                        type: "h3",
                        text: "Scaffold a new project",
                    },
                    {
                        type: "code",
                        lang: "powershell",
                        code: `arlo new my-app
cd my-app
arlo dev`,
                    },
                ],
            },
            {
                id: "routing",
                title: "Routing",
                content: [
                    {
                        type: "h3",
                        text: "API routes (Go)",
                    },
                    {
                        type: "code",
                        lang: "go",
                        code: `package routes

import (
    "encoding/json"
    "net/http"
    "github.com/JasnRathore/arlo"
)

func Register(app *arlo.App) {
    app.GET("/api/hello", func(w http.ResponseWriter, r *http.Request) {
        json.NewEncoder(w).Encode(map[string]string{"msg": "hello from Go"})
    })

    app.POST("/api/data", handleData)
}`,
                    },
                    {
                        type: "h3",
                        text: "Frontend routing (Vite + React/Vue/Svelte)",
                    },
                    {
                        type: "p",
                        text: "Arlo serves your Vite index.html for all non-API routes, so client-side routing works out of the box with React Router, Vue Router, etc.",
                    },
                    {
                        type: "code",
                        lang: "typescript",
                        code: `// Vite frontend — fetch from Go API
const res = await fetch('/api/hello')
const data = await res.json()
console.log(data.msg) // "hello from Go"`,
                    },
                ],
            },
            {
                id: "building",
                title: "Building & Deploying",
                content: [
                    {
                        type: "code",
                        lang: "powershell",
                        code: `# Build for current platform
arlo build

# Cross-compile
arlo build --target linux/amd64
arlo build --target windows/amd64`,
                    },
                    {
                        type: "p",
                        text: "The output is a single binary with the Vite build embedded. Copy it to any server and run it — no Node.js, no npm, no config files needed.",
                    },
                    {
                        type: "callout",
                        kind: "tip",
                        text: "Set PORT env var to change the listening port. Default is 8080.",
                    },
                ],
            },
            {
                id: "config",
                title: "Configuration",
                content: [
                    {
                        type: "code",
                        lang: "toml",
                        code: `# arlo.config.toml
[server]
port = 8080
host = "0.0.0.0"

[frontend]
dir = "./frontend"      # path to Vite project
dev_port = 5173         # Vite dev server port

[build]
output = "./dist"`,
                    },
                ],
            },
        ],
    },

    // ──────────────────────────────────────────────
    // GLIDE
    // ──────────────────────────────────────────────
    {
        id: "GLIDE",
        slug: "glide",
        lang: "Go · HTML/CSS/JS",
        title: "Desktop Framework",
        tagline: "Desktop apps with web tech and a Go backend.",
        description:
            "Glide lets you build native-feeling desktop apps using HTML, CSS, and JavaScript for the UI, with Go powering the backend logic. Currently supports Windows, with a focus on performance and tiny binaries.",
        accent: "#38bdf8",
        github: "https://github.com/JasnRathore/glide",
        chips: ["desktop", "web tech", "Go backend", "windows"],
        badge: "active",
        highlights: [
            { icon: "🖥️", label: "Native window", text: "Real OS window with system chrome — not an Electron wrapper." },
            { icon: "🌐", label: "Web UI", text: "Write your interface in HTML/CSS/JS. Use any frontend library." },
            { icon: "🔗", label: "Go bridge", text: "Call Go functions directly from JavaScript via a clean bridge API." },
        ],
        docs: [
            {
                id: "overview",
                title: "Overview",
                content: [
                    {
                        type: "p",
                        text: "Glide uses the OS WebView (WebView2 on Windows) to render your frontend, while a Go process handles business logic, file system access, and native APIs. The two sides communicate through a bidirectional message bridge.",
                    },
                    {
                        type: "callout",
                        kind: "info",
                        text: "WebView2 ships with Windows 11 and is auto-installed on Windows 10. Glide checks for it at startup and prompts installation if needed.",
                    },
                ],
            },
            {
                id: "installation",
                title: "Installation",
                content: [
                    {
                        type: "code",
                        lang: "powershell",
                        code: `jpm install glide

# or via Go
go install github.com/JasnRathore/glide/cmd/glide@latest`,
                    },
                    {
                        type: "h3",
                        text: "Create a new app",
                    },
                    {
                        type: "code",
                        lang: "powershell",
                        code: `glide new my-desktop-app
cd my-desktop-app
glide dev`,
                    },
                ],
            },
            {
                id: "window",
                title: "Creating Windows",
                content: [
                    {
                        type: "code",
                        lang: "go",
                        code: `package main

import "github.com/JasnRathore/glide"

func main() {
    app := glide.New()

    win := app.NewWindow(glide.WindowConfig{
        Title:  "My App",
        Width:  1024,
        Height: 768,
        URL:    "./frontend/index.html",
    })

    win.Show()
    app.Run()
}`,
                    },
                    {
                        type: "h3",
                        text: "Window options",
                    },
                    {
                        type: "table",
                        headers: ["Option", "Type", "Description"],
                        rows: [
                            ["Title", "string", "Window title bar text"],
                            ["Width / Height", "int", "Initial window size in pixels"],
                            ["MinWidth / MinHeight", "int", "Minimum window size"],
                            ["Resizable", "bool", "Whether the user can resize the window (default: true)"],
                            ["Frameless", "bool", "Remove the OS title bar for a custom chrome"],
                            ["URL", "string", "Path to HTML file or http:// URL to load"],
                            ["DevTools", "bool", "Enable right-click → Inspect (default: false)"],
                        ],
                    },
                ],
            },
            {
                id: "bridge",
                title: "Go ↔ JS Bridge",
                content: [
                    {
                        type: "h3",
                        text: "Expose Go functions to JS",
                    },
                    {
                        type: "code",
                        lang: "go",
                        code: `// In Go — register a handler
win.Bind("readFile", func(path string) (string, error) {
    data, err := os.ReadFile(path)
    return string(data), err
})`,
                    },
                    {
                        type: "code",
                        lang: "javascript",
                        code: `// In your frontend JS
const content = await window.glide.readFile("./notes.txt")
console.log(content)`,
                    },
                    {
                        type: "h3",
                        text: "Emit events from Go",
                    },
                    {
                        type: "code",
                        lang: "go",
                        code: `// Push data to the frontend
win.Emit("status-update", map[string]any{"progress": 75})`,
                    },
                    {
                        type: "code",
                        lang: "javascript",
                        code: `window.glide.on("status-update", (data) => {
  console.log(data.progress) // 75
})`,
                    },
                ],
            },
            {
                id: "building",
                title: "Building",
                content: [
                    {
                        type: "code",
                        lang: "powershell",
                        code: `# Build a Windows .exe with embedded frontend
glide build

# Build with a custom app icon
glide build --icon ./assets/icon.ico

# Build without console window (GUI-only)
glide build --no-console`,
                    },
                    {
                        type: "callout",
                        kind: "tip",
                        text: "Use glide build --upx to compress the binary with UPX. Final sizes are typically 4–8 MB for simple apps.",
                    },
                ],
            },
        ],
    },

    // ──────────────────────────────────────────────
    // PROJECT ALIASER
    // ──────────────────────────────────────────────
    {
        id: "PA",
        slug: "project-aliaser",
        lang: "Go · SQLite",
        title: "Project Aliaser",
        tagline: "Navigate your projects without typing paths.",
        description:
            "Project Aliaser is a CLI tool that lets you create short aliases for frequently accessed directories. Jump anywhere in your file system with a single short command.",
        accent: "#a78bfa",
        github: "https://github.com/JasnRathore/project-aliaser",
        chips: ["CLI", "aliases", "navigation", "SQLite"],
        badge: "stable",
        highlights: [
            { icon: "🗂️", label: "Short aliases", text: "Map any deep directory path to a name you'll actually remember." },
            { icon: "💾", label: "Persistent", text: "Aliases are stored in a local SQLite database — survive reboots." },
            { icon: "🔍", label: "Fuzzy search", text: "Can't remember the exact alias? Search by partial name." },
        ],
        docs: [
            {
                id: "overview",
                title: "Overview",
                content: [
                    {
                        type: "p",
                        text: "Project Aliaser stores directory aliases in a local SQLite database and generates a shell function (pa) that you source into your shell profile. Running pa <alias> changes your current directory — regardless of where you are.",
                    },
                    {
                        type: "callout",
                        kind: "info",
                        text: "Because cd must affect the current shell, Project Aliaser outputs a shell function rather than changing directories directly from the binary.",
                    },
                ],
            },
            {
                id: "installation",
                title: "Installation",
                content: [
                    {
                        type: "code",
                        lang: "powershell",
                        code: `jpm install project-aliaser

# or build from source
go install github.com/JasnRathore/project-aliaser@latest`,
                    },
                    {
                        type: "h3",
                        text: "Shell integration",
                    },
                    {
                        type: "p",
                        text: "Add the following to your PowerShell profile ($PROFILE) or .bashrc / .zshrc:",
                    },
                    {
                        type: "code",
                        lang: "powershell",
                        code: `# PowerShell — add to $PROFILE
function pa { Set-Location (project-aliaser go $args[0]) }`,
                    },
                    {
                        type: "code",
                        lang: "bash",
                        code: `# bash / zsh — add to ~/.bashrc or ~/.zshrc
pa() { cd "$(project-aliaser go "$1")" }`,
                    },
                ],
            },
            {
                id: "commands",
                title: "Commands",
                content: [
                    {
                        type: "table",
                        headers: ["Command", "Description"],
                        rows: [
                            ["project-aliaser add <alias> [path]", "Create an alias (defaults to current directory)"],
                            ["project-aliaser go <alias>", "Print the path for an alias (used by shell function)"],
                            ["project-aliaser list", "List all stored aliases"],
                            ["project-aliaser remove <alias>", "Delete an alias"],
                            ["project-aliaser search <query>", "Fuzzy-search aliases by name or path"],
                            ["project-aliaser rename <old> <new>", "Rename an alias"],
                        ],
                    },
                    {
                        type: "h3",
                        text: "Examples",
                    },
                    {
                        type: "code",
                        lang: "powershell",
                        code: `# Alias current directory
cd C:\\Users\\jasn\\projects\\my-game
project-aliaser add game

# Alias a specific path
project-aliaser add docs C:\\Users\\jasn\\Documents\\dev-notes

# Jump to alias (via shell function)
pa game       # → cd C:\Users\jasn\projects\my-game
pa docs       # → cd C:\Users\jasn\Documents\dev-notes

# List all
project-aliaser list
#  game   → C:\Users\jasn\projects\my-game
#  docs   → C:\Users\jasn\Documents\dev-notes`,
                    },
                ],
            },
        ],
    },

    // ──────────────────────────────────────────────
    // JCOMMAND CHAIN
    // ──────────────────────────────────────────────
    {
        id: "JCC",
        slug: "jcommandchain",
        lang: "Go",
        title: "JCommand Chain",
        tagline: "Alias commands. Chain them. Run in parallel.",
        description:
            "JCC is a CLI utility for aliasing long commands and chaining multiple commands to run sequentially or concurrently. Replace repetitive terminal workflows with a single short command.",
        accent: "#f472b6",
        github: "https://github.com/JasnRathore/JCommandChain",
        chips: ["CLI", "concurrency", "aliases", "automation"],
        badge: "stable",
        highlights: [
            { icon: "⛓️", label: "Command chains", text: "Define named sequences of commands and run them with one word." },
            { icon: "🔀", label: "Parallel execution", text: "Run commands concurrently — useful for starting multiple dev servers." },
            { icon: "📝", label: "Simple config", text: "Plain TOML config file. No DSL to learn." },
        ],
        docs: [
            {
                id: "overview",
                title: "Overview",
                content: [
                    {
                        type: "p",
                        text: "JCC reads a chains.toml file and exposes each chain as a named command. Chains can run their steps in order (sequential) or all at once (parallel). It's useful for things like 'start my dev environment' or 'build and deploy'.",
                    },
                ],
            },
            {
                id: "installation",
                title: "Installation",
                content: [
                    {
                        type: "code",
                        lang: "powershell",
                        code: `jpm install jcc

go install github.com/JasnRathore/JCommandChain@latest`,
                    },
                ],
            },
            {
                id: "config",
                title: "Configuration",
                content: [
                    {
                        type: "p",
                        text: "Create a chains.toml in your project root or in %APPDATA%\\jcc\\chains.toml for global chains.",
                    },
                    {
                        type: "code",
                        lang: "toml",
                        code: `# chains.toml

[chain.dev]
description = "Start full dev environment"
mode = "parallel"
steps = [
  "arlo dev",
  "cd frontend && npm run dev",
  "redis-server"
]

[chain.build]
description = "Build and package"
mode = "sequential"
steps = [
  "npm run lint",
  "npm run test",
  "arlo build",
  "echo Build complete"
]

[chain.clean]
description = "Clean build artifacts"
mode = "sequential"
steps = [
  "rm -rf ./dist",
  "rm -rf ./frontend/dist",
  "go clean ./..."
]`,
                    },
                    {
                        type: "table",
                        headers: ["Field", "Values", "Description"],
                        rows: [
                            ["mode", "sequential | parallel", "How to run the steps"],
                            ["steps", "string[]", "List of shell commands to execute"],
                            ["description", "string", "Human-readable description (shown in jcc list)"],
                            ["cwd", "string", "Working directory for all steps (optional)"],
                            ["env", "table", "Extra environment variables (optional)"],
                        ],
                    },
                ],
            },
            {
                id: "commands",
                title: "Commands",
                content: [
                    {
                        type: "code",
                        lang: "powershell",
                        code: `# Run a chain
jcc run dev

# List all defined chains
jcc list

# Validate your chains.toml
jcc check

# Run with a specific config file
jcc run build --config ./scripts/chains.toml`,
                    },
                    {
                        type: "callout",
                        kind: "tip",
                        text: "Use jcc run dev --dry to print what would be executed without actually running anything.",
                    },
                ],
            },
        ],
    },

    // ──────────────────────────────────────────────
    // JYNTAXE
    // ──────────────────────────────────────────────
    {
        id: "JYN",
        slug: "jyntaxe",
        lang: "Tauri · React · Rust",
        title: "Jyntaxe",
        tagline: "Fullscreen code editor. Nothing in the way.",
        description:
            "Jyntaxe is a minimalist fullscreen code editor built with Tauri and React. It strips away every UI element that isn't the code itself, giving you a distraction-free writing surface backed by Rust performance.",
        accent: "#FF6B2B",
        github: "https://github.com/JasnRathore/jyntaxe",
        chips: ["editor", "fullscreen", "Tauri", "Rust", "React"],
        badge: "active",
        highlights: [
            { icon: "🖤", label: "Fullscreen first", text: "Opens full-screen. The editor is the whole screen." },
            { icon: "⚡", label: "Rust performance", text: "File I/O and parsing are handled by Rust — instantly fast." },
            { icon: "🎨", label: "Syntax highlighting", text: "Tree-sitter based highlighting for 40+ languages." },
        ],
        docs: [
            {
                id: "overview",
                title: "Overview",
                content: [
                    {
                        type: "p",
                        text: "Jyntaxe is built on Tauri — a Rust-based alternative to Electron that produces significantly smaller binaries. The editor UI is a React app using CodeMirror 6 for editing, with a Rust backend handling file operations, config, and platform integration.",
                    },
                    {
                        type: "callout",
                        kind: "info",
                        text: "Total binary size is under 6 MB on Windows. Compare to a minimal Electron app at 60–150 MB.",
                    },
                ],
            },
            {
                id: "installation",
                title: "Installation",
                content: [
                    {
                        type: "code",
                        lang: "powershell",
                        code: `jpm install jyntaxe`,
                    },
                    {
                        type: "p",
                        text: "Or download the installer from the GitHub releases page. The NSIS installer is under 8 MB.",
                    },
                    {
                        type: "h3",
                        text: "Build from source",
                    },
                    {
                        type: "code",
                        lang: "powershell",
                        code: `# Prerequisites: Rust, Node.js, Tauri CLI
git clone https://github.com/JasnRathore/jyntaxe
cd jyntaxe
npm install
npm run tauri build`,
                    },
                ],
            },
            {
                id: "keybindings",
                title: "Keybindings",
                content: [
                    {
                        type: "table",
                        headers: ["Shortcut", "Action"],
                        rows: [
                            ["Ctrl+O", "Open file"],
                            ["Ctrl+S", "Save"],
                            ["Ctrl+Shift+S", "Save as"],
                            ["Ctrl+N", "New file"],
                            ["Ctrl+W", "Close file"],
                            ["Ctrl+P", "Command palette"],
                            ["Ctrl+/", "Toggle comment"],
                            ["Ctrl+D", "Duplicate line"],
                            ["Alt+Up/Down", "Move line up/down"],
                            ["F11", "Toggle fullscreen"],
                            ["Ctrl+,", "Open settings"],
                        ],
                    },
                ],
            },
            {
                id: "settings",
                title: "Settings",
                content: [
                    {
                        type: "p",
                        text: "Settings are stored in %APPDATA%\\jyntaxe\\config.json.",
                    },
                    {
                        type: "code",
                        lang: "json",
                        code: `{
  "theme": "dark",
  "font": "Fira Code",
  "fontSize": 15,
  "lineHeight": 1.6,
  "tabSize": 2,
  "wordWrap": false,
  "showLineNumbers": true,
  "cursorBlink": true,
  "autosave": false,
  "autosaveInterval": 5000
}`,
                    },
                    {
                        type: "h3",
                        text: "Themes",
                    },
                    {
                        type: "p",
                        text: "Jyntaxe ships with dark, light, and monokai themes. Custom themes can be added as JSON files in %APPDATA%\\jyntaxe\\themes\\.",
                    },
                ],
            },
        ],
    },
];

export function normalizeSlug(input: string | string[] | undefined | null): string {
    if (!input) return "";
    const raw = Array.isArray(input) ? input[0] : input;
    if (typeof raw !== "string") return "";
    try {
        return decodeURIComponent(raw).toLowerCase();
    } catch {
        return raw.toLowerCase();
    }
}

export function getTool(slug: string | string[] | undefined | null): Tool | undefined {
    const normalized = normalizeSlug(slug);
    if (!normalized) return undefined;
    return TOOLS.find((t) => t.slug === normalized);
}
