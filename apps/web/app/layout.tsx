import { Providers } from "./providers";
import Header from "../components/Header";
import "./globals.css";

export const metadata = {
  title: "Demo | danmaku-leafer"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="m-0 font-sans">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
