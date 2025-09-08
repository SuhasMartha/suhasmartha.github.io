import { Routes, Route } from "react-router-dom";
import ScrollToTopOnRouteChange from "./components/ScrollToTopOnRouteChange";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import About from "./pages/About";
import Works from "./pages/Works";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./components/BlogPost";
import Games from "./pages/Games";
import UnderProgress from "./pages/UnderProgress";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";

function App() {
  return (
    <>
      <ScrollToTopOnRouteChange />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Works />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/games" element={<Games />} />
        <Route path="/under-progress" element={<UnderProgress />} />
        <Route path="/admin" element={<Admin />} />
        {/* Catch all unmatched routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ScrollToTop />
    </>
  );
}

export default App;