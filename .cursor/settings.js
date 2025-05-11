{
  "editor": {
    "tabSize": 2,
    "formatOnSave": true,
    "defaultFormatter": "prettier",
    "guides": {
      "bracketPairs": true
    },
    "bracketPairColorization": {
      "enabled": true
    },
    "fontSize": 14,
    "fontFamily": "Menlo, Monaco, 'Courier New', monospace",
    "wordWrap": "off",
    "insertSpaces": true,
    "trimTrailingWhitespace": true,
    "detectIndentation": true,
    "roundedSelection": true,
    "scrollBeyondLastLine": true,
    "minimap": {
      "enabled": true
    }
  },
  "files": {
    "eol": "\n",
    "insertFinalNewline": true,
    "trimFinalNewlines": true,
    "autoSave": "off",
    "associations": {
      "*.vue": "vue"
    }
  },
  "search": {
    "exclude": {
      "**/node_modules": true,
      "**/*.log": true,
      "**/*.log*": true,
      "**/bower_components": true,
      "**/dist": true,
      "**/elehukouben": true,
      "**/.git": true,
      "**/.gitignore": true,
      "**/.svn": true,
      "**/.DS_Store": true,
      "**/.idea": true,
      "**/.vscode": false,
      "**/yarn.lock": true,
      "**/tmp": true,
      "out": true,
      "dist": true,
      "node_modules": true,
      "CHANGELOG.md": true,
      "examples": true,
      "res": true,
      "screenshots": true,
      "yarn-error.log": true,
      "**/.yarn": true
    }
  },
  "workbench": {
    "colorTheme": "Default Dark+",
    "iconTheme": "vs-seti"
  },
  "vue": {
    "features": {
      "semanticTokens": true
    },
    "codeActions": {
      "enabled": true
    },
    "autoInsertOptions": {
      "enabled": true,
      "dotValue": true
    },
    "inlayHints": {
      "missingProps": true
    }
  },
  "typescript": {
    "updateImportsOnFileMove": {
      "enabled": "always"
    },
    "preferences": {
      "importModuleSpecifier": "relative"
    },
    "suggest": {
      "completeFunctionCalls": true
    },
    "validate": {
      "enable": true
    }
  },
  "javascript": {
    "updateImportsOnFileMove": {
      "enabled": "always"
    },
    "preferences": {
      "importModuleSpecifier": "relative"
    },
    "suggest": {
      "completeFunctionCalls": true
    },
    "validate": {
      "enable": true
    }
  },
  "eslint": {
    "validate": ["javascript", "javascriptreact", "typescript", "typescriptreact", "vue"],
    "useFlatConfig": true,
    "rules": {
      "customizations": [
        { "rule": "style/*", "severity": "off", "fixable": true },
        { "rule": "format/*", "severity": "off", "fixable": true },
        { "rule": "*-indent", "severity": "off", "fixable": true },
        { "rule": "*-spacing", "severity": "off", "fixable": true },
        { "rule": "*-spaces", "severity": "off", "fixable": true },
        { "rule": "*-order", "severity": "off", "fixable": true },
        { "rule": "*-dangle", "severity": "off", "fixable": true },
        { "rule": "*-newline", "severity": "off", "fixable": true },
        { "rule": "*quotes", "severity": "off", "fixable": true },
        { "rule": "*semi", "severity": "error", "fixable": true }
      ]
    }
  },
  "prettier": {
    "printWidth": 120,
    "singleQuote": true,
    "semi": true,
    "tabWidth": 2,
    "arrowParens": "avoid",
    "bracketSpacing": true,
    "trailingComma": "none"
  },
  "css": {
    "validate": false
  },
  "less": {
    "validate": false
  },
  "scss": {
    "validate": false,
    "lint": {
      "unknownAtRules": "ignore"
    }
  },
  "postcss": {
    "validate": false
  },
  "tailwindCSS": {
    "validate": true,
    "emmetCompletions": true,
    "includeLanguages": {
      "plaintext": "html",
      "vue": "html",
      "vue-html": "html"
    }
  },
  "path-intellisense": {
    "mappings": {
      "@/": "${workspaceRoot}/src"
    }
  }
} 