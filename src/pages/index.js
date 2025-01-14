import Link from "next/link";

function HomePage() {
  return (
    <>
      <h1>this is home page</h1>

      <Link href="/hourlydashboard">DashBoard</Link>
    </>
  );
}

export default HomePage;
