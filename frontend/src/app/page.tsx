import Hero from "./_components/Hero";
import NavBar from "./_components/NavBar";

export default function Home() {
  return (
    <main className="font-sans px-20 py-5 text-black">
      <NavBar />
      <Hero />
    </main>
  );
}
