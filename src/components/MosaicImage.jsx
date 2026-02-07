// src/components/MosaicImage.jsx
import { useRef, useState, useEffect, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useSoundContext, SOUNDS } from '../contexts/SoundContext';

const MosaicImage = ({ imagePath }) => {
  const containerRef = useRef();
  const { playSound, soundEnabled } = useSoundContext();
  const [gridConfig, setGridConfig] = useState({
    rows: 18, cols: 1, bgW: 0, bgH: 0, screenW: 0, screenH: 0
  });

  const calculateGrid = useCallback(() => {
    const img = new Image();
    img.onload = () => {
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const screenAspect = screenW / screenH;

      const rows = 18;
      const cols = 1;

      let bgW, bgH;
      if (screenAspect > imgAspect) {
        bgW = screenW;
        bgH = screenW / imgAspect;
      } else {
        bgH = screenH;
        bgW = screenH * imgAspect;
      }

      setGridConfig({ rows, cols, bgW, bgH, screenW, screenH });
    };
    img.src = imagePath;
  }, [imagePath]);

  useEffect(() => {
    calculateGrid();
    window.addEventListener('resize', calculateGrid);
    return () => window.removeEventListener('resize', calculateGrid);
  }, [calculateGrid]);

  useGSAP(() => {
    const tiles = containerRef.current?.querySelectorAll('.tile');
    if (!tiles?.length) return;

    // Timeline per gestire espansione, flash e blur contemporaneamente
    const tl = gsap.timeline();

    tl.fromTo(tiles,
      {
        scaleX: 0,
        opacity: 0,
        // Parte con molto blur, molta luminosità e contrasto alto
        filter: 'brightness(3) contrast(1.5) blur(20px)',
        transformOrigin: (i) => i % 2 === 0 ? "left center" : "right center",
      },
      {
        scaleX: 1,
        opacity: 1,
        // Arriva a fuoco (blur 0), luminosità soft e contrasto normale
        filter: 'brightness(0.6) contrast(1) blur(0px)',
        duration: 1.6, // Leggermente più lento per gustarsi il passaggio del blur
        stagger: {
          amount: 1.5,
          from: "start"
        },
        ease: "expo.inOut",
        onStart: function () {
          if (soundEnabled && Math.random() > 0.8) {
            playSound(SOUNDS.HOVER, 0.01);
          }
        }
      }
    );
  }, [gridConfig, soundEnabled]);

  const totalTiles = gridConfig.rows * gridConfig.cols;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full bg-black overflow-hidden"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
        gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`,
        // Usiamo un gap negativo infinitesimale o gap 0 per evitare leak di pixel
        gap: '0px',
      }}
    >
      {Array.from({ length: totalTiles }).map((_, i) => {
        const row = Math.floor(i / gridConfig.cols);
        const col = i % gridConfig.cols;

        const tileW = gridConfig.screenW / gridConfig.cols;
        const tileH = gridConfig.screenH / gridConfig.rows;
        const offsetX = (gridConfig.bgW - gridConfig.screenW) / 2;
        const offsetY = (gridConfig.bgH - gridConfig.screenH) / 2;

        const backgroundPosX = -(col * tileW + offsetX);
        const backgroundPosY = -(row * tileH + offsetY);

        return (
          <div
            key={i}
            className="tile relative"
            style={{
              backgroundImage: `url(${imagePath})`,
              backgroundSize: `${gridConfig.bgW}px ${gridConfig.bgH}px`,
              backgroundPosition: `${backgroundPosX}px ${backgroundPosY}px`,
              backgroundAttachment: 'fixed',
              willChange: 'transform, filter',
              // RIMOSSO borderBottom che creava la linea nera
              // Aggiungiamo una piccola sovrapposizione per coprire i bordi
              margin: '-0.5px 0'
            }}
          >
            {/* Simuliamo la linea di scansione con un gradiente interno 
               che non sposta i pixel ma scurisce solo il bordo inferiore 
            */}
            <div
              className="absolute inset-0 border-b border-white/[0.03]"
              style={{ pointerEvents: 'none' }}
            />

            {/* Effetto luce interna sulla striscia */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5"
              style={{ mixBlendMode: 'overlay', pointerEvents: 'none' }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MosaicImage;