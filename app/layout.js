export const metadata = {
  title: "KV Garage",
  description: "KV Garage platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#05070D] text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
