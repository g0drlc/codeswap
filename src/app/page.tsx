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
      <div className="pt-[100px] min-h-[600px] w-full flex justify-center">
        <div>
          <SwapWidget tokens={[]} />
        </div>
      </div>
      <Footer />
    </React.Suspense>
  );
};
export default MainPage;
