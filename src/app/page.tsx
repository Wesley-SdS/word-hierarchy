import Hero from "./components/Hero";
import HierarchyBuilder from "./components/HierarchyBuilder";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Hero />

      <main className="flex-grow flex justify-center items-center p-4">
        <HierarchyBuilder />
      </main>

      <Footer />
    </div>
  );
}
