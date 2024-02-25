import Link from "next/link";

export const metadata = {
  title: "Next Property | Home Page",
};

const HomePage = () => {
  return (
    <div>
      <h1 className="text-3xl">Welcome</h1>
      <Link href="/properties">Show Properties</Link>
    </div>
  );
};

export default HomePage;
