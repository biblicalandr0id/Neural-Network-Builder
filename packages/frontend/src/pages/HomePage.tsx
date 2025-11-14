import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Brain,
  Zap,
  Database,
  BarChart,
  Download,
  Layers,
  TrendingUp,
  Code,
  Rocket,
  Sparkles,
} from 'lucide-react'

export function HomePage() {
  const features = [
    {
      icon: <Layers className="h-8 w-8" />,
      title: 'Visual Architecture Builder',
      description: '17+ layer types with drag-and-drop interface. Build CNNs, RNNs, Transformers, and more.',
      color: 'text-blue-500',
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: 'Dataset Management',
      description: 'Upload custom datasets or use built-in samples (MNIST, CIFAR-10, IMDB). Data augmentation included.',
      color: 'text-green-500',
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Real-Time Training',
      description: 'Watch your network train in real-time with live metrics, loss curves, and accuracy tracking.',
      color: 'text-purple-500',
    },
    {
      icon: <BarChart className="h-8 w-8" />,
      title: 'Evaluation Dashboard',
      description: 'Confusion matrices, ROC curves, and per-class metrics. Comprehensive model analysis.',
      color: 'text-orange-500',
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: 'Code Export',
      description: 'Export to PyTorch, Keras, TensorFlow, JAX. Generate production-ready code instantly.',
      color: 'text-pink-500',
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'GPU Acceleration',
      description: 'Powered by TensorFlow.js with WebGL acceleration. Train models at blazing speeds.',
      color: 'text-yellow-500',
    },
  ]

  const stats = [
    { label: 'Layer Types', value: '17+', icon: <Layers className="h-4 w-4" /> },
    { label: 'Sample Datasets', value: '6', icon: <Database className="h-4 w-4" /> },
    { label: 'Export Formats', value: '5', icon: <Download className="h-4 w-4" /> },
    { label: 'Active Users', value: '10K+', icon: <Sparkles className="h-4 w-4" /> },
  ]

  return (
    <div className="container py-6 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="flex justify-center">
          <Badge variant="secondary" className="text-sm px-4 py-1">
            <Sparkles className="h-3 w-3 mr-1 inline" />
            State-of-the-Art Neural Network Builder
          </Badge>
        </div>
        <h1 className="text-5xl font-bold tracking-tight">
          Build Neural Networks
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Visually, Instantly
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Design, train, and deploy deep learning models directly in your browser. No installation, no setup, just pure
          ML innovation.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link to="/architect">
            <Button size="lg" className="gap-2">
              <Rocket className="h-4 w-4" />
              Start Building
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="gap-2">
            <Code className="h-4 w-4" />
            View Examples
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                {stat.icon}
                <span className="text-sm">{stat.label}</span>
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Features Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Powerful Features</h2>
          <p className="text-muted-foreground">Everything you need to build state-of-the-art neural networks</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`${feature.color} mb-2`}>{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 py-12 bg-muted rounded-lg">
        <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Join thousands of developers, researchers, and students building the future of AI
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/architect">
            <Button size="lg">
              <Brain className="h-4 w-4 mr-2" />
              Create Your First Network
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
