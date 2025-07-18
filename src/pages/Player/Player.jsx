import React, { useEffect, useState } from 'react';
import './Player.css';
import back_arrow_icon from '../../assets/back_arrow_icon.png';
import { useNavigate, useParams } from 'react-router-dom';

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiKey = 'b96764dd9282791ac6bf923ec91ef56e'; // ✅ Replace with your valid API key

  useEffect(() => {
    if (!id) return;

    const fetchTrailer = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US&api_key=${apiKey}`);
        const data = await res.json();

        console.log('✅ API Response:', data);

        if (Array.isArray(data.results)) {
          const trailer = data.results.find(
            vid => vid.site === 'YouTube' && vid.type === 'Trailer'
          );
          if (trailer) {
            setVideo(trailer);
          } else {
            console.warn('❌ No YouTube Trailer Found');
            setVideo(null);
          }
        } else {
          console.warn('❌ Unexpected results structure');
          setVideo(null);
        }
      } catch (err) {
        console.error('❌ Fetch error:', err);
        setVideo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTrailer();
  }, [id]);

  return (
    <div className="player">
      <img
        src={back_arrow_icon}
        alt="Back"
        onClick={() => navigate(-1)}
        style={{ cursor: 'pointer', marginBottom: '20px' }}
      />

      {loading ? (
        <h2 style={{ color: 'white' }}>Loading trailer...</h2>
      ) : video ? (
        <>
          <iframe
            width="90%"
            height="500px"
            src={`https://www.youtube.com/embed/${video.key}?autoplay=1&rel=0`}
            title={video.name}
            frameBorder="0"
            allowFullScreen
          />
          <div className="player-info">
            <p>🗓 {video.published_at?.slice(0, 10)}</p>
            <p>🎬 {video.name}</p>
            <p>📂 {video.type}</p>
          </div>
        </>
      ) : (
        <div style={{ color: 'white', marginTop: '2rem' }}>
          <p>No trailer available for this movie.</p>
        </div>
      )}
    </div>
  );
};

export default Player;
