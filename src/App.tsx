import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/AppShell'
import Dashboard from './pages/Dashboard'
import MyCourses from './pages/MyCourses'
import CourseDetail from './pages/CourseDetail'
import Schedule from './pages/Schedule'
import AssignmentSubmission from './pages/AssignmentSubmission'
import AllDeadlines from './pages/AllDeadlines'
import CourseUpdates from './pages/CourseUpdates'

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<MyCourses />} />
          <Route path="/courses/:courseSlug" element={<CourseDetail />} />
          <Route path="/courses/:courseSlug/assignments/:assignmentSlug" element={<AssignmentSubmission />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/deadlines" element={<AllDeadlines />} />
          <Route path="/updates" element={<CourseUpdates />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}
