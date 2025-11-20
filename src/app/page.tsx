import dynamic from "next/dynamic";
import React from "react";
import SwapWidget from "@/components/swap-widget";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Loading from "@/components/loading/loading";


const MainPage = () => {
  return (
    <React.Suspense fallback={<Loading />}>
      <Header />
      <div className="pt-[100px] min-h-[calc(100vh-200px)] w-full flex justify-center px-4 pb-12 relative z-10">
        <div className="w-full max-w-6xl">
          <SwapWidget tokens={[]} />
        </div>
      </div>
      <Footer />
    </React.Suspense>
  );
};
export default MainPage;
