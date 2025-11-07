# Contributing to Neural Network Builder

Thank you for your interest in contributing! This document provides guidelines for contributing to the Neural Network Builder project.

## 🎯 Ways to Contribute

- **Bug Reports**: Found a bug? Open an issue with detailed steps to reproduce
- **Feature Requests**: Have an idea? Share it in GitHub issues
- **Code Contributions**: Submit pull requests for bug fixes or new features
- **Documentation**: Improve README, guides, or code comments
- **Examples**: Create and share architecture configurations
- **Testing**: Test on different browsers and report compatibility issues

---

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome 60+, Firefox 55+, Safari 12+, Edge 16+)
- Text editor (VS Code, Sublime, Atom, etc.)
- Basic knowledge of HTML, CSS, and JavaScript (ES6+)
- Git for version control

### Development Setup

1. **Fork the Repository**
   ```bash
   # On GitHub, click "Fork" button
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Neural-Network-Builder.git
   cd Neural-Network-Builder
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

4. **Start Developing**
   ```bash
   # Simply open netbuilder.html in your browser
   # No build process required!
   ```

---

## 📋 Development Guidelines

### Code Style

#### JavaScript
```javascript
// Use descriptive variable names
const architectureConfig = { };  // Good
const ac = { };                  // Bad

// Use ES6+ features
const myFunction = () => { };    // Good
function myFunction() { }         // Acceptable

// Comment complex logic
// Calculate FLOPs for convolutional layer
// FLOPs = 2 * H * W * C_in * C_out * K * K
const flops = 2 * h * w * c * filters * kernelSize * kernelSize;

// Use consistent indentation (2 spaces)
function example() {
  if (condition) {
    doSomething();
  }
}
```

#### HTML
```html
<!-- Use semantic elements -->
<section class="card">
  <h2>Title</h2>
  <p>Content</p>
</section>

<!-- Use descriptive IDs and classes -->
<button id="export-pytorch-btn" class="success">  <!-- Good -->
<button id="btn1" class="b">                      <!-- Bad -->
```

#### CSS
```css
/* Use CSS variables for theming */
.card {
  background-color: var(--bg-card);  /* Good */
  background-color: #ffffff;         /* Avoid hardcoding */
}

/* Support dark mode */
[data-theme="dark"] .custom-element {
  background-color: var(--bg-dark);
}
```

### Architecture

The project follows a simple, modular structure:

```
Neural-Network-Builder/
├── netbuilder.html          # Main application (all-in-one file)
├── README.md                # Project documentation
├── CHANGELOG.md             # Version history
├── GETTING_STARTED.md       # User quick start guide
├── CONTRIBUTING.md          # This file
└── examples/                # Example configurations
    ├── image-classifier-resnet.json
    ├── mobile-efficient-net.json
    └── text-classifier-transformer.json
```

### JavaScript Organization

The code is organized into logical sections:

```javascript
// ============================================================================
// STATE MANAGEMENT
// ============================================================================
// All global state and configuration

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
// Helper functions

// ============================================================================
// LAYER MANAGEMENT
// ============================================================================
// Add, remove, modify layers

// ============================================================================
// CODE GENERATION
// ============================================================================
// Export to PyTorch, Keras, JAX

// ... etc
```

---

## 🎨 Adding New Features

### Adding a New Layer Type

1. **Add to layerConfigs**:
```javascript
const layerConfigs = {
  // ... existing layers
  mylayer: {
    name: 'My Custom Layer',
    fields: ['param1', 'param2', 'activation']
  }
};
```

2. **Add to createLayerFieldsHTML**:
```javascript
else if (layer.type === 'mylayer') {
  html += `
    <div>
      <label>Parameter 1</label>
      <input type="number" id="param1-${layer.id}" value="${layer.param1 || 10}">
    </div>
  `;
}
```

3. **Add to getDefaultLayerProperties**:
```javascript
const defaults = {
  // ... existing defaults
  mylayer: { param1: 10, param2: 20, activation: 'relu' }
};
```

4. **Add code generation** for PyTorch/Keras/JAX in respective functions

### Adding a New Export Format

1. **Add button to Export tab** in HTML:
```html
<button class="success" onclick="exportCode('newformat')">
  <strong>New Format</strong>
</button>
```

2. **Add generation function**:
```javascript
function generateNewFormatCode() {
  let code = `# Generated code for New Format\n`;
  networkConfig.layers.forEach(layer => {
    // Generate code for each layer
  });
  return code;
}
```

3. **Update exportCode function**:
```javascript
exportCode = function(framework) {
  if (framework === 'newformat') {
    const code = generateNewFormatCode();
    downloadFile(code, 'model_newformat.ext', 'text/plain');
  } else {
    // ... existing code
  }
};
```

### Adding New AI Recommendations

1. **Update aiKnowledgeBase**:
```javascript
const aiKnowledgeBase = {
  'new-task-type': {
    small: { arch: 'architecture', params: '< 10M', suggestion: 'Your advice' },
    medium: { arch: 'architecture', params: '10-50M', suggestion: 'Your advice' },
    large: { arch: 'architecture', params: '> 50M', suggestion: 'Your advice' }
  }
};
```

2. **Add datasets**:
```javascript
const datasetSuggestions = {
  'new-task-type': ['Dataset1', 'Dataset2', 'Dataset3']
};
```

---

## 🧪 Testing

### Before Submitting

1. **Test in Multiple Browsers**
   - Chrome/Edge
   - Firefox
   - Safari (if available)

2. **Test Core Functionality**
   - [ ] Layer add/remove/duplicate
   - [ ] Preset architecture loading
   - [ ] Configuration export (JSON, YAML, XML)
   - [ ] Code export (PyTorch, Keras, JAX)
   - [ ] Performance calculations
   - [ ] Dark mode toggle
   - [ ] Keyboard shortcuts

3. **Test New Features**
   - [ ] Test with valid inputs
   - [ ] Test with edge cases
   - [ ] Test error handling
   - [ ] Test UI responsiveness

4. **Check Console**
   - No JavaScript errors
   - No console warnings (except expected)

### Manual Testing Checklist

```
Quick Start:
[ ] All preset cards load correctly
[ ] Clicking preset loads architecture
[ ] Architecture appears in Architect tab

Architect:
[ ] Add Layer button works
[ ] Remove/Duplicate buttons work
[ ] Layer type changes update form
[ ] All layer parameters save correctly

AI Assistant:
[ ] Recommendations generate
[ ] Validation runs without errors
[ ] Dataset suggestions display

Performance:
[ ] FLOPs calculate correctly
[ ] Layer breakdown shows all layers
[ ] Device compatibility updates

Export:
[ ] All export buttons download files
[ ] Generated code is valid
[ ] Import loads configurations

Advanced:
[ ] URL sharing works
[ ] Snapshots save/load
[ ] Templates save/load
[ ] NAS generates architectures
```

---

## 📝 Pull Request Process

### 1. Prepare Your PR

```bash
# Ensure your branch is up to date
git checkout main
git pull upstream main
git checkout your-feature-branch
git rebase main

# Test thoroughly
# Open netbuilder.html and test all functionality
```

### 2. Commit Guidelines

Use clear, descriptive commit messages:

```bash
# Good commit messages
git commit -m "Add depthwise separable convolution layer type"
git commit -m "Fix FLOPs calculation for LSTM layers"
git commit -m "Improve dark mode contrast for input fields"

# Bad commit messages
git commit -m "Update file"
git commit -m "Fix bug"
git commit -m "WIP"
```

### 3. Create Pull Request

**Title Format:**
```
[Feature] Add depthwise separable convolution support
[Fix] Correct FLOPs calculation for recurrent layers
[Docs] Update README with mobile export instructions
```

**Description Template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Testing Done
- Tested in Chrome 120, Firefox 121
- Verified layer add/remove functionality
- Checked export for PyTorch and Keras

## Screenshots (if UI changes)
[Add screenshots here]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] No console errors
- [ ] Tested in multiple browsers
- [ ] Documentation updated (if needed)
```

