import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./redux/ReduxProvider";
import ThemeWrapper from "./themeWrap/ThemeWrapper";
import { ToastContainer } from "react-toastify";
import CustomToastContainer from "./utils/toast-container/ToastifyRootContainer";
import SessionWatcher from "./session-expired/Sessionwatcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <ThemeWrapper />
          <SessionWatcher />
          {children}
          <CustomToastContainer />
        </ReduxProvider>
      </body>
    </html>
  );
}
