/**
 * ZyraCSS Vite Plugin
 * Enables @import "zyracss" directive in CSS files
 * Updated to use modern zyra namespace API
 */

import { zyra } from "zyracss";
// Direct internal import for Vite plugin efficiency
import { zyraExtractClassFromHTML } from "zyracss/internal";
import fs from "fs";
import path from "path";

function getSmartContentPatterns() {
  const patterns = ["./src/**/*.{js,jsx,ts,tsx,html}"];

  if (fs.existsSync("pages")) {
    patterns.push("./pages/**/*.{js,jsx,ts,tsx,html}");
  }
  if (fs.existsSync("components") && !fs.existsSync("src/components")) {
    patterns.push("./components/**/*.{js,jsx,ts,tsx,html}");
  }
  if (fs.existsSync("app") && !fs.existsSync("src/app")) {
    patterns.push("./app/**/*.{js,jsx,ts,tsx,html}");
  }

  patterns.push("./*.{html,js,jsx,ts,tsx}");
  return patterns;
}

const defaultConfig = {
  output: "inline",
  outputPath: "dist/zyracss.css",
  content: null,
  minify: true,
  watch: true,
  debug: false,
};

export function zyracss(userConfig = {}) {
  const config = {
    ...defaultConfig,
    content: getSmartContentPatterns(),
    ...userConfig,
  };

  let cachedCSS = "";
  let cachedClasses = new Set();
  let lastScanTime = 0;

  // Load config file if it exists (ES module support)
  const loadConfigFile = async () => {
    try {
      const configPath = path.resolve(process.cwd(), "zyracss.config.js");
      if (fs.existsSync(configPath)) {
        const configUrl = `file://${configPath}?t=${Date.now()}`;
        const userFileConfig = await import(configUrl);
        const configData = userFileConfig.default || userFileConfig;

        if (configData && typeof configData === "object") {
          Object.assign(config, configData);
          if (config.debug) {
            console.log("🎨 ZyraCSS: Config file loaded successfully");
          }
        }
      }
    } catch (error) {
      // Config is optional, silently continue
    }
  };

  const plugin = {
    name: "zyracss",
    enforce: "pre",

    async configResolved() {
      await loadConfigFile();
    },

    resolveId(id, importer) {
      // Intercept @import "zyracss" to prevent resolving to main JS file
      if (id === "zyracss" && importer && importer.endsWith(".css")) {
        return "\0virtual:zyracss.css"; // Virtual CSS module ID
      }
    },

    load(id) {
      // Return empty CSS for the virtual module that will be processed by transform
      if (id === "\0virtual:zyracss.css") {
        return "/* ZyraCSS placeholder - will be replaced by transform hook */";
      }
    },

    scanForClasses() {
      const allClasses = new Set();

      // Simple file scanner that works without additional dependencies
      const scanFiles = (pattern) => {
        const files = [];

        // Handle basic patterns like "./src/**/*.{js,jsx,ts,tsx,html}"
        const baseDir = pattern.split("*")[0] || "./";
        const extensions = pattern.match(/\{([^}]+)\}/)?.[1]?.split(",") || [
          "js",
          "jsx",
          "ts",
          "tsx",
          "html",
        ];

        const walkDir = (dir) => {
          if (!fs.existsSync(dir)) return;

          try {
            const items = fs.readdirSync(dir);
            for (const item of items) {
              if (
                item === "node_modules" ||
                item === ".git" ||
                item === "dist" ||
                item === "build" ||
                item.startsWith(".")
              ) {
                continue;
              }

              const fullPath = path.join(dir, item);
              try {
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                  walkDir(fullPath);
                } else if (stat.isFile()) {
                  const ext = path.extname(item).substring(1);
                  if (extensions.includes(ext)) {
                    files.push(fullPath);
                  }
                }
              } catch (error) {
                continue;
              }
            }
          } catch (error) {
            return;
          }
        };

        walkDir(baseDir);
        return files;
      };

      try {
        for (const pattern of config.content) {
          try {
            const files = scanFiles(pattern);

            if (config.debug && files.length > 0) {
              console.log(
                `🎨 ZyraCSS: Pattern "${pattern}" matched ${files.length} files`
              );
            }

            for (const file of files) {
              try {
                if (fs.existsSync(file)) {
                  const content = fs.readFileSync(file, "utf-8");
                  const classes = zyraExtractClassFromHTML(content);
                  classes.forEach((cls) => allClasses.add(cls));
                }
              } catch (error) {
                continue;
              }
            }
          } catch (error) {
            if (config.debug) {
              console.warn(
                `🎨 ZyraCSS: Error processing pattern "${pattern}":`,
                error.message
              );
            }
          }
        }
      } catch (error) {
        if (config.debug) {
          console.warn(
            "🎨 ZyraCSS: Error scanning for classes:",
            error.message
          );
        }
      }

      cachedClasses = new Set(allClasses);
      return Array.from(allClasses);
    },

    generateZyraCSS() {
      const now = Date.now();

      if (cachedCSS && now - lastScanTime < 100) {
        if (config.debug) {
          console.log("🎨 ZyraCSS: Using cached CSS");
        }
        return cachedCSS;
      }

      const classes = this.scanForClasses();

      if (config.debug) {
        console.log(`🎨 ZyraCSS: Found ${classes.length} classes to process`);
      }

      if (classes.length === 0) {
        cachedCSS = "/* No ZyraCSS classes found */";
        lastScanTime = now;
        if (config.debug) {
          console.warn("🎨 ZyraCSS: No classes found in scanned files");
        }
        return cachedCSS;
      }

      try {
        const result = zyra.generate(classes, {
          minify: config.minify,
          groupSelectors: true,
        });

        if (result.success) {
          cachedCSS = result.data.css;
          lastScanTime = now;

          if (config.debug) {
            console.log(
              `🎨 ZyraCSS: Generated ${result.data.css.length} characters of CSS from ${classes.length} classes`
            );
          }

          return cachedCSS;
        } else {
          console.error("🚨 ZyraCSS generation failed:", result.error);
          cachedCSS = `/* ZyraCSS generation failed: ${result.error} */`;
          lastScanTime = now;
          return cachedCSS;
        }
      } catch (error) {
        console.error("🚨 ZyraCSS generation error:", error.message);
        cachedCSS = `/* ZyraCSS generation error: ${error.message} */`;
        lastScanTime = now;
        return cachedCSS;
      }
    },

    async transform(code, id) {
      if (id === "\0virtual:zyracss.css") {
        return plugin.generateZyraCSS();
      }

      if (id.endsWith(".css") && code.includes('@import "zyracss"')) {
        const generatedCSS = plugin.generateZyraCSS();

        if (config.output === "file") {
          const outputDir = path.dirname(config.outputPath);
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }
          fs.writeFileSync(config.outputPath, generatedCSS);

          const relativePath = path.relative(
            path.dirname(id),
            config.outputPath
          );
          return code.replace(
            '@import "zyracss";',
            `@import "${relativePath}";`
          );
        } else {
          return code.replace('@import "zyracss";', generatedCSS);
        }
      }

      return null;
    },

    configureServer(server) {
      console.log("ZyraCSS Vite Plugin loaded");

      if (config.watch) {
        let watchTimeout;
        const watchers = new Set();

        const watchFiles = (changedFile) => {
          clearTimeout(watchTimeout);
          watchTimeout = setTimeout(() => {
            cachedCSS = "";
            cachedClasses.clear(); // CRITICAL: Clear cached classes!
            lastScanTime = 0;

            if (config.debug) {
              console.log(
                `🎨 ZyraCSS: File change detected${changedFile ? ` in ${changedFile}` : ""}, clearing caches`
              );
            }

            // Trigger HMR for CSS files with @import "zyracss"
            for (const [id, module] of server.moduleGraph.idToModuleMap) {
              if (id.endsWith(".css") && module.file) {
                try {
                  const cssContent = fs.readFileSync(module.file, "utf-8");
                  if (cssContent.includes('@import "zyracss"')) {
                    server.moduleGraph.invalidateModule(module);

                    server.ws.send({
                      type: "update",
                      updates: [
                        {
                          type: "js-update",
                          path: module.url || id,
                          acceptedPath: module.url || id,
                          timestamp: Date.now(),
                        },
                      ],
                    });
                  }
                } catch (error) {
                  // Ignore errors
                }
              }
            }
          }, 100);
        };

        // Watch directories based on content patterns
        const watchedDirs = new Set();
        for (const pattern of config.content) {
          try {
            const baseDir = pattern.split("*")[0].replace(/\/$/, "") || "./";
            if (!watchedDirs.has(baseDir) && fs.existsSync(baseDir)) {
              watchedDirs.add(baseDir);
              const watcher = fs.watch(
                baseDir,
                { recursive: true },
                (eventType, filename) => {
                  if (
                    filename &&
                    /\.(js|jsx|ts|tsx|html|vue|svelte)$/.test(filename)
                  ) {
                    watchFiles(path.join(baseDir, filename));
                  }
                }
              );
              watchers.add(watcher);
            }
          } catch (error) {
            // Ignore watch errors
          }
        }

        // Clean up watchers on server close
        if (server.httpServer && server.httpServer.on) {
          server.httpServer.on("close", () => {
            watchers.forEach((watcher) => {
              try {
                if (watcher.close) watcher.close();
              } catch (error) {
                // Ignore cleanup errors
              }
            });
            watchers.clear();
          });
        }
      }
    },

    handleHotUpdate({ file, server }) {
      const shouldReload = config.content.some((pattern) => {
        const normalizedPattern = pattern.replace(/\\/g, "/");
        const filePattern = normalizedPattern
          .replace(/\*\*/g, ".*")
          .replace(/\*/g, "[^/]*")
          .replace(/\./g, "\\.")
          .replace(/\{([^}]+)\}/g, "($1)")
          .replace(/,/g, "|");

        const regex = new RegExp(filePattern);
        const relativePath = path
          .relative(process.cwd(), file)
          .replace(/\\/g, "/");
        return regex.test(relativePath) || regex.test("./" + relativePath);
      });

      if (shouldReload) {
        cachedCSS = "";
        cachedClasses.clear(); // CRITICAL: Clear cached classes!
        lastScanTime = 0;

        const modulesToUpdate = [];

        for (const [id, module] of server.moduleGraph.idToModuleMap) {
          if (id.endsWith(".css") && module.file) {
            try {
              const cssContent = fs.readFileSync(module.file, "utf-8");
              if (cssContent.includes('@import "zyracss"')) {
                modulesToUpdate.push(module);
                server.moduleGraph.invalidateModule(module);
              }
            } catch (error) {
              // Ignore errors
            }
          }
        }

        const virtualModule = server.moduleGraph.getModuleById(
          "\0virtual:zyracss.css"
        );
        if (virtualModule) {
          modulesToUpdate.push(virtualModule);
          server.moduleGraph.invalidateModule(virtualModule);
        }

        return modulesToUpdate;
      }
    },
  };

  return plugin;
}

export default zyracss;
