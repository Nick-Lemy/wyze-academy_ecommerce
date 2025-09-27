import NavBar from "./_components/NavBar";

export default function Home() {
  return (
    <main className="font-sans px-10 py-5 text-black">
      <NavBar />
      <h1 className="text-4xl font-bold">Welcome to the E-Commerce App</h1>
      <p className="text-lg">Shop the latest products at unbeatable prices.</p>
    </main>
  );
}
