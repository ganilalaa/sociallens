import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import UserSidebar from "@/components/navigation/userSidebar";
import TopBarSm from "@/components/navigation/topBarSm";
import BottomBar from "@/components/navigation/bottomBar";
import { useRouter } from "next/router";
import { createContext, useContext, useState } from "react";
import { SocketProvider } from "@/contexts/SocketContext";
import Story from "@/components/feed/story";

// Create context for search state
const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

function SearchProvider({ children }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <SearchContext.Provider value={{ isSearchOpen, setIsSearchOpen }}>
      {children}
    </SearchContext.Provider>
  );
}

function MainContent({ children, isLayoutExcluded }) {
  const { isSearchOpen } = useSearch();

  return (
    <main
      className={`transition-all duration-300 pb-[8dvh] ${
        isSearchOpen ? "pt-[calc(8dvh+300px)]" : "pt-[8dvh]"
      } ${!isLayoutExcluded ? "ml-16 xl:ml-64" : ""}`}
    >
      {children}
    </main>
  );
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();

  const noLayoutRoutes = ["/auth/login", "/auth/register", "/forgot-password"];
  const isLayoutExcluded = noLayoutRoutes.includes(router.pathname);

  return (
    <SessionProvider session={session}>
      <SocketProvider>
        <SearchProvider>
          {!isLayoutExcluded && (
            <>
              <UserSidebar />
              <TopBarSm />
            </>
          )}

          <MainContent isLayoutExcluded={isLayoutExcluded}>
            {router.pathname === "/" && <Story />}
            <Component {...pageProps} />
          </MainContent>

          {!isLayoutExcluded && <BottomBar />}
        </SearchProvider>
      </SocketProvider>
    </SessionProvider>
  );
}
