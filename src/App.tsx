import { Container } from 'react-bootstrap'
import { Route, Routes } from 'react-router-dom'
import AppNavbar from './components/layout/AppNavbar'
import BottomNav from './components/layout/BottomNav'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Home from './pages/Home'
import NewPost from './pages/NewPost'
import NotFound from './pages/NotFound'
import PostDetail from './pages/PostDetail'
import Profile from './pages/Profile'
import Register from './pages/Register'

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />
      <main className="app-main py-4">
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/registro" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/perfil" element={<Profile />} />
              <Route path="/nuevo-post" element={<NewPost />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}
