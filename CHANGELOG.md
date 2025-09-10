# Changelog

All notable changes to the ZyraCSS project are documented in this file.

## [0.1.0] - Initial Release

### **Core Features**

**CSS Generation Engine**

- Utility-first CSS generator with unlimited arbitrary values
- Clean bracket syntax: `padding-[20px]`, `c-[#3b82f6]`, `bg-[linear-gradient(45deg,red,blue)]`
- Support for 200+ CSS properties across 12 categories
- Advanced value validation with property-specific rules
- Built-in security validation and input sanitization

**Property Categories**

- **Layout**: Display, position, flexbox, grid, float, clear
- **Spacing**: Margin, padding with directional support (`mt-[10px]`, `px-[20px]`)
- **Sizing**: Width, height, min/max dimensions with calc() support
- **Typography**: Font properties, text styling, line-height, letter-spacing
- **Colors**: Full color support (hex, rgb, hsl, named colors, CSS variables)
- **Backgrounds**: Background properties, gradients, images, positioning
- **Borders**: Border styles, radius, individual sides (`border-t-[2px,solid,red]`)
- **Effects**: Box-shadow, text-shadow, opacity, filters, transforms
- **Animations**: Keyframes, transitions, transform functions
- **Interactive**: Cursor, pointer-events, user-select, touch-action
- **Overflow**: Scroll behavior, text overflow, visibility
- **Transform**: 2D/3D transforms, perspective, transform-origin
- **Print**: Print-specific styles and media queries

**Advanced Value Support**

- **CSS Functions**: `calc()`, `min()`, `max()`, `clamp()`, `var()`, `env()`
- **Color Functions**: `rgb()`, `hsl()`, `linear-gradient()`, `radial-gradient()`
- **Transform Functions**: All transform functions with proper validation
- **Filter Functions**: Blur, brightness, contrast, and all CSS filters
- **URL Handling**: Secure URL validation with `u()` syntax for safety
- **CSS Variables**: Full support for custom properties and fallbacks

### **Architecture & Performance**

**Enhanced Cache System**

- 250KB intelligent cache with LRU eviction
- Separate caches for parsing and CSS generation
- File modification tracking for efficient rebuilds
- Memory-efficient cache key generation
- Automatic cache cleanup and management

**Security Framework**

- Comprehensive input validation and sanitization
- XSS protection with pattern detection
- Safe regex execution with timeout protection
- URL sanitization and scheme validation
- Unicode support with security considerations
- Input length limits and DoS protection

**Modular Architecture**

- Clean separation of concerns across modules
- Property-specific validation rules
- Pluggable validator system
- Consistent error handling and reporting
- Type-safe validation with detailed metadata

### **Package Ecosystem**

**Core Package (`zyracss`)**

- Main CSS generation engine
- Browser and Node.js compatibility
- Runtime and build-time CSS generation
- Comprehensive API with TypeScript definitions
- Zero external dependencies

**Vite Plugin (`@zyracss/vite`)**

- Build-time CSS generation with Hot Module Replacement
- CSS directive support: `@import "zyracss"`
- Smart content detection across project files
- Automatic file watching and cache invalidation
- Framework-agnostic integration with any Vite-based project
- Development and production optimizations

**CLI Tool (`@zyracss/cli`)**

- Command-line interface for static websites
- File watching and live regeneration
- Batch processing of multiple files
- Customizable input/output paths
- Integration with build tools and CI/CD

### **Developer Experience**

**Integration Patterns**

- **Build-time**: Vite plugin for zero runtime overhead
- **Runtime**: Browser manager for dynamic class generation
- **Static**: CLI tool for pre-built websites
- **Hybrid**: Combined build-time and runtime approaches

**Development Tools**

- Comprehensive error messages with suggestions
- Debug modes for development insights
- Performance monitoring and statistics
- File change detection and incremental builds
- TypeScript support across all packages

**Configuration Options**

- Flexible content patterns for file scanning
- Customizable cache sizes and limits
- Security settings and validation levels
- Output formatting and minification
- Framework-specific optimizations

### 🛡️ **Security & Validation**

**Input Security**

- Pattern-based dangerous content detection
- XSS prevention and sanitization
- Safe regex execution with timeouts
- Unicode character validation
- Input length and complexity limits

**CSS Security**

- Safe CSS function validation
- URL scheme restrictions and validation
- Data URL security with type checking
- CSS injection prevention
- Property-value validation matching

**Error Handling**

- Structured error reporting with context
- Security violation logging and prevention
- Graceful degradation for invalid inputs
- Detailed validation feedback for debugging

### **Performance Optimizations**

**Processing Efficiency**

- Batch validation for better performance
- Efficient class collection and deduplication
- Smart caching with file modification tracking
- Memory-conscious data structures
- Optimized regex compilation and reuse

**Build Optimizations**

- Tree-shaking for unused CSS elimination
- CSS minification and optimization
- Incremental generation for large projects
- Parallel processing where applicable
- Efficient file I/O with streaming

### **Documentation & Examples**

**Comprehensive Guides**

- Step-by-step integration instructions
- Framework-specific setup guides
- API documentation with examples
- Troubleshooting and FAQ sections
- Performance optimization recommendations

**Example Projects**

- Build-time integration examples
- Runtime usage demonstrations
- CLI integration samples
- Hybrid approach implementations
- Framework-specific configurations

### **Testing & Quality**

**Comprehensive Test Suite**

- Property validation tests across 12 property categories
- Security validation and XSS prevention tests
- Performance benchmarking and stress tests
- Browser compatibility validation
- CLI functionality testing
- 25+ specialized test files covering all aspects

**Quality Assurance**

- Type checking with TypeScript definitions
- ESLint configuration for code quality
- Automated testing in CI/CD pipelines
- Cross-platform compatibility testing
- Memory usage and performance monitoring

### **Notable Technical Achievements**

**Smart Content Detection**

- Automatic detection of common project patterns
- Intelligent content pattern generation for different project structures
- Smart directory scanning (src/, pages/, components/, app/)
- Seamless integration across different build setups

**Advanced CSS Features**

- Full CSS Grid and Flexbox support
- Container query properties support
- CSS custom properties and calculations
- Complex selector and pseudo-class support
- Print media and responsive design utilities

**Cross-Platform Compatibility**

- Browser environment detection and adaptation
- Node.js and bundler compatibility
- Universal module format support
- Consistent behavior across environments
- Fallback mechanisms for edge cases

---
