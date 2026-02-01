const YouTubePlayer = ({ videoId, title }) => {
  if (!videoId) return null;

  // Costruiamo l'url embed con parametri ottimizzati:
  // rel=0 evita di mostrare video correlati di altri canali alla fine
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;

  return (
    <div className="video-container">
      <iframe
        className="absolute inset-0 w-full h-full border-0 shadow-2xl"
        src={embedUrl}
        title={title || "YouTube Video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default YouTubePlayer;