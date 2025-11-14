import { useState } from 'react'
import { useNetworkStore } from '@/store/networkStore'
import { codeExportService, type ExportFormat } from '@/services/codeExportService'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Download, Copy, Code2, FileCode, Braces } from 'lucide-react'

export function ExportPage() {
  const { config } = useNetworkStore()
  const { toast } = useToast()

  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pytorch')
  const [generatedCode, setGeneratedCode] = useState('')

  const formats: Array<{ id: ExportFormat; name: string; description: string; icon: string }> = [
    {
      id: 'pytorch',
      name: 'PyTorch',
      description: 'Export as PyTorch nn.Module with training loop',
      icon: '🔥',
    },
    {
      id: 'keras',
      name: 'Keras',
      description: 'Export as Keras Sequential model',
      icon: '🧠',
    },
    {
      id: 'tensorflow',
      name: 'TensorFlow',
      description: 'Export as TensorFlow 2.x model',
      icon: '📊',
    },
    {
      id: 'jax',
      name: 'JAX/Flax',
      description: 'Export as JAX/Flax model with functional API',
      icon: '⚡',
    },
    {
      id: 'onnx',
      name: 'ONNX',
      description: 'Export instructions for ONNX format',
      icon: '🔄',
    },
  ]

  const handleGenerate = (format: ExportFormat) => {
    try {
      if (config.layers.length === 0) {
        toast({
          title: 'No layers defined',
          description: 'Please add layers to your network first',
          variant: 'destructive',
        })
        return
      }

      const code = codeExportService.export(config, format)
      setGeneratedCode(code)
      setSelectedFormat(format)

      toast({
        title: 'Code generated',
        description: `${formats.find((f) => f.id === format)?.name} code ready`,
      })
    } catch (error) {
      toast({
        title: 'Export failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      })
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode)
    toast({
      title: 'Copied to clipboard',
      description: 'Code copied successfully',
    })
  }

  const handleDownload = () => {
    codeExportService.downloadCode(generatedCode, selectedFormat)
    toast({
      title: 'Download started',
      description: `Downloading ${selectedFormat} code`,
    })
  }

  const handleExportJSON = () => {
    const json = JSON.stringify(config, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'network_config.json'
    link.click()
    URL.revokeObjectURL(url)

    toast({
      title: 'JSON exported',
      description: 'Network configuration downloaded',
    })
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Export & Deploy</h1>
        <p className="text-muted-foreground">Export your model to production-ready frameworks</p>
      </div>

      <div className="grid gap-6">
        {/* Export Formats */}
        <Card>
          <CardHeader>
            <CardTitle>Export Formats</CardTitle>
            <CardDescription>Choose your preferred deep learning framework</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formats.map((format) => (
                <Card
                  key={format.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedFormat === format.id ? 'border-primary ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleGenerate(format.id)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{format.icon}</span>
                        <div>
                          <h3 className="font-semibold">{format.name}</h3>
                          {selectedFormat === format.id && (
                            <Badge variant="secondary" className="mt-1">
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Code2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">{format.description}</p>
                  </CardContent>
                </Card>
              ))}

              {/* JSON Export */}
              <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={handleExportJSON}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">📦</span>
                      <div>
                        <h3 className="font-semibold">JSON Config</h3>
                      </div>
                    </div>
                    <Braces className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Export raw network configuration as JSON</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Code Preview */}
        {generatedCode && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Generated Code</CardTitle>
                  <CardDescription>
                    {formats.find((f) => f.id === selectedFormat)?.name} implementation
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="default" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="code" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="info">Implementation Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="code">
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono max-h-[600px] overflow-y-auto border">
                      <code>{generatedCode}</code>
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="info">
                  <div className="space-y-4">
                    {selectedFormat === 'pytorch' && (
                      <div className="space-y-2">
                        <h4 className="font-semibold">PyTorch Implementation</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          <li>Define model as nn.Module subclass</li>
                          <li>Implement forward() method for inference</li>
                          <li>Use torch.optim for optimizers</li>
                          <li>Requires manual training loop implementation</li>
                          <li>Install: pip install torch torchvision</li>
                        </ul>
                      </div>
                    )}

                    {selectedFormat === 'keras' && (
                      <div className="space-y-2">
                        <h4 className="font-semibold">Keras Implementation</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          <li>High-level API built on TensorFlow</li>
                          <li>Sequential API for linear layer stacks</li>
                          <li>Built-in training with model.fit()</li>
                          <li>Easy callbacks and monitoring</li>
                          <li>Install: pip install tensorflow</li>
                        </ul>
                      </div>
                    )}

                    {selectedFormat === 'tensorflow' && (
                      <div className="space-y-2">
                        <h4 className="font-semibold">TensorFlow Implementation</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          <li>Production-ready framework by Google</li>
                          <li>Supports eager execution and graph mode</li>
                          <li>Easy deployment with TensorFlow Serving</li>
                          <li>Mobile deployment with TensorFlow Lite</li>
                          <li>Install: pip install tensorflow</li>
                        </ul>
                      </div>
                    )}

                    {selectedFormat === 'jax' && (
                      <div className="space-y-2">
                        <h4 className="font-semibold">JAX/Flax Implementation</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          <li>Functional programming approach</li>
                          <li>Automatic differentiation with grad()</li>
                          <li>JIT compilation for performance</li>
                          <li>Composable transformations (vmap, pmap)</li>
                          <li>Install: pip install jax flax optax</li>
                        </ul>
                      </div>
                    )}

                    {selectedFormat === 'onnx' && (
                      <div className="space-y-2">
                        <h4 className="font-semibold">ONNX Export</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          <li>Open Neural Network Exchange format</li>
                          <li>Framework-agnostic model representation</li>
                          <li>Deploy across different platforms</li>
                          <li>Optimize with ONNX Runtime</li>
                          <li>Install: pip install onnx onnxruntime</li>
                        </ul>
                      </div>
                    )}

                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-2">Model Statistics</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total Layers:</span>
                          <span className="ml-2 font-medium">{config.layers.length}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Optimizer:</span>
                          <span className="ml-2 font-medium">{config.hyperparameters.optimizer}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Loss Function:</span>
                          <span className="ml-2 font-medium">{config.hyperparameters.loss}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Learning Rate:</span>
                          <span className="ml-2 font-medium">{config.hyperparameters.learningRate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle>Deployment Guide</CardTitle>
            <CardDescription>Quick start guide for model deployment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <FileCode className="h-4 w-4" />1. Export Your Model
              </h4>
              <p className="text-sm text-muted-foreground pl-6">
                Select your preferred framework above and download the generated code
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <FileCode className="h-4 w-4" />2. Prepare Your Dataset
              </h4>
              <p className="text-sm text-muted-foreground pl-6">
                Load your training data and preprocess it according to your model's input shape
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <FileCode className="h-4 w-4" />3. Train & Evaluate
              </h4>
              <p className="text-sm text-muted-foreground pl-6">
                Run the training script and monitor metrics. Adjust hyperparameters as needed
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <FileCode className="h-4 w-4" />4. Deploy to Production
              </h4>
              <p className="text-sm text-muted-foreground pl-6">
                Export to ONNX for cross-platform deployment or use framework-specific serving tools
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
