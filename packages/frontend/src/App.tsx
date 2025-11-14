import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { ArchitectPage } from '@/pages/ArchitectPage'
import { DatasetPage } from '@/pages/DatasetPage'
import { TrainingPage } from '@/pages/TrainingPage'
import { EvaluationPage } from '@/pages/EvaluationPage'
import { ExportPage } from '@/pages/ExportPage'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="nn-builder-theme">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="architect" element={<ArchitectPage />} />
          <Route path="dataset" element={<DatasetPage />} />
          <Route path="train" element={<TrainingPage />} />
          <Route path="evaluate" element={<EvaluationPage />} />
          <Route path="export" element={<ExportPage />} />
        </Route>
      </Routes>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
