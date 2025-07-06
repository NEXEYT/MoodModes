import { useState } from "react";

const playlists = [
  // This is Lo-Fi girl
  "https://open.spotify.com/embed/playlist/37i9dQZF1DZ06evO0FDzS8?utm_source=generator&theme=0",
  // Chillhop
  "https://open.spotify.com/embed/playlist/37i9dQZF1DX4WYpdgoIcn6?utm_source=generator&theme=0",
  // Jazz Vibes
  "https://open.spotify.com/embed/playlist/37i9dQZF1DXbITWG1ZJKYt?utm_source=generator&theme=0",
  // Peaceful Piano
  "https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO?utm_source=generator&theme=0",
];

type SpotifyWidgetProps = {
  className?: string;
};

export function SpotifyWidget({ className = "" }: SpotifyWidgetProps) {
  const [playlistIndex, setPlaylistIndex] = useState(0);

  const nextPlaylist = () => {
    setPlaylistIndex((prev) => (prev + 1) % playlists.length);
  };

  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-2xl p-1 shadow-lg ${className}`}>
      <iframe
        key={playlistIndex}
        src={playlists[playlistIndex]}
        width="300"
        height="152"
        frameBorder="0"
        allowTransparency={true}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-xl"
        title="Spotify playlist"
      ></iframe>
      <button
        onClick={nextPlaylist}
        className="mt-2 w-full py-2 rounded-lg bg-white/20 text-white font-medium hover:bg-white/30 transition-all backdrop-blur-sm"
        aria-label="Next playlist"
      >
        Next Playlist
      </button>
    </div>
  );
}
