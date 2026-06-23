async function fetchStats() {
  const url = document.getElementById('videoUrl').value;
  const videoIdMatch = url.match(/(?:v=|youtu\.be\/)([^&]+)/);

  if (!videoIdMatch) {
    alert('Invalid YouTube URL');
    return;
  }

  const videoId = videoIdMatch[1];

  const res = await fetch(`http://localhost:3000/api/video?id=${videoId}`);
  const data = await res.json();

  const video = data.items[0];

  document.getElementById('video').innerHTML = `
    <iframe width="100%" height="400" 
    src="https://www.youtube.com/embed/${videoId}" 
    frameborder="0" allowfullscreen></iframe>
  `;

  document.getElementById('stats').innerHTML = `
    <h3>${video.snippet.title}</h3>
    <p><b>Views:</b> ${video.statistics.viewCount}</p>
    <p><b>Likes:</b> ${video.statistics.likeCount}</p>
    <p><b>Comments:</b> ${video.statistics.commentCount}</p>
    <p><b>Channel:</b> ${video.snippet.channelTitle}</p>
  `;
}