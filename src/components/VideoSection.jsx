import { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';
import { HiArrowLeft } from "react-icons/hi2";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import YouTubePlayer from './YouTubePlayer';

const VideoSection = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  // Usiamo uno stato interno per memorizzare i dati del video
  const [videoData, setVideoData] = useState({ videoId: null, projectTitle: '' });
  const containerRef = useRef();

  useImperativeHandle(ref, () => ({
    // La funzione open ora accetta i dati come argomenti
    open: (videoId, projectTitle) => {
      if (videoId) {
        setVideoData({ videoId, projectTitle });
        setIsOpen(true);
      }
    },
    close: handleClose
  }));

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleClose = contextSafe(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpen(false);
        document.body.style.overflow = 'auto';
      }
    });
    tl.to(".video-content", { opacity: 0, y: -20, duration: 0.3 })
      .to(containerRef.current, { y: '-100%', duration: 0.6, ease: 'power3.in' }, "-=0.1");
  });

  useGSAP(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const tl = gsap.timeline();
      gsap.set(containerRef.current, { y: '100%', visibility: 'visible' });
      tl.to(containerRef.current, { y: '0%', duration: 0.7, ease: 'power4.out' })
        .to(".video-content", { opacity: 1, y: 0, duration: 0.5 }, "-=0.2")
        .to(".video-close", { opacity: 1, duration: 0.3 }, "-=0.3");
    }
  }, [isOpen]);

  // Controlla che lo stato interno sia stato impostato prima di renderizzare
  if (!isOpen || !videoData.videoId) return null;

  return createPortal(
    <div ref={containerRef} className="github-wrapper bg-agile-navy">
      <button
        onClick={handleClose}
        className="fixed top-6 left-6 md:top-10 md:left-10 z-[150] bg-agile-navy/80 backdrop-blur-md border border-white/10 p-2 rounded-full text-white hover:text-agile-sky transition-all shadow-lg"
      >
        <HiArrowLeft size={24} />
      </button>



      <div className="video-content pt-24 md:pt-32 px-4 md:px-0 h-screen flex items-center justify-center">
        <div className="w-full max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
            Video Demo: <span className="text-agile-sky">{videoData.projectTitle}</span>
          </h2>
          <div className="rounded-lg overflow-hidden bg-black aspect-video shadow-2xl">
            <YouTubePlayer videoId={videoData.videoId} title={videoData.projectTitle} />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
});

export default VideoSection;