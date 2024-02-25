import Link from "next/link";

export const metadata = {
  title: "Next Property | Properties Page",
};

const Properties = () => {
  return (
    <div>
      <h1 className="text-3xl">Properties</h1>
      <Link href="/">Go Home</Link>
    </div>
  );
};

export default Properties;
