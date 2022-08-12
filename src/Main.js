import React from "react";
import Navigation from './components/navigation';
import VideoBackground from "./components/video-background";
import Footer from "./components/footer";

export default function Main() {
  return (
    <>
      <header>
        <Navigation />
      </header>
      <main>
        <section>
          <div class="background-wrapper">
            <VideoBackground videoSrc={"/assets/videos/homepage-final.mp4"} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}