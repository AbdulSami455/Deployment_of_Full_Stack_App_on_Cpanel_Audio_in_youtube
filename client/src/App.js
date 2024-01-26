import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
	const [videoUrl, setVideoUrl] = useState('');
	const [processing, setProcessing] = useState(false);
	const [downloading, setDownloading] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(() => {
		return localStorage.getItem('darkMode') === 'true' ? true : false;
	});
	
	useEffect(() => {
		localStorage.setItem('darkMode', isDarkMode);
	}, [isDarkMode]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!videoUrl.trim()) return;

		try {
			setProcessing(true);
			const response = await fetch('http://youtubeinmp3.in/convert', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ videoUrl }),
			});

			if (response.ok) {
				setProcessing(false);
				setDownloading(true);
				// Trigger a download of the converted MP3 file
				const blob = await response.blob();
				const url = window.URL.createObjectURL(new Blob([blob]));
				const a = document.createElement('a');
				a.href = url;
				a.download = 'audio.mp3';
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				setDownloading(false);
			} else {
				console.error('Failed to convert video');
				setProcessing(false);
				setDownloading(false);
				alert("Something went wrong!... Cannot download audio... Failed to convert video. Please check your Youtube Video URL, it may be broken.");
			}
		} catch (error) {
			console.error('Error:', error);
			setProcessing(false);
			setDownloading(false);
			alert("Something went wrong!... Cannot download audio... Failed to convert video. Please check your Youtube Video URL, it may be broken.");
		}
	};
	return (
		<>
			<nav>
				<h2>YouTubein<span className="mp3">MP3</span></h2>
				<div class="container">
					<input type="checkbox" id="switch" checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} />

					<div class="switch-btn">
						<label for="switch">
							<div class="icons">
								<img src="./moon-icon.png" alt="moon" />
								<img src="./sun-icon.png" alt="moon" />
							</div>
						</label>
					</div>
				</div>
			</nav>
			<main>
				<img src='./logo.png' alt='logo' />
				<form onSubmit={handleSubmit}>
					<div className='input'>
						<input
							type="text"
							value={videoUrl}
							onChange={(e) => setVideoUrl(e.target.value)}
							placeholder='Youtube Video URL'
						/>
						<button type="submit" disabled={processing || downloading}>
							{
								processing ? "Processing..." 
								: downloading ? "Downloading..." 
								: "Convert to MP3"
							}
						</button>
					</div>
				</form>
				<h2>How to Use:</h2>
				<ul>
					<li>1. Open Youtube.com and search for the video you want to download.</li>
					<li>2. Click on the 'Share' button below the video and copy the video link to your clipboard.</li>
					<li>3. Paste that copied video link in our converter and click 'Convert to MP3'.</li>
					<li>4. Then it may take some time. And after the conversion, it will be downloaded automatically.</li>
				</ul>
				<p>Tada!!! That's it!.. you're done... 🥳👏🎉</p>
			</main>
			<footer>
				<a href='main'>Copyright &copy; 2023</a>
				<ul>
					<li><a href='main'>Contact</a></li>
					<li><a href='main'>Privacy</a></li>
					<li><a href='main'>Terms</a></li>
				</ul>
			</footer>
		</>
	);
};

export default App;
