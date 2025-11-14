import { useState, useEffect } from 'react'
import * as tf from '@tensorflow/tfjs'
import { useNetworkStore } from '@/store/networkStore'
import { useTrainingStore } from '@/store/trainingStore'
import { modelService } from '@/services/modelService'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import {
  Play,
  Square,
  TrendingUp,
  TrendingDown,
  Activity,
  Database,
  Save,
  Download,
  Info,
} from 'lucide-react'
import { formatNumber } from '@/lib/utils'

export function TrainingPage() {
  const { config } = useNetworkStore()
  const { status, currentEpoch, totalEpochs, metrics, setStatus, setEpochs, addMetrics, reset, setError } =
    useTrainingStore()
  const { toast } = useToast()

  // Hyperparameters
  const [epochs, setEpochsLocal] = useState(10)
  const [batchSize, setBatchSize] = useState(32)
  const [learningRate, setLearningRate] = useState(0.001)
  const [validationSplit, setValidationSplit] = useState(0.2)
  const [selectedDataset, setSelectedDataset] = useState('mnist')

  // Model info
  const [modelSummary, setModelSummary] = useState('')
  const [paramCount, setParamCount] = useState({ total: 0, trainable: 0 })

  // Training data
  const [trainingData, setTrainingData] = useState<{
    xs: tf.Tensor | null
    ys: tf.Tensor | null
  }>({ xs: null, ys: null })

  // Load sample data
  const loadSampleData = async () => {
    try {
      setStatus('preparing')
      toast({
        title: 'Loading dataset...',
        description: `Preparing ${selectedDataset.toUpperCase()} dataset`,
      })

      // Generate dummy data for demonstration
      // In a real implementation, you would load actual datasets
      const numSamples = 1000
      let xs: tf.Tensor
      let ys: tf.Tensor

      if (selectedDataset === 'mnist') {
        // MNIST: 28x28 grayscale images, 10 classes
        xs = tf.randomNormal([numSamples, 28, 28, 1])
        ys = tf.oneHot(tf.randomUniform([numSamples], 0, 10, 'int32'), 10)
      } else if (selectedDataset === 'cifar10') {
        // CIFAR-10: 32x32 RGB images, 10 classes
        xs = tf.randomNormal([numSamples, 32, 32, 3])
        ys = tf.oneHot(tf.randomUniform([numSamples], 0, 10, 'int32'), 10)
      } else {
        // Simple tabular data
        xs = tf.randomNormal([numSamples, 10])
        ys = tf.oneHot(tf.randomUniform([numSamples], 0, 2, 'int32'), 2)
      }

      setTrainingData({ xs, ys })
      setStatus('idle')
      toast({
        title: 'Dataset loaded',
        description: `${numSamples} samples ready for training`,
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load dataset')
      toast({
        title: 'Error loading dataset',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      })
    }
  }

  // Compile model and show summary
  const compileModel = async () => {
    try {
      if (config.layers.length === 0) {
        throw new Error('Please add layers to your network first')
      }

      await modelService.compileModel(config)
      const summary = modelService.getSummary()
      const params = modelService.countParams()

      setModelSummary(summary)
      setParamCount(params)

      toast({
        title: 'Model compiled',
        description: `${formatNumber(params.total)} parameters`,
      })
    } catch (error) {
      toast({
        title: 'Compilation failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      })
    }
  }

  // Start training
  const startTraining = async () => {
    try {
      if (!trainingData.xs || !trainingData.ys) {
        toast({
          title: 'No data loaded',
          description: 'Please load a dataset first',
          variant: 'destructive',
        })
        return
      }

      if (config.layers.length === 0) {
        toast({
          title: 'No model defined',
          description: 'Please add layers to your network first',
          variant: 'destructive',
        })
        return
      }

      setStatus('preparing')
      reset()

      // Update hyperparameters in config
      const updatedConfig = {
        ...config,
        hyperparameters: {
          ...config.hyperparameters,
          learningRate,
          batchSize,
        },
      }

      // Compile model
      await modelService.compileModel(updatedConfig)
      setStatus('training')
      setEpochs(0, epochs)

      // Start training with callbacks
      await modelService.train(trainingData.xs, trainingData.ys, {
        epochs,
        batchSize,
        validationSplit,
        callbacks: {
          onEpochEnd: async (epoch, logs) => {
            const newMetrics = {
              epoch: epoch + 1,
              loss: logs?.loss || 0,
              accuracy: logs?.acc || 0,
              val_loss: logs?.val_loss,
              val_accuracy: logs?.val_acc,
              timestamp: Date.now(),
            }

            setEpochs(epoch + 1, epochs)
            addMetrics(newMetrics)

            // Force UI update
            await tf.nextFrame()
          },
          onTrainEnd: async () => {
            setStatus('completed')
            toast({
              title: 'Training completed',
              description: `Finished ${epochs} epochs`,
            })
          },
        },
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Training failed')
      toast({
        title: 'Training failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      })
    }
  }

  // Stop training
  const stopTraining = () => {
    setStatus('idle')
    toast({
      title: 'Training stopped',
      description: 'Training has been manually stopped',
    })
  }

  // Save model
  const saveModel = async () => {
    try {
      const name = `model-${Date.now()}`
      await modelService.saveModel(name)
      toast({
        title: 'Model saved',
        description: `Saved as ${name}`,
      })
    } catch (error) {
      toast({
        title: 'Save failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      })
    }
  }

  // Get latest metrics
  const latestMetrics = metrics.length > 0 ? metrics[metrics.length - 1] : null
  const progress = totalEpochs > 0 ? (currentEpoch / totalEpochs) * 100 : 0

  // Auto-load dataset on mount
  useEffect(() => {
    if (!trainingData.xs) {
      loadSampleData()
    }
  }, [selectedDataset])

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Training Dashboard</h1>
        <p className="text-muted-foreground">Train your neural network with real-time metrics</p>
      </div>

      <div className="grid gap-6">
        {/* Status Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={
                        status === 'training'
                          ? 'default'
                          : status === 'completed'
                            ? 'secondary'
                            : status === 'error'
                              ? 'destructive'
                              : 'outline'
                      }
                    >
                      {status === 'training' && <Activity className="h-3 w-3 mr-1 animate-pulse" />}
                      {status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Epoch</p>
                  <p className="text-xl font-bold mt-1">
                    {currentEpoch} / {totalEpochs}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Parameters</p>
                  <p className="text-xl font-bold mt-1">{formatNumber(paramCount.total)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {status !== 'training' ? (
                  <Button onClick={startTraining} size="lg" disabled={config.layers.length === 0}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Training
                  </Button>
                ) : (
                  <>
                    <Button onClick={stopTraining} variant="destructive" size="lg">
                      <Square className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                  </>
                )}
                <Button onClick={saveModel} variant="outline" size="lg" disabled={metrics.length === 0}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Model
                </Button>
              </div>
            </div>
            {status === 'training' && (
              <div className="mt-4">
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Configuration */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Set training hyperparameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dataset Selection */}
              <div className="space-y-2">
                <Label>Dataset</Label>
                <Select value={selectedDataset} onValueChange={setSelectedDataset} disabled={status === 'training'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mnist">MNIST (28x28 grayscale)</SelectItem>
                    <SelectItem value="cifar10">CIFAR-10 (32x32 RGB)</SelectItem>
                    <SelectItem value="tabular">Tabular Data</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={loadSampleData}>
                  <Database className="h-4 w-4 mr-2" />
                  Reload Dataset
                </Button>
              </div>

              {/* Epochs */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Epochs</Label>
                  <span className="text-sm text-muted-foreground">{epochs}</span>
                </div>
                <Slider
                  value={[epochs]}
                  onValueChange={([value]) => setEpochsLocal(value)}
                  min={1}
                  max={100}
                  step={1}
                  disabled={status === 'training'}
                />
              </div>

              {/* Batch Size */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Batch Size</Label>
                  <span className="text-sm text-muted-foreground">{batchSize}</span>
                </div>
                <Slider
                  value={[batchSize]}
                  onValueChange={([value]) => setBatchSize(value)}
                  min={8}
                  max={256}
                  step={8}
                  disabled={status === 'training'}
                />
              </div>

              {/* Learning Rate */}
              <div className="space-y-2">
                <Label htmlFor="lr">Learning Rate</Label>
                <Input
                  id="lr"
                  type="number"
                  step="0.0001"
                  value={learningRate}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                  disabled={status === 'training'}
                />
              </div>

              {/* Validation Split */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Validation Split</Label>
                  <span className="text-sm text-muted-foreground">{(validationSplit * 100).toFixed(0)}%</span>
                </div>
                <Slider
                  value={[validationSplit * 100]}
                  onValueChange={([value]) => setValidationSplit(value / 100)}
                  min={0}
                  max={50}
                  step={5}
                  disabled={status === 'training'}
                />
              </div>

              <Button variant="outline" className="w-full" onClick={compileModel}>
                <Info className="h-4 w-4 mr-2" />
                View Model Summary
              </Button>
            </CardContent>
          </Card>

          {/* Metrics & History */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Training Metrics</CardTitle>
              <CardDescription>Real-time performance tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="metrics" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="metrics">Current Metrics</TabsTrigger>
                  <TabsTrigger value="history">Training History</TabsTrigger>
                </TabsList>

                <TabsContent value="metrics" className="space-y-4">
                  {latestMetrics ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Loss */}
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingDown className="h-4 w-4 text-red-500" />
                            <span className="text-sm text-muted-foreground">Training Loss</span>
                          </div>
                          <p className="text-3xl font-bold">{latestMetrics.loss.toFixed(4)}</p>
                        </CardContent>
                      </Card>

                      {/* Accuracy */}
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-muted-foreground">Training Accuracy</span>
                          </div>
                          <p className="text-3xl font-bold">{(latestMetrics.accuracy * 100).toFixed(2)}%</p>
                        </CardContent>
                      </Card>

                      {/* Validation Loss */}
                      {latestMetrics.val_loss !== undefined && (
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingDown className="h-4 w-4 text-orange-500" />
                              <span className="text-sm text-muted-foreground">Validation Loss</span>
                            </div>
                            <p className="text-3xl font-bold">{latestMetrics.val_loss.toFixed(4)}</p>
                          </CardContent>
                        </Card>
                      )}

                      {/* Validation Accuracy */}
                      {latestMetrics.val_accuracy !== undefined && (
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="h-4 w-4 text-blue-500" />
                              <span className="text-sm text-muted-foreground">Validation Accuracy</span>
                            </div>
                            <p className="text-3xl font-bold">{(latestMetrics.val_accuracy * 100).toFixed(2)}%</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                      <div className="text-center">
                        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Start training to see metrics</p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  {metrics.length > 0 ? (
                    <div className="border rounded-lg">
                      <div className="max-h-96 overflow-y-auto">
                        <table className="w-full">
                          <thead className="bg-muted sticky top-0">
                            <tr className="text-left text-sm">
                              <th className="p-3">Epoch</th>
                              <th className="p-3">Loss</th>
                              <th className="p-3">Accuracy</th>
                              <th className="p-3">Val Loss</th>
                              <th className="p-3">Val Acc</th>
                            </tr>
                          </thead>
                          <tbody>
                            {metrics.map((metric, i) => (
                              <tr key={i} className="border-t hover:bg-accent/50">
                                <td className="p-3 font-medium">{metric.epoch}</td>
                                <td className="p-3">{metric.loss.toFixed(4)}</td>
                                <td className="p-3">{(metric.accuracy * 100).toFixed(2)}%</td>
                                <td className="p-3">{metric.val_loss?.toFixed(4) || '-'}</td>
                                <td className="p-3">
                                  {metric.val_accuracy ? `${(metric.val_accuracy * 100).toFixed(2)}%` : '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="p-3 border-t bg-muted/50">
                        <Button variant="outline" size="sm" className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Export Training History
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                      <div className="text-center">
                        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No training history yet</p>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Model Summary */}
        {modelSummary && (
          <Card>
            <CardHeader>
              <CardTitle>Model Summary</CardTitle>
              <CardDescription>Architecture overview</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto font-mono">{modelSummary}</pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
