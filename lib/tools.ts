export type DocSection = {
    id: string;
    title: string;
    content: DocBlock[];
};

export type DocBlock =
    | { type: "p"; text: string }
    | { type: "download"; label: string; url: string; file?: string }
    | { type: "code"; lang: string; code: string }
    | { type: "h3"; text: string }
    | { type: "ul"; items: string[] }
    | { type: "table"; headers: string[]; rows: string[][] }
    | { type: "callout"; kind: "tip" | "warn" | "info"; text: string };

export type InstallStep =
    | { kind: "command"; label: string; command: string; shell?: "powershell" | "bash" | "cmd" }
    | { kind: "download"; label: string; url: string }
    | { kind: "instruction"; label: string };

export type InstallMethod = {
    id: string;
    label: string;
    steps: InstallStep[];
};

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
    downloadable?: {
        enabled: boolean;
        reason?: string;
    };
    highlights: { icon: string; label: string; text: string }[];
    install: {
        defaultId?: string;
        methods: InstallMethod[];
    };
    docs: DocSection[];
};

export function isToolInDev(tool: Tool) {
    const badge = tool.badge?.toLowerCase() ?? "";
    return badge.includes("dev");
}

export const TOOLS: Tool[] = [
    // ──────────────────────────────────────────────
    // JHR
    // ──────────────────────────────────────────────
    {
        id: "JHR",
        slug: "jhr",
        lang: "Java",
        title: "Java Hot Reload",
        tagline: "Save. Recompile. Restart. Automatically.",
        description:
            "JHR watches your .java files, recompiles on change, and restarts your app for an instant feedback loop — with a desktop overlay for errors.",
        accent: "#FF6B2B",
        github: "https://github.com/JasnRathore/jhr",
        chips: ["hot-reload", "Java", "watcher", "desktop overlay"],
        badge: "active",
        highlights: [
            { icon: "⚡", label: "Auto rebuild", text: "Detects .java changes, runs javac, and relaunches your app." },
            { icon: "🪟", label: "Error overlay", text: "Compilation failures pop a Swing overlay so you never miss them." },
            { icon: "🧩", label: "Configurable", text: "Simple .jhr.conf for classpath, args, watch dirs, and delays." },
        ],
        install: {
            defaultId: "setup",
            methods: [
                {
                    id: "setup",
                    label: "Download Setup",
                    steps: [
                        {
                            kind: "download",
                            label: "JavaHotReloaderSetup.exe",
                            url: "https://github.com/JasnRathore/jhr/releases/download/v0.2.0/JavaHotReloaderSetup@v0.2.0.exe",
                        }, {
                            kind: "instruction",
                            label: "Run the installer and follow the prompts",
                        }, {
                            kind: "command",
                            label: "Run in PowerShell",
                            shell: "powershell",
                            command: "pa",
                        },
                    ],
                },
                {
                    id: "download",
                    label: "Download Binary",
                    steps: [
                        {
                            kind: "download",
                            label: "JavaHotReloader.zip",
                            url: "https://github.com/JasnRathore/jhr/releases/download/v0.2.0/JavaHotReloader@v0.2.0.zip",
                        }, {
                            kind: "instruction",
                            label: "Extract the files into a folder",
                        }, {
                            kind: "instruction",
                            label: "Add the folder to your PATH",
                        }, {
                            kind: "command",
                            label: "Run in PowerShell",
                            shell: "powershell",
                            command: "jhr --help",
                        },
                    ],
                },
                {
                    id: "build",
                    label: "Build From Source",
                    steps: [
                        {
                            kind: "command",
                            label: "Clone the repo",
                            shell: "bash",
                            command: "git clone https://github.com/JasnRathore/jhr",
                        },
                        {
                            kind: "command",
                            label: "Build JHR jar",
                            shell: "powershell",
                            command: "cd jhr && ./buildjar.ps1",
                        },
                        {
                            kind: "command",
                            label: "Build JHR exe",
                            shell: "powershell",
                            command: "./buildexe.ps1",
                        },
                        {
                            kind: "command",
                            label: "Run the launcher",
                            shell: "powershell",
                            command: "./release/jhr.exe  --help",
                        },
                    ],
                },
            ],
        },
        docs: [
            {
                id: "overview",
                title: "Overview",
                content: [
                    {
                        type: "p",
                        text: "JHR (Java Hot Reload) watches your source tree, recompiles when .java files change, and restarts your program automatically. It is designed for tight feedback loops during development.",
                    },
                    {
                        type: "callout",
                        kind: "info",
                        text: "JHR uses javac/java directly and shows a desktop overlay window whenever compilation fails.",
                    },
                    { type: "h3", text: "What it does" },
                    {
                        type: "ul",
                        items: [
                            "Watches your source directory with debouncing to avoid rebuild storms.",
                            "Compiles updated files with javac on every save.",
                            "Restarts the running process so changes are reflected immediately.",
                            "Shows errors in an always-on-top Swing overlay window.",
                        ],
                    },
                ],
            },
            {
                id: "installation",
                title: "Installation",
                content: [
                    { type: "h3", text: "Download Release Setup" },
                    {
                        type: "p",
                        text: "Download the latest release Setup",
                    },
                    {
                        type: "download",
                        label: "Download latest release",
                        file: "JavaHotReloaderSetup.exe",
                        url: "https://github.com/JasnRathore/jhr/releases/download/v0.2.0/JavaHotReloaderSetup@v0.2.0.exe",
                    },
                    {
                        type: "ul",
                        items: [
                            "Run the installer and follow the prompts",
                        ],
                    },
                    {
                        type: "p",
                        text: "Run the binary",
                    },
                    { type: "code", lang: "powershell", code: `jhr --help` },
                    { type: "h3", text: "Download Release Binary" },
                    {
                        type: "p",
                        text: "Download the latest release ZIP",
                    },
                    {
                        type: "download",
                        label: "Download latest release",
                        file: "JavaHotReloader.zip",
                        url: "https://github.com/JasnRathore/jhr/releases/download/v0.2.0/JavaHotReloader@v0.2.0.zip",
                    },
                    {
                        type: "ul",
                        items: [
                            "Extract the files into a folder",
                            "Add the folder to your PATH",
                        ],
                    },
                    {
                        type: "p",
                        text: "Run the binary",
                    },
                    { type: "code", lang: "powershell", code: `jhr --help` },
                    { type: "h3", text: "Build from source" },
                    {
                        type: "code",
                        lang: "bash",
                        code: `git clone https://github.com/JasnRathore/jhr
cd jhr`,
                    },
                    {
                        type: "code",
                        lang: "powershell",
                        code: `buildjar.ps1`,
                    },
                    {
                        type: "p",
                        text: "This produces target/jhr.jar and the target/jhr launcher script.",
                    },
                    {
                        type: "code",
                        lang: "powershell",
                        code: `buildexe.ps1`,
                    },
                    {
                        type: "p",
                        text: "This produces release/jhr.exe and the required files in release",
                    },
                    {
                        type: "code", lang: "powershell", code: `cd release
./jhr.exe --help` },
                ],
            },
            {
                id: "quick-start",
                title: "Quick Start",
                content: [
                    {
                        type: "p",
                        text: "From your Java project directory, initialize a config file and start JHR:",
                    },
                    { type: "code", lang: "bash", code: `jhr init` },
                    {
                        type: "code",
                        lang: "ini",
                        code: `root = src
main_class = com.example.Main
classpath = src
delay = 1000`,
                    },
                    { type: "code", lang: "bash", code: `jhr` },
                ],
            },
            {
                id: "configuration",
                title: "Configuration",
                content: [
                    {
                        type: "table",
                        headers: ["Key", "Default", "Description"],
                        rows: [
                            ["root", "src", "Source directory to watch"],
                            ["watch_dirs", ".", "Comma-separated subdirectories to watch"],
                            ["watch_exts", ".java", "File extensions that trigger rebuild"],
                            ["exclude_dirs", ".git,tmp,vendor,target,build", "Directories to ignore"],
                            ["main_class", "Demo", "Fully-qualified main class to run"],
                            ["classpath", "src", "Classpath for javac/java"],
                            ["javac_flags", "(empty)", "Extra javac flags"],
                            ["jvm_args", "(empty)", "JVM flags like -Xmx"],
                            ["delay", "1000", "Debounce delay in ms"],
                            ["build_cmd", "(empty)", "Optional custom build command"],
                            ["log_level", "info", "debug | info | warn | error"],
                        ],
                    },
                    {
                        type: "callout",
                        kind: "tip",
                        text: "Use build_cmd for multi-module projects that need custom build steps.",
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
                            ["jhr", "Start hot-reload using .jhr.conf"],
                            ["jhr init", "Generate a default .jhr.conf"],
                            ["jhr version", "Print version info"],
                            ["jhr help", "Show usage"],
                        ],
                    },
                ],
            },
            {
                id: "error-overlay",
                title: "Error Overlay",
                content: [
                    {
                        type: "p",
                        text: "When compilation fails, JHR opens an always-on-top Swing window with the full javac output. Once you fix the error and save, the overlay dismisses automatically.",
                    },
                    {
                        type: "ul",
                        items: [
                            "Shows the file and line that failed to compile.",
                            "Displays full stderr output in a scrollable panel.",
                            "Auto-hides on the next successful rebuild.",
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
        title: "Jasn Package Manager",
        tagline: "Your registry, your rules.",
        description:
            "JPM is a lightweight CLI package manager backed by a Turso/libSQL registry and a local SQLite database for tracking installs and history.",
        accent: "#FFB830",
        github: "https://github.com/JasnRathore/jpm",
        chips: ["CLI", "package manager", "Turso", "SQLite", "semver"],
        badge: "in dev",
        downloadable: {
            enabled: false,
            reason: "Public binaries are disabled while JPM is in active development.",
        },
        highlights: [
            { icon: "📦", label: "Remote registry", text: "Fetch package metadata from a Turso/libSQL backend." },
            { icon: "🧾", label: "Local ledger", text: "Track installs, files, and PATH changes in SQLite." },
            { icon: "🧩", label: "Install DSL", text: "Packages define install steps in a tiny instruction language." },
        ],
        install: {
            defaultId: "build",
            methods: [
                {
                    id: "build",
                    label: "Build From Source",
                    steps: [
                        {
                            kind: "command",
                            label: "Clone the repo",
                            shell: "bash",
                            command: "git clone https://github.com/JasnRathore/jpm",
                        },
                        {
                            kind: "command",
                            label: "Create config/.env",
                            shell: "bash",
                            command: "cd jpm && printf \"URL=libsql://your-db.turso.io\\nTOKEN=your-token\\n\" > config/.env",
                        },
                        {
                            kind: "command",
                            label: "Build the binary",
                            shell: "bash",
                            command: "cd jpm && go build -o jpm .",
                        },
                        {
                            kind: "command",
                            label: "Initialize the local DB",
                            shell: "bash",
                            command: "cd jpm && ./jpm initdb",
                        },
                    ],
                },
                {
                    id: "download",
                    label: "Download Binary",
                    steps: [
                        {
                            kind: "download",
                            label: "jpm.exe",
                            url: "https://github.com/JasnRathore/jpm/releases/latest/download/jpm.exe",
                        },
                    ],
                },
            ],
        },
        docs: [
            {
                id: "overview",
                title: "Overview",
                content: [
                    {
                        type: "p",
                        text: "JPM is a developer-focused package manager that downloads tools from a remote registry and tracks every installation locally. It resolves semver constraints and runs install steps defined in a minimal instruction format.",
                    },
                    {
                        type: "callout",
                        kind: "info",
                        text: "The registry lives in Turso/libSQL; your machine keeps a local SQLite database of installs and history.",
                    },
                ],
            },
            {
                id: "requirements",
                title: "Requirements",
                content: [
                    {
                        type: "ul",
                        items: [
                            "Go 1.24.4+",
                            "A Turso account with database URL and auth token",
                            "config/.env with URL and TOKEN values",
                        ],
                    },
                    {
                        type: "callout",
                        kind: "warn",
                        text: "The config is embedded at build time using Go embed, so config/.env must exist before building.",
                    },
                ],
            },
            {
                id: "installation",
                title: "Installation",
                content: [
                    { type: "h3", text: "Build from source" },
                    {
                        type: "code",
                        lang: "bash",
                        code: `git clone https://github.com/JasnRathore/jpm
cd jpm`,
                    },
                    {
                        type: "code",
                        lang: "bash",
                        code: `printf "URL=libsql://your-db.turso.io\nTOKEN=your-token\n" > config/.env`,
                    },
                    {
                        type: "code",
                        lang: "bash",
                        code: `go build -o jpm .`,
                    },
                    { type: "h3", text: "Download release" },
                    {
                        type: "p",
                        text: "Download the latest binary, place config/.env next to it, then initialize the local database.",
                    },
                    {
                        type: "download",
                        label: "Download latest release",
                        file: "jpm.exe",
                        url: "https://github.com/JasnRathore/jpm/releases/latest",
                    },
                ],
            },
            {
                id: "initdb",
                title: "Initialize Database",
                content: [
                    {
                        type: "p",
                        text: "JPM stores local history and tracked files in jpm.db. Initialize it once before use:",
                    },
                    { type: "code", lang: "bash", code: `./jpm initdb` },
                    {
                        type: "callout",
                        kind: "info",
                        text: "Safe to run multiple times — it will not overwrite existing data.",
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
                            ["initdb", "Initialize local SQLite schema"],
                            ["search [name]", "Browse or search packages"],
                            ["install <name>[@version]", "Download and install a package"],
                            ["list", "Show installed packages"],
                            ["update [name]", "Update one or all packages"],
                            ["remove <name>", "Uninstall a package"],
                            ["info <name>", "Show detailed package info"],
                        ],
                    },
                ],
            },
            {
                id: "examples",
                title: "Examples",
                content: [
                    {
                        type: "code",
                        lang: "bash",
                        code: `./jpm search nodejs
./jpm search nodejs --all
./jpm install nodejs@^1.2.0
./jpm list --outdated
./jpm update --all`,
                    },
                ],
            },
            {
                id: "install-flow",
                title: "How Installation Works",
                content: [
                    {
                        type: "ul",
                        items: [
                            "Fetch metadata from the Turso registry.",
                            "Resolve semver constraints to a release.",
                            "Download and verify the archive checksum.",
                            "Parse the release instruction list.",
                            "Execute steps (extract, move, add PATH, etc.).",
                            "Record everything into jpm.db.",
                        ],
                    },
                ],
            },
            {
                id: "instructions",
                title: "Instruction Language",
                content: [
                    {
                        type: "code",
                        lang: "text",
                        code: `# Example instruction set
EXTRACT app-v1.2.3.zip
CHMOD app/bin/mytool
SET_LOCATION app/
ADD_TO_PATH app/bin
DELETE app-v1.2.3.zip`,
                    },
                    {
                        type: "table",
                        headers: ["Instruction", "Description"],
                        rows: [
                            ["EXTRACT <file>", "Unpack a zip/tar archive"],
                            ["CHMOD <path>", "Apply executable permissions"],
                            ["SET_LOCATION <dir>", "Set install location"],
                            ["ADD_TO_PATH <dir>", "Append a directory to PATH"],
                            ["DELETE <path>", "Remove a file or folder"],
                        ],
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
        title: "Arlo",
        tagline: "Go backend + modern frontend. Hot reload by default.",
        description:
            "Arlo scaffolds fullstack Go + Vite apps, runs the dev workflow, and builds a single deployable binary with frontend assets embedded.",
        accent: "#3ddc84",
        github: "https://github.com/JasnRathore/arlo",
        chips: ["fullstack", "Go", "Vite", "hot-reload", "single binary"],
        badge: "active",
        highlights: [
            { icon: "🏗️", label: "Single binary", text: "Build once and ship a single executable that serves the frontend and API." },
            { icon: "⚡", label: "Dev orchestration", text: "One command starts the backend, frontend, and hot reload." },
            { icon: "🔌", label: "Framework choice", text: "Pick standard net/http or Gin during scaffolding." },
        ],
        install: {
            defaultId: "go",
            methods: [
                {
                    id: "go",
                    label: "Go Install",
                    steps: [
                        {
                            kind: "command",
                            label: "Install the CLI",
                            shell: "bash",
                            command: "go install github.com/JasnRathore/arlo@latest",
                        },
                        {
                            kind: "command",
                            label: "Initialize a project",
                            shell: "bash",
                            command: "arlo init",
                        },
                        {
                            kind: "command",
                            label: "Start dev mode",
                            shell: "bash",
                            command: "arlo dev",
                        },
                    ],
                }, {
                    id: "setup",
                    label: "Download Setup",
                    steps: [
                        {
                            kind: "download",
                            label: "ArloSetup.exe",
                            url: "https://github.com/JasnRathore/arlo/releases/download/v0.1.1/ArloSetup@0.1.1.exe",
                        }, {
                            kind: "instruction",
                            label: "Run the installer and follow the prompts",
                        }, {
                            kind: "command",
                            label: "Run in PowerShell",
                            shell: "powershell",
                            command: "arlo --help",
                        },
                    ],
                },
                {
                    id: "download",
                    label: "Download Binary",
                    steps: [
                        {
                            kind: "download",
                            label: "arlo.exe",
                            url: "https://github.com/JasnRathore/arlo/releases/download/v0.1.1/arlo.exe",
                        }, {
                            kind: "instruction",
                            label: "Add the exe to your PATH",
                        }, {
                            kind: "command",
                            label: "Run in PowerShell",
                            shell: "powershell",
                            command: "arlo --help",
                        },
                    ],
                },
                {
                    id: "build",
                    label: "Build From Source",
                    steps: [
                        {
                            kind: "command",
                            label: "Clone the repo",
                            shell: "bash",
                            command: "git clone https://github.com/JasnRathore/arlo",
                        },
                        {
                            kind: "command",
                            label: "Build the binary",
                            shell: "bash",
                            command: "cd arlo && go build -o arlo",
                        },
                    ],
                },
            ],
        },
        docs: [
            {
                id: "overview",
                title: "Overview",
                content: [
                    {
                        type: "p",
                        text: "Arlo is a fullstack toolkit that pairs a Go backend with a modern JS/TS frontend. It ships a unified dev workflow and produces a single binary with your frontend embedded for production.",
                    },
                ],
            },
            {
                id: "requirements",
                title: "Requirements",
                content: [
                    {
                        type: "ul",
                        items: [
                            "Go 1.21+",
                            "Node.js 14+",
                            "Air (Go hot-reload)",
                            "One package manager: npm, yarn, pnpm, bun, or deno",
                        ],
                    },
                ],
            },
            {
                id: "installation",
                title: "Installation",
                content: [
                    {
                        type: "callout",
                        kind: "tip",
                        text: "On Linux, add $(go env GOPATH)/bin to your PATH to use arlo globally.",
                    },
                    { type: "h3", text: "Go install" },
                    { type: "code", lang: "bash", code: `go install github.com/JasnRathore/arlo@latest` },
                    {
                        type: "p",
                        text: "Ensure your Go bin directory is on PATH so the arlo command is available.",
                    },
                    {
                        type: "code", lang: "powershell", code: `arlo --help`
                    },
                    { type: "h3", text: "Download Release Setup" },
                    {
                        type: "p",
                        text: "Download the latest release Setup",
                    },
                    {
                        type: "download",
                        label: "Download latest release",
                        file: "ArloSetup.exe",
                        url: "https://github.com/JasnRathore/arlo/releases/download/v0.1.1/ArloSetup@0.1.1.exe",
                    },
                    {
                        type: "ul",
                        items: [
                            "Run the installer and follow the prompts",
                        ],
                    }, {
                        type: "p",
                        text: "Run the binary",
                    },
                    {
                        type: "code", lang: "powershell", code: `arlo --help`
                    }, { type: "h3", text: "Download binary" },
                    {
                        type: "p",
                        text: "Download the latest release asset and add it to your PATH.",
                    },
                    {
                        type: "download",
                        label: "Download latest release",
                        file: "arlo.exe",
                        url: "https://github.com/JasnRathore/arlo/releases/download/v0.1.1/arlo.exe",
                    },
                    {
                        type: "ul",
                        items: [
                            "Add the exe to your PATH",
                        ],
                    },
                    {
                        type: "p",
                        text: "Run the binary",
                    },
                    {
                        type: "code", lang: "powershell", code: `arlo --help`
                    },
                    { type: "h3", text: "Build from source" },
                    {
                        type: "code",
                        lang: "bash",
                        code: `git clone https://github.com/JasnRathore/arlo
cd arlo`,
                    },
                    { type: "code", lang: "bash", code: `go build -o arlo` },
                    {
                        type: "code", lang: "powershell", code: `arlo --help`
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
                            ["init (-i)", "Initialize a new project"],
                            ["dev (-d)", "Start the dev environment"],
                            ["build (-b)", "Build the production binary"],
                            ["upgrade (-u)", "Upgrade Arlo"],
                            ["version (-v)", "Print version"],
                            ["help (-h)", "Show help"],
                        ],
                    },
                ],
            },
            {
                id: "getting-started",
                title: "Getting Started",
                content: [
                    { type: "p", text: "Create a new project with the interactive initializer:" },
                    { type: "code", lang: "bash", code: `arlo init` },
                    {
                        type: "p",
                        text: "The setup prompts for project name, package manager, framework choice (net/http or Gin), and installs dependencies.",
                    },
                ],
            },
            {
                id: "dev-workflow",
                title: "Development Workflow",
                content: [
                    { type: "code", lang: "bash", code: `arlo dev` },
                    {
                        type: "ul",
                        items: [
                            "Starts the frontend dev server with HMR.",
                            "Runs the Go backend with hot reload.",
                            "Proxies frontend requests to the backend API.",
                        ],
                    },
                ],
            },
            {
                id: "structure",
                title: "Project Structure",
                content: [
                    {
                        type: "code",
                        lang: "text",
                        code: `your-project/
├── src/                    # Frontend (Vite)
├── src-backend/            # Go backend
│   ├── app/                # HTTP handlers
│   ├── main.go             # Dev entry
│   ├── build.go            # Prod build config
│   └── .air.toml           # Hot reload config
├── arlo.config.json
└── .env`,
                    },
                ],
            },
            {
                id: "build",
                title: "Build",
                content: [
                    { type: "code", lang: "bash", code: `arlo build` },
                    {
                        type: "p",
                        text: "The output is a single binary with frontend assets embedded for distribution.",
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
        lang: "Go · Web UI",
        title: "Glide",
        tagline: "Build desktop apps with Go and your frontend.",
        description:
            "Glide bridges a Go backend with a modern JS/TS frontend to build native desktop apps with hot reload and a clean Go↔JS bridge.",
        accent: "#38bdf8",
        github: "https://github.com/JasnRathore/glide",
        chips: ["desktop", "Go", "frontend", "hot-reload", "WebView"],
        badge: "active",
        highlights: [
            { icon: "🖥️", label: "Native shell", text: "Uses the OS webview to render your frontend as a desktop app." },
            { icon: "🌐", label: "Any frontend", text: "React, Vue, Svelte, or vanilla — your choice." },
            { icon: "🔗", label: "Go bridge", text: "Call Go functions directly from JS/TS." },
        ],
        install: {
            defaultId: "go",
            methods: [
                {
                    id: "go",
                    label: "Go Install",
                    steps: [
                        {
                            kind: "command",
                            label: "Install the CLI",
                            shell: "bash",
                            command: "go install github.com/JasnRathore/glide@latest",
                        },
                        {
                            kind: "command",
                            label: "Initialize a project",
                            shell: "bash",
                            command: "glide init",
                        },
                        {
                            kind: "command",
                            label: "Start dev mode",
                            shell: "bash",
                            command: "glide dev",
                        },
                    ],
                },
                {
                    id: "setup",
                    label: "Download Setup",
                    steps: [
                        {
                            kind: "download",
                            label: "GlideSetup.exe",
                            url: "https://github.com/JasnRathore/glide/releases/download/v0.1.2/GlideSetup@v0.1.2.exe",
                        }, {
                            kind: "instruction",
                            label: "Run the installer and follow the prompts",
                        }, {
                            kind: "command",
                            label: "Run in PowerShell",
                            shell: "powershell",
                            command: "glide --help",
                        },
                    ],
                },
                {
                    id: "download",
                    label: "Download Binary",
                    steps: [
                        {
                            kind: "download",
                            label: "glide.exe",
                            url: "https://github.com/JasnRathore/glide/releases/download/v0.1.2/glide.exe",
                        }, {
                            kind: "instruction",
                            label: "Add the exe to your PATH",
                        }, {
                            kind: "command",
                            label: "Run in PowerShell",
                            shell: "powershell",
                            command: "glide --help",
                        },
                    ],
                },
                {
                    id: "build",
                    label: "Build From Source",
                    steps: [
                        {
                            kind: "command",
                            label: "Clone the repo",
                            shell: "bash",
                            command: "git clone https://github.com/JasnRathore/glide",
                        },
                        {
                            kind: "command",
                            label: "Build the binary",
                            shell: "bash",
                            command: "cd glide && go build -o glide",
                        },
                    ],
                },
            ],
        },
        docs: [
            {
                id: "overview",
                title: "Overview",
                content: [
                    {
                        type: "p",
                        text: "Glide combines a Go backend with a web-based frontend so you can build native desktop apps using your preferred JS framework.",
                    },
                ],
            },
            {
                id: "requirements",
                title: "Requirements",
                content: [
                    {
                        type: "ul",
                        items: [
                            "Go 1.21+",
                            "Node.js 14+",
                            "Air (Go hot-reload)",
                            "One package manager: npm, yarn, pnpm, bun, or deno",
                        ],
                    },
                ],
            },
            {
                id: "installation",
                title: "Installation",
                content: [
                    {
                        type: "callout",
                        kind: "tip",
                        text: "On Linux, add $(go env GOPATH)/bin to your PATH to use glide globally.",
                    },
                    { type: "h3", text: "Go install" },
                    { type: "code", lang: "bash", code: `go install github.com/JasnRathore/glide@latest` },
                    {
                        type: "p",
                        text: "Ensure your Go bin directory is on PATH so the glide command is available.",
                    },
                    {
                        type: "code", lang: "powershell", code: `glide --help`
                    }, { type: "h3", text: "Download Release Setup" },
                    {
                        type: "p",
                        text: "Download the latest release Setup",
                    },
                    {
                        type: "download",
                        label: "Download latest release",
                        file: "GlideSetup.exe",
                        url: "https://github.com/JasnRathore/glide/releases/download/v0.1.2/GlideSetup@v0.1.2.exe",
                    },
                    {
                        type: "ul",
                        items: [
                            "Run the installer and follow the prompts",
                        ],
                    }, {
                        type: "p",
                        text: "Run the binary",
                    },
                    {
                        type: "code", lang: "powershell", code: `glide --help`
                    }, { type: "h3", text: "Download binary" },
                    {
                        type: "p",
                        text: "Download the latest release asset and add it to your PATH.",
                    },
                    {
                        type: "download",
                        label: "Download latest release",
                        file: "glide.exe",
                        url: "https://github.com/JasnRathore/glide/releases/download/v0.1.2/glide.exe",
                    }, {
                        type: "ul",
                        items: [
                            "Add the exe to your PATH",
                        ],
                    },
                    {
                        type: "p",
                        text: "Run the binary",
                    },
                    {
                        type: "code", lang: "powershell", code: `glide --help`
                    },
                    { type: "h3", text: "Build from source" },
                    {
                        type: "code",
                        lang: "bash",
                        code: `git clone https://github.com/JasnRathore/glide
cd glide`,
                    },
                    { type: "code", lang: "bash", code: `go build -o glide` },
                ],
            },
            {
                id: "create-project",
                title: "Create a Project",
                content: [
                    { type: "code", lang: "bash", code: `glide init` },
                    {
                        type: "p",
                        text: "The initializer scaffolds a Vite frontend, sets up the Go backend, and configures hot reload.",
                    },
                ],
            },
            {
                id: "dev-workflow",
                title: "Development Workflow",
                content: [
                    { type: "code", lang: "bash", code: `glide dev` },
                    {
                        type: "ul",
                        items: [
                            "Starts the frontend dev server.",
                            "Runs the Go backend with hot reload via Air.",
                            "Connects the frontend and backend bridge.",
                        ],
                    },
                ],
            },
            {
                id: "bridge",
                title: "Go ↔ JS Bridge",
                content: [
                    {
                        type: "code",
                        lang: "javascript",
                        code: `import { callWindowFunction } from './glide/glide.js'

const greeting = callWindowFunction('Greet', 'World')
console.log(greeting)`,
                    },
                    {
                        type: "code",
                        lang: "go",
                        code: `func Greet(name string) string {
    return fmt.Sprintf("Hello, %s", name)
}

func App() *glide.App {
    funcs := []interface{}{Greet}
    app.InvokeHandler(funcs)
    return app
}`,
                    },
                ],
            },
            {
                id: "build",
                title: "Build",
                content: [
                    { type: "code", lang: "bash", code: `glide build` },
                    {
                        type: "p",
                        text: "The compiled binary lands in src-glide/target and includes your frontend assets.",
                    },
                ],
            },
            {
                id: "structure",
                title: "Project Structure",
                content: [
                    {
                        type: "code",
                        lang: "text",
                        code: `your-project/
├── src/                # Frontend (Vite)
│   └── glide/          # Glide JS/TS utilities
├── src-glide/          # Go backend
│   ├── app/
│   ├── main.go
│   ├── build.go
│   └── .air.toml
└── glide.config.json`,
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
        lang: "Go · PowerShell",
        title: "Project Aliaser",
        tagline: "Jump to any folder with a short alias.",
        description:
            "Project Aliaser is a Windows-first CLI + TUI that stores directory aliases in SQLite and lets you navigate with a single short command.",
        accent: "#a78bfa",
        github: "https://github.com/JasnRathore/project-aliaser",
        chips: ["CLI", "TUI", "aliases", "Windows", "SQLite"],
        badge: "stable",
        highlights: [
            { icon: "🗂️", label: "Short aliases", text: "Create readable shortcuts for deep project paths." },
            { icon: "🔍", label: "Fuzzy search", text: "Find aliases even if you only remember part of the name." },
            { icon: "💾", label: "Persistent", text: "Aliases live in %LOCALAPPDATA% and survive reboots." },
        ],
        install: {
            defaultId: "setup",
            methods: [
                {
                    id: "setup",
                    label: "Download Setup",
                    steps: [
                        {
                            kind: "download",
                            label: "ProjectAliaserSetup.exe",
                            url: "https://github.com/JasnRathore/project-aliaser/releases/download/0.2.0/ProjectAliaserSetup@v0.2.0.exe",
                        }, {
                            kind: "instruction",
                            label: "Run the installer and follow the prompts",
                        }, {
                            kind: "command",
                            label: "Run in PowerShell",
                            shell: "powershell",
                            command: "pa",
                        },
                    ],
                },
                {
                    id: "download",
                    label: "Download Binary",
                    steps: [
                        {
                            kind: "download",
                            label: "ProjectAliaser.zip",
                            url: "https://github.com/JasnRathore/project-aliaser/releases/download/0.2.0/ProjectAliaser@v0.2.0.zip",
                        }, {
                            kind: "instruction",
                            label: "Extract the files into a folder",
                        }, {
                            kind: "instruction",
                            label: "Add the folder to your PATH",
                        }, {
                            kind: "command",
                            label: "Run in PowerShell",
                            shell: "powershell",
                            command: "pa",
                        },
                    ],
                },
                {
                    id: "build",
                    label: "Build From Source",
                    steps: [
                        {
                            kind: "command",
                            label: "Clone the repo",
                            shell: "powershell",
                            command: "git clone https://github.com/JasnRathore/project-aliaser",
                        },
                        {
                            kind: "command",
                            label: "Build the binary",
                            shell: "powershell",
                            command: "cd project-aliaser && go build",
                        },
                        {
                            kind: "command",
                            label: "Run in PowerShell",
                            shell: "powershell",
                            command: "./pa.exe",
                        },
                    ],
                },
            ],
        },
        docs: [
            {
                id: "overview",
                title: "Overview",
                content: [
                    {
                        type: "p",
                        text: "Project Aliaser lets you create short aliases for long directory paths and jump to them instantly in PowerShell.",
                    },
                ],
            },
            {
                id: "requirements",
                title: "Requirements",
                content: [
                    {
                        type: "ul",
                        items: [
                            "Windows with PowerShell",
                            "Go 1.22.1+ (for building from source)",
                            "SQLite (handled automatically)",
                        ],
                    },
                ],
            },
            {
                id: "installation",
                title: "Installation",
                content: [
                    { type: "h3", text: "Build from source" },
                    {
                        type: "code",
                        lang: "powershell",
                        code: `git clone https://github.com/JasnRathore/project-aliaser
cd project-aliaser`,
                    },
                    { type: "code", lang: "powershell", code: `go build` },
                    {
                        type: "p",
                        text: "Keep pa.ps1 and lib.psm1 in the same directory as the executable, add the folder to PATH, then run pa in PowerShell.",
                    },
                    {
                        type: "ul",
                        items: [
                            "Add the folder to your PATH",
                        ],
                    },
                    {
                        type: "p",
                        text: "Run the binary",
                    },
                    { type: "code", lang: "powershell", code: `./pa.exe` },
                    { type: "h3", text: "Download Release Binary" },
                    {
                        type: "p",
                        text: "Download the latest release ZIP",
                    },
                    {
                        type: "download",
                        label: "Download latest release",
                        file: "ProjectAliaser.zip",
                        url: "https://github.com/JasnRathore/project-aliaser/releases/download/0.2.0/ProjectAliaser@v0.2.0.zip",
                    },
                    {
                        type: "ul",
                        items: [
                            "Extract the files into a folder",
                            "Add the folder to your PATH",
                        ],
                    },
                    {
                        type: "p",
                        text: "Run the binary",
                    },
                    { type: "code", lang: "powershell", code: `pa` },
                    { type: "h3", text: "Download Release Setup" },
                    {
                        type: "p",
                        text: "Download the latest release Setup",
                    },
                    {
                        type: "download",
                        label: "Download latest release",
                        file: "ProjectAliaserSetup.exe",
                        url: "https://github.com/JasnRathore/project-aliaser/releases/download/0.2.0/ProjectAliaserSetup@v0.2.0.exe",
                    },
                    {
                        type: "ul",
                        items: [
                            "Run the installer and follow the prompts",
                        ],
                    },
                    {
                        type: "p",
                        text: "Run the binary",
                    },
                    { type: "code", lang: "powershell", code: `pa` },
                ],
            },
            {
                id: "usage",
                title: "Usage",
                content: [
                    {
                        type: "code",
                        lang: "powershell",
                        code: `# Add an alias to the current directory
pa add projects .

# Add an alias to a specific path
pa add documents "C:\\Users\\username\\Documents"

# List aliases
pa list

# Jump to an alias
pa projects

# Delete an alias
pa delete projects`,
                    },
                ],
            },
            {
                id: "tui",
                title: "Interactive UI",
                content: [
                    {
                        type: "p",
                        text: "Run pa with no arguments to open the TUI.",
                    },
                    {
                        type: "ul",
                        items: [
                            "Use arrow keys or j/k to navigate.",
                            "Press Enter to select and jump.",
                            "Press q to quit.",
                            "Use the Search screen for fuzzy lookup.",
                        ],
                    },
                ],
            },
            {
                id: "storage",
                title: "Storage",
                content: [
                    {
                        type: "p",
                        text: "Aliases are stored in %LOCALAPPDATA%\\ProjectAliaser as aliases.db. A mid_file.json file is used to pass the selected path to the PowerShell wrapper.",
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
        title: "JCommandChain",
        tagline: "Alias commands and run them together.",
        description:
            "JCommandChain lets you define command aliases and run multiple commands concurrently or sequentially with a single short command.",
        accent: "#f472b6",
        github: "https://github.com/JasnRathore/JCommandChain",
        chips: ["CLI", "aliases", "concurrent", "automation"],
        badge: "stable",
        highlights: [
            { icon: "⛓️", label: "Alias commands", text: "Map long scripts to short names you can remember." },
            { icon: "🔀", label: "Run multiple", text: "Launch several commands at once for dev workflows." },
            { icon: "🧾", label: "JSON config", text: "Simple jcc.config.json with aliases and command groups." },
        ],
        install: {
            defaultId: "setup",
            methods: [
                {
                    id: "setup",
                    label: "Download Setup",
                    steps: [
                        {
                            kind: "download",
                            label: "JCommandChainSetup.exe",
                            url: "https://github.com/JasnRathore/JCommandChain/releases/download/v0.1.1/JCommandChainSetup@v0.1.1.exe",
                        }, {
                            kind: "instruction",
                            label: "Run the installer and follow the prompts",
                        }, {
                            kind: "command",
                            label: "Run in PowerShell",
                            shell: "powershell",
                            command: "jcc init",
                        },
                    ],
                },
                {
                    id: "download",
                    label: "Download Binary",
                    steps: [
                        {
                            kind: "download",
                            label: "jcc.exe",
                            url: "https://github.com/JasnRathore/JCommandChain/releases/download/v0.1.1/jcc.exe",
                        },
                        {
                            kind: "instruction",
                            label: "Add the exe to your PATH",
                        }, {
                            kind: "command",
                            label: "Run in PowerShell",
                            shell: "powershell",
                            command: "jcc init",
                        },
                    ],
                },
                {
                    id: "build",
                    label: "Build From Source",
                    steps: [
                        {
                            kind: "command",
                            label: "Clone the repo",
                            shell: "powershell",
                            command: "git clone https://github.com/JasnRathore/JCommandChain",
                        },
                        {
                            kind: "command",
                            label: "Build the binary",
                            shell: "powershell",
                            command: "cd JCommandChain && go build -o jcc.exe",
                        },
                        {
                            kind: "command",
                            label: "Create config",
                            shell: "powershell",
                            command: "jcc --init",
                        },
                    ],
                },
            ],
        },
        docs: [
            {
                id: "overview",
                title: "Overview",
                content: [
                    {
                        type: "p",
                        text: "JCommandChain (JCC) is a small CLI that lets you alias commands and run multiple commands concurrently from a single name.",
                    },
                    {
                        type: "callout",
                        kind: "info",
                        text: "Currently tested on Windows.",
                    },
                ],
            },
            {
                id: "installation",
                title: "Installation",
                content: [{ type: "h3", text: "Download Release Setup" },
                {
                    type: "p",
                    text: "Download the latest release Setup",
                },
                {
                    type: "download",
                    label: "Download latest release",
                    file: "JCommandChainSetup.exe",
                    url: "https://github.com/JasnRathore/JCommandChain/releases/download/v0.1.1/JCommandChainSetup@v0.1.1.exe",
                },
                {
                    type: "ul",
                    items: [
                        "Run the installer and follow the prompts",
                    ],
                }, {
                    type: "p",
                    text: "Run the binary",
                },
                {
                    type: "code", lang: "powershell", code: `jcc init`
                },
                { type: "h3", text: "Download release" },
                {
                    type: "download",
                    label: "Download latest release",
                    file: "jcc.exe",
                    url: "https://github.com/JasnRathore/JCommandChain/releases/download/v0.1.1/jcc.exe",
                },
                {
                    type: "ul",
                    items: [
                        "Add the exe to your PATH",
                    ],
                },
                {
                    type: "p",
                    text: "Run the binary",
                },
                {
                    type: "code", lang: "powershell", code: `jcc init`
                },
                { type: "h3", text: "Build from source" },
                {
                    type: "code",
                    lang: "powershell",
                    code: `git clone https://github.com/JasnRathore/JCommandChain
cd JCommandChain`,
                },
                { type: "code", lang: "powershell", code: `go build -o jcc.exe` },
                ],
            },
            {
                id: "init",
                title: "Initialize Config",
                content: [
                    {
                        type: "p",
                        text: "Create a config file in the current directory:",
                    },
                    { type: "code", lang: "powershell", code: `jcc --init` },
                    {
                        type: "p",
                        text: "If the exe is not on PATH:",
                    },
                    { type: "code", lang: "powershell", code: `./jcc.exe --init` },
                ],
            },
            {
                id: "config",
                title: "Configuration",
                content: [
                    {
                        type: "p",
                        text: "JCC reads jcc.config.json with aliases and grouped commands:",
                    },
                    {
                        type: "code",
                        lang: "json",
                        code: `{
  "aliases": {
    "client": "LiveReloadWebServer 'path/client' --port 1200 -useSsl --useLiveReload",
    "tailwind": "npx tailwindcss -i ./client/input.css -o ./client/output.css --watch"
  },
  "multiple": {
    "run": ["client", "tailwind"]
  }
}`,
                    },
                    { type: "h3", text: "Rules" },
                    {
                        type: "ul",
                        items: [
                            "Do not use the same name in aliases and multiple.",
                            "Do not put raw commands inside multiple; use alias names.",
                        ],
                    },
                ],
            },
            {
                id: "usage",
                title: "Usage",
                content: [
                    {
                        type: "code",
                        lang: "powershell",
                        code: `# Run a single alias
jcc client

# Run multiple aliases directly
jcc client tailwind

# Run a named group from config
jcc run`,
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
        tagline: "Fullscreen, keyboard-first code editor.",
        description:
            "Jyntaxe is a minimalist fullscreen editor built with Tauri, React, and Rust — fast file I/O, fuzzy search, and persistent sessions.",
        accent: "#FF6B2B",
        github: "https://github.com/JasnRathore/jyntaxe",
        chips: ["editor", "fullscreen", "Tauri", "Rust", "React"],
        badge: "in dev",
        downloadable: {
            enabled: false,
            reason: "Currently in early development with a focus on core features and stability. Will enable downloads once it's ready for wider testing.",
        },
        highlights: [
            { icon: "⌨️", label: "Keyboard-first", text: "Command palette, quick open, and file switcher on one hand." },
            { icon: "🧠", label: "Session memory", text: "Reopens your last folder and files on launch." },
            { icon: "⚡", label: "Native speed", text: "Rust-powered file operations inside a tiny Tauri binary." },
        ],
        install: {
            defaultId: "release",
            methods: [
                {
                    id: "release",
                    label: "Download Installer",
                    steps: [
                        {
                            kind: "download",
                            label: "jyntaxe-setup.exe",
                            url: "https://github.com/JasnRathore/jyntaxe/releases/latest/download/jyntaxe-setup.exe",
                        },
                    ],
                },
                {
                    id: "build",
                    label: "Build From Source",
                    steps: [
                        {
                            kind: "command",
                            label: "Clone the repo",
                            shell: "bash",
                            command: "git clone https://github.com/JasnRathore/jyntaxe",
                        },
                        {
                            kind: "command",
                            label: "Install dependencies",
                            shell: "bash",
                            command: "cd jyntaxe && npm install",
                        },
                        {
                            kind: "command",
                            label: "Build the installer",
                            shell: "bash",
                            command: "cd jyntaxe && npm run tauri build",
                        },
                    ],
                },
            ],
        },
        docs: [
            {
                id: "overview",
                title: "Overview",
                content: [
                    {
                        type: "p",
                        text: "Jyntaxe is a lightweight fullscreen code editor designed for keyboard-driven workflows. It keeps the UI minimal so your code stays front and center.",
                    },
                    {
                        type: "callout",
                        kind: "info",
                        text: "Currently tested and supported on Windows only.",
                    },
                ],
            },
            {
                id: "features",
                title: "Features",
                content: [
                    {
                        type: "ul",
                        items: [
                            "Command palette with fuzzy search.",
                            "Quick open (Ctrl+P) across the current folder.",
                            "Open file/folder dialogs and multi-file tabs.",
                            "Toast notifications for saves and errors.",
                            "Persistent session state across restarts.",
                        ],
                    },
                ],
            },
            {
                id: "requirements",
                title: "Requirements",
                content: [
                    {
                        type: "ul",
                        items: [
                            "Node.js 18+",
                            "Rust stable toolchain",
                            "Tauri CLI prerequisites (including WebView2 on Windows)",
                            "Tailwind CSS CLI (via PostCSS in the build)",
                        ],
                    },
                ],
            },
            {
                id: "installation",
                title: "Installation",
                content: [
                    { type: "h3", text: "Download installer" },
                    {
                        type: "download",
                        label: "Download latest installer",
                        file: "jyntaxe-setup.exe",
                        url: "https://github.com/JasnRathore/jyntaxe/releases/latest",
                    },
                    {
                        type: "p",
                        text: "Run the installer, then launch Jyntaxe from the Start menu or desktop shortcut.",
                    },
                    { type: "h3", text: "Build from source" },
                    {
                        type: "code",
                        lang: "bash",
                        code: `git clone https://github.com/JasnRathore/jyntaxe
cd jyntaxe`,
                    },
                    { type: "code", lang: "bash", code: `npm install` },
                    { type: "code", lang: "bash", code: `npm run tauri build` },
                ],
            },
            {
                id: "development",
                title: "Development",
                content: [
                    { type: "code", lang: "bash", code: `npm run tauri dev` },
                    {
                        type: "callout",
                        kind: "info",
                        text: "Opening a new window (Ctrl+Shift+N) does not work in dev mode; it relies on the compiled binary path.",
                    },
                ],
            },
            {
                id: "build",
                title: "Production Build",
                content: [
                    { type: "code", lang: "bash", code: `npm run tauri build` },
                    {
                        type: "p",
                        text: "Installers and executables are output to src-tauri/target/release/bundle/.",
                    },
                ],
            },
            {
                id: "keybindings",
                title: "Keybindings",
                content: [
                    {
                        type: "table",
                        headers: ["Action", "Keybinding"],
                        rows: [
                            ["Command palette", "Ctrl + Shift + P"],
                            ["Open file", "Ctrl + O"],
                            ["Open folder", "Ctrl + K → O"],
                            ["New file", "Ctrl + N"],
                            ["Save", "Ctrl + S"],
                            ["Close file", "Ctrl + W"],
                            ["Quick open", "Ctrl + P"],
                            ["Switch file (prev)", "Alt + ,"],
                            ["Switch file (next)", "Alt + ."],
                            ["New window", "Ctrl + Shift + N"],
                            ["Close application", "Ctrl + Q"],
                        ],
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
