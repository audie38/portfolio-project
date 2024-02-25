import "@/assets/styles/globals.css";

export const metadata = {
  title: "Next Property | Find The Perfect Property",
  description: "Find your dream property",
  keywords: "rental, find rentals, find properties",
};

const MainLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <div>{children}</div>
      </body>
    </html>
  );
};

export default MainLayout;
