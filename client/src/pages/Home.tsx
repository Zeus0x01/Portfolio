import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Courses from "@/components/Courses";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import UserProfile from "@/components/UserProfile";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Portfolio />
      <Courses />
      {isAuthenticated && <UserProfile />}
      <About />
      <Contact />
      <Footer />
    </div>
  );
}
