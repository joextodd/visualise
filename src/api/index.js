/*
 * API functions
 */
const baseUrl = 'https://api.audiostream.world';

/*
 * Get a audio stream url for a video.
 * either video id or url can be specified.
 */
export const getAudioUrl = (url) => {
  const streamUrl = `${baseUrl}/video/${url}`;
  return new Promise((resolve, reject) => {
    fetch(streamUrl)
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch((err) => reject(err));
  });
};

/*
 * Get the next suggested video from YouTube.
 */
export const getNextVideo = (id) => {
  const nextUrl = `${baseUrl}/video/${id}/next`;
  return new Promise((resolve, reject) => {
    fetch(nextUrl)
    .then((response) => response.json())
    .then((data) => resolve(data.id))
    .catch((err) => reject(err));
  });
};

/*
 * CORS proxy for audio stream url.
 */
export const getAudioStream = (url) => `${baseUrl}/proxy/${url}`;
