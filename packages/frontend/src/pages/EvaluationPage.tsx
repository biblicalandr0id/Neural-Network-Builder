import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, TrendingUp, Target, Zap } from 'lucide-react'

export function EvaluationPage() {
  const metrics = [
    { label: 'Accuracy', value: '94.2%', icon: <Target className="h-4 w-4" />, color: 'text-green-500' },
    { label: 'Precision', value: '93.8%', icon: <TrendingUp className="h-4 w-4" />, color: 'text-blue-500' },
    { label: 'Recall', value: '94.5%', icon: <Zap className="h-4 w-4" />, color: 'text-purple-500' },
    { label: 'F1 Score', value: '94.1%', icon: <BarChart className="h-4 w-4" />, color: 'text-orange-500' },
  ]

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Evaluation Dashboard</h1>
        <p className="text-muted-foreground">Analyze model performance with comprehensive metrics</p>
      </div>

      <div className="grid gap-6">
        {/* Metrics Overview */}
        <div className="grid md:grid-cols-4 gap-4">
          {metrics.map((metric, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className={metric.color}>{metric.icon}</div>
                  <span className="text-sm text-muted-foreground">{metric.label}</span>
                </div>
                <p className="text-3xl font-bold">{metric.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Confusion Matrix Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Confusion Matrix</CardTitle>
            <CardDescription>Classification accuracy by class</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
              <div className="text-center">
                <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Train a model to see confusion matrix</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ROC Curve Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>ROC Curve</CardTitle>
            <CardDescription>Receiver Operating Characteristic</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Train a model to see ROC curve</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
