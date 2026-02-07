// src/components/MosaicImage.jsx
import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const MosaicImage = ({ imagePath }) => {
  const containerRef = useRef();
  const [gridConfig, setGridConfig] = useState({ rows: 12, cols: 12 });

  useEffect(() => {
    // Carica l'immagine per ottenere le dimensioni reali
    const img = new Image();
    img.onload = () => {
      const imageAspect = img.naturalWidth / img.naturalHeight;
      const screenAspect = window.innerWidth / window.innerHeight;

      // Calcola righe e colonne per mantenere le proporzioni
      let cols, rows;

      if (screenAspect > imageAspect) {
        // Schermo più largo dell'immagine
        rows = 12;
        cols = Math.round(12 * screenAspect / imageAspect);
      } else {
        // Schermo più alto dell'immagine
        cols = 12;
        rows = Math.round(12 * imageAspect / screenAspect);
      }

      setGridConfig({ rows, cols });
    };
    img.src = imagePath;
  }, [imagePath]);

  useGSAP(() => {
    const tiles = containerRef.current?.querySelectorAll('.tile');
    if (!tiles || tiles.length === 0) return;

    gsap.fromTo(tiles,
      {
        scale: 0,
        rotation: () => gsap.utils.random(-180, 180),
        opacity: 0
      },
      {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.3,
        stagger: {
          amount: 1.2,
          from: "random",
          grid: [gridConfig.rows, gridConfig.cols]
        },
        ease: "back.out(1.7)"
      }
    );
  }, [gridConfig]);

  const totalTiles = gridConfig.rows * gridConfig.cols;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
        gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`,
        gap: '2px'
      }}
    >
      {Array.from({ length: totalTiles }).map((_, i) => {
        const row = Math.floor(i / gridConfig.cols);
        const col = i % gridConfig.cols;

        return (
          <div
            key={i}
            className="tile"
            style={{
              backgroundImage: `url(${imagePath})`,
              backgroundSize: `${gridConfig.cols * 100}% ${gridConfig.rows * 100}%`,
              backgroundPosition: `${(col / (gridConfig.cols - 1)) * 100}% ${(row / (gridConfig.rows - 1)) * 100}%`,
              borderRadius: '2px',
              filter: 'brightness(0.7)'
            }}
          />
        );
      })}
    </div>
  );
};

export default MosaicImage;