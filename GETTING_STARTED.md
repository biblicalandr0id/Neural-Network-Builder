# Getting Started with Neural Network Builder

Welcome to the Neural Network Builder! This guide will help you get up and running in minutes.

## 🚀 Quick Start (30 seconds)

1. **Open the Tool**: Simply open `netbuilder.html` in your browser
   - No installation required
   - No dependencies needed
   - Works offline

2. **Choose a Preset**: Click on any architecture card in the **Quick Start** tab
   - Try "ResNet-based" for image classification
   - Try "Transformer-based" for text tasks

3. **Customize**: Go to the **Architect** tab to modify layers

4. **Export**: Go to the **Export** tab and click "PyTorch" to get code

**Done!** You just designed and exported a neural network in 30 seconds.

---

## 📚 5-Minute Tutorial

### Step 1: Design Your Network

**Option A: Use a Preset**
```
Quick Start Tab → Click "ResNet-based" → Architecture loads automatically
```

**Option B: Build from Scratch**
```
Architect Tab → Configure input shape → Click "Add Layer" → Select layer type
```

### Step 2: Get AI Recommendations

```
AI Assistant Tab → Fill in:
- Task: Image Classification
- Dataset Size: Medium (10K-100K)
- Compute: Single GPU
- Priority: Balanced

Click "Generate AI Recommendations"
→ Get 3 architecture suggestions with match scores
```

### Step 3: Analyze Performance

```
Performance Tab → Automatically see:
- FLOPs: 5.2G
- Inference Time: 23ms
- Device Compatibility: Mobile ✅, Edge ⚠️, Browser ✅
- Optimization Suggestions: "Apply quantization for 2-4x speedup"
```

### Step 4: Validate Architecture

```
AI Assistant Tab → Click "Validate Current Architecture"
→ See issues, warnings, and successes
```

### Step 5: Export for Production

```
Export Tab → Choose your framework:
- PyTorch: Click "PyTorch" → Download model.py
- Mobile: Click "TensorFlow Lite" → Download conversion script
- Deployment: Click "Docker Container" → Download Dockerfile
- API: Click "FastAPI" → Download api_fastapi.py
```

**Done!** You have production-ready code in 5 minutes.

---

## 🎯 Common Workflows

### Workflow 1: Image Classification for Mobile

```
1. Quick Start → "EfficientNet" (mobile-optimized)
2. Architect → Adjust input shape to your image size
3. Performance → Check: "Mobile compatible: ✅"
4. Export → "TensorFlow Lite" → Get optimized mobile model
```

**Result**: <10M parameter model ready for iOS/Android

---

### Workflow 2: Text Classification with Transformers

```
1. Quick Start → "Transformer-based"
2. Architect → Set input shape for your sequence length
3. AI Assistant → Validate architecture
4. Hyperparameters → Set learning rate to 0.0001 (lower for transformers)
5. Export → "PyTorch" → Get training code
```

**Result**: BERT-style classifier ready to train

---

### Workflow 3: Custom Architecture from Scratch

```
1. Architect Tab:
   - Input: 224,224,3
   - Add Conv2D: 32 filters, 3x3 kernel, ReLU
   - Add Pooling: Max, 2x2
   - Add Conv2D: 64 filters, 3x3 kernel, ReLU
   - Add Flatten
   - Add Dense: 128 units, ReLU
   - Add Dense: 10 units, Softmax

2. AI Assistant → Validate:
   ✓ Valid layer structure
   ⚠️ Consider adding batch normalization

3. Architect → Add Batch Norm after each Conv2D

4. Performance → Check FLOPs: 1.2G (efficient!)

5. Export → Choose framework
```

**Result**: Custom architecture validated and ready

---

### Workflow 4: Architecture Comparison

```
1. Build Architecture A
2. Advanced Tab → "Save Current as Snapshot"
3. Modify architecture to create Architecture B
4. Advanced Tab → "Save Current as Snapshot"
5. Advanced Tab → "Compare Snapshots"

→ Side-by-side table:
  Metric     | Snapshot 1 | Snapshot 2
  Params     | 25.5M      | 12.3M
  Layers     | 18         | 12
```

**Result**: Data-driven architecture decisions

---

### Workflow 5: Team Collaboration

```
1. Design architecture
2. Advanced Tab → "Generate Shareable URL"
3. Copy URL: https://yoursite.com/netbuilder.html?config=eyJsY...
4. Send to teammate
5. Teammate opens URL → Architecture loads automatically
```

**Result**: Seamless collaboration without files

---

## 🤖 Using AI Features Effectively

### Get Better Recommendations

**Good Input:**
```
Task: Image Classification
Dataset: Small (1K-10K)
Compute: CPU Only
Priority: Speed
```

**AI Response:**
```
✓ Recommended: EfficientNet-B0 (lightweight)
💡 Suggestion: Use transfer learning to prevent overfitting
⚠️ Warning: Keep model under 10M params for CPU training
```

---

### Validate Before Training

Always click "Validate Current Architecture" before exporting:

**Good Architecture:**
```
✓ Valid layer structure
✓ Input layer properly configured
✓ Appropriate output activation (Softmax for classification)
✓ Reasonable model size (12.3M parameters)
```

**Problematic Architecture:**
```
❌ Missing flatten layer between Conv2D and Dense
⚠️ Output layer using ReLU (should be Softmax for classification)
⚠️ Large model (85M params) + small dataset = high overfitting risk
```

---

## 📱 Deploying to Production

### Mobile Deployment (iOS)

```
1. Performance Tab → Verify "Mobile compatible: ✅"
2. Export Tab → "Core ML"
3. Download export_coreml.py
4. Run script to convert model
5. Add model.mlmodel to Xcode project
```

### Cloud Deployment (Kubernetes)

```
1. Export Tab → "Kubernetes"
2. Download k8s-deployment.yaml
3. Update image registry
4. kubectl apply -f k8s-deployment.yaml
```

### API Deployment

```
1. Export Tab → "FastAPI"
2. Download api_fastapi.py
3. Add your model weights
4. uvicorn api_fastapi:app --host 0.0.0.0 --port 8000
5. Visit http://localhost:8000/docs for API documentation
```

---

## 💡 Pro Tips

### 1. Save Frequently
Your work auto-saves to browser storage, but for important architectures:
```
Advanced Tab → "Save Current as Snapshot"
```

### 2. Use Templates
For recurring patterns:
```
Advanced Tab → "Save Current as Template"
→ Reuse in future projects
```

### 3. Check Performance Early
Don't wait until after training:
```
Performance Tab → Check FLOPs before building dataset
→ Avoid expensive surprises
```

### 4. Start with Presets
Don't build from scratch unless necessary:
```
Quick Start → Select closest preset → Customize
→ Faster than starting from zero
```

### 5. Validate Often
After each major change:
```
AI Assistant → "Validate Current Architecture"
→ Catch mistakes early
```

---

## 🔧 Keyboard Shortcuts (Coming in v3.1)

- `Ctrl/Cmd + S`: Save snapshot
- `Ctrl/Cmd + E`: Export to PyTorch
- `Ctrl/Cmd + D`: Duplicate selected layer
- `Delete`: Remove selected layer
- `Ctrl/Cmd + /`: Show shortcuts help

---

## 📁 Example Configurations

The `examples/` directory contains pre-built configurations:

- `image-classifier-resnet.json` - ResNet-style image classifier
- `mobile-efficient-net.json` - Mobile-optimized classifier (<10M params)
- `text-classifier-transformer.json` - Transformer for NLP

**To load:**
```
Export Tab → Import Configuration → Choose JSON file
```

---

## 🆘 Troubleshooting

### Issue: "Architecture won't load from URL"

**Solution:** Check that URL is complete and not truncated. URL encoding can make links very long.

---

### Issue: "FLOPs showing as 0"

**Solution:** Ensure input layer has a valid shape (e.g., "224,224,3" not "224,224")

---

### Issue: "Export button not downloading"

**Solution:** Check browser popup blocker settings. Allow downloads from this page.

---

### Issue: "Performance metrics not updating"

**Solution:** Make a small change to any layer to trigger recalculation, or refresh the page.

---

### Issue: "Validation shows warnings"

**Solution:** Warnings are suggestions, not errors. Your architecture will still work, but consider the advice for better performance.

---

## 📚 Learn More

- **README.md**: Complete feature documentation
- **CHANGELOG.md**: Version history and updates
- **Export Tab**: Try each export format to see generated code

---

## 🎓 Best Practices

1. **Start Simple**: Begin with fewer layers, add complexity gradually
2. **Validate Early**: Use AI validation before building datasets
3. **Check Performance**: Review FLOPs before training
4. **Use Presets**: Modify proven architectures instead of building from scratch
5. **Save Versions**: Use snapshots to track architecture evolution
6. **Test Exports**: Generate code early to catch issues
7. **Share with Team**: Use URL sharing for collaboration

---

## 🚀 Next Steps

Now that you're set up:

1. **Build your first architecture** (5 minutes)
2. **Get AI recommendations** for your task
3. **Export to your preferred framework**
4. **Join the community** (GitHub Discussions - coming soon)

---

## 💬 Support

- **Issues**: Check AI validation suggestions first
- **Questions**: Review this guide and README.md
- **Bugs**: Report on GitHub Issues
- **Feature Requests**: Submit on GitHub

---

**Happy Building!** 🧠⚡

Remember: From prototype to production in one tool. Design → Validate → Optimize → Deploy.
