import Hero from "./_components/Hero";
import NavBar from "./_components/NavBar";

export default function Home() {
  return (
    <div className="font-sans px-20 py-5 text-black">
      <header>
        <NavBar />
        <Hero />
      </header>
      <main></main>
    </div>
  );
}
