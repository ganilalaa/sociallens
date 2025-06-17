import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import UserSidebar from "@/components/navigation/userSidebar";
import TopBarSm from "@/components/navigation/topBarSm";
import BottomBar from "@/components/navigation/bottomBar";
import { useRouter } from "next/router";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();

  const noLayoutRoutes = ["/auth/login", "/auth/register", "/forgot-password"];
  const isLayoutExcluded = noLayoutRoutes.includes(router.pathname);

  return (
    <SessionProvider session={session}>
      {!isLayoutExcluded && (
        <>
          <UserSidebar />
          <TopBarSm />
        </>
      )}

      <main
        className={`pt-[8dvh] pb-[8dvh] ${
          !isLayoutExcluded ? "ml-16 xl:ml-64" : ""
        }`}
      >
        <Component {...pageProps} />
      </main>

      {!isLayoutExcluded && <BottomBar />}
    </SessionProvider>
  );
}