### 4. Review Process

- Maintainers will review within 3-7 days
- Address feedback promptly
- Keep PRs focused (one feature/fix per PR)
- Be open to suggestions and improvements

---

## 🎯 Priority Areas

We're especially interested in contributions in these areas:

### High Priority
- [ ] Real-time training with TensorFlow.js
- [ ] Multi-input/multi-output graph builder
- [ ] More preset architectures (ViT, ConvNeXt, etc.)
- [ ] Enhanced mobile optimizations
- [ ] Improved FLOPs calculation accuracy

### Medium Priority
- [ ] Gradient flow visualization
- [ ] Model compression tools
- [ ] Transfer learning presets
- [ ] Cloud training integration
- [ ] Collaborative editing

### Low Priority
- [ ] Additional export formats
- [ ] More activation functions
- [ ] Custom layer definitions
- [ ] Architecture animations

---

## 🐛 Bug Reports

### Good Bug Report Example

```markdown
**Title:** FLOPs calculation incorrect for LSTM layers

**Description:**
When calculating FLOPs for LSTM layers, the result appears to be 10x lower than expected.

**Steps to Reproduce:**
1. Go to Architect tab
2. Add LSTM layer with 128 units
3. Go to Performance tab
4. Observe FLOPs value

**Expected Behavior:**
FLOPs should be approximately 500M for LSTM-128

**Actual Behavior:**
FLOPs shows as 50M

**Environment:**
- Browser: Chrome 120
- OS: macOS 14.0
- Version: 3.0.0

**Screenshots:**
[Attach if helpful]
```

---

## 💡 Feature Requests

### Good Feature Request Example

```markdown
**Title:** Add support for attention visualization

**Description:**
It would be helpful to visualize attention weights for transformer layers during architecture design.

**Use Case:**
When designing transformer architectures, I want to see which parts of the input the model would attend to, so I can validate the architecture makes sense for my task.

**Proposed Solution:**
Add a "Visualize Attention" button in transformer layer cards that shows a sample attention heatmap.

**Alternatives Considered:**
- Export attention weights for external visualization
- Link to external attention visualization tools

**Additional Context:**
Similar to how TensorBoard visualizes attention.
```

---

## 📚 Documentation

### Updating Documentation

When adding features, update:

1. **README.md**: Add to features list and usage examples
2. **CHANGELOG.md**: Add entry for next version
3. **GETTING_STARTED.md**: Add to workflows if applicable
4. **Code Comments**: Explain complex logic

### Documentation Style

```markdown
# Use clear headings
## Second level
### Third level

# Use code blocks with language
\`\`\`javascript
const example = 'code';
\`\`\`

# Use lists for steps
1. First step
2. Second step
3. Third step

# Use checkboxes for requirements
- [ ] Requirement 1
- [x] Requirement 2 (completed)
```

---

## 🔒 Security

### Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities.

Instead, email security concerns to: [email to be added]

Include:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

## ❓ Questions?

- **General Questions**: Open a GitHub Discussion
- **Bug Reports**: Open a GitHub Issue
- **Feature Requests**: Open a GitHub Issue with [Feature Request] tag
- **Code Questions**: Comment on relevant pull request

---

## 🙏 Thank You!

Every contribution, no matter how small, makes this project better. We appreciate your time and effort!

**Happy Contributing!** 🚀

---

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone.

### Our Standards

**Positive behavior:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what's best for the community

**Unacceptable behavior:**
- Trolling, insulting/derogatory comments
- Public or private harassment
- Publishing others' private information
- Other conduct inappropriate in a professional setting

### Enforcement

Report unacceptable behavior to project maintainers. All complaints will be reviewed and investigated.

---

**Version**: 1.0
**Last Updated**: November 2025
