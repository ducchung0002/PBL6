/**
 *   events
 */
document.getElementById('loop-region-checkbox').onclick = (event) => {
    regionLoop = event.target.checked;
}
// this event is triggered once
wavesurfer.once('decode', () => {
    /**
     *   mouse wheel to change zoom level
     */
    let currentZoom = 100; // Initialize zoom level
    waveformContainer.addEventListener('wheel', (event) => {
        event.preventDefault();

        // Zoom sensitivity
        const zoomStep = 5;

        // Adjust zoom level based on scroll direction
        currentZoom = event.deltaY > 0
            ? Math.max(currentZoom - zoomStep, 10) // Zoom out (minimum 10)
            : Math.min(currentZoom + zoomStep, 1000); // Zoom in (maximum 1000)

        wavesurfer.zoom(currentZoom); // Apply zoom
    }, {passive: false});

    // Play or pause the music when the button is clicked
    playPauseButton.addEventListener('click', () => {
        if (isPlaying) {
            wavesurfer.pause();
        } else {
            wavesurfer.play();
        }
    });
    /**
     *   forward and backward buttons
     */
    forwardButton.onclick = () => {
        wavesurfer.skip(5)
    }

    backwardButton.onclick = () => {
        wavesurfer.skip(-5)
    }
    /**
     *   slider event listener
     */
    // Show tooltip and update value while sliding
    slider.addEventListener('input', () => {
        tooltip.textContent = slider.value + 'x';
        tooltip.style.display = 'block';
        // Position the tooltip above the slider thumb
        const sliderRect = slider.getBoundingClientRect();
        const tooltipWidth = tooltip.offsetWidth;
        const sliderThumbPos = ((slider.value - slider.min) / (slider.max - slider.min)) * sliderRect.width;
        tooltip.style.left = `${sliderThumbPos - tooltipWidth / 2}px`;
        wavesurfer.setPlaybackRate(slider.value)
    });

    // Hide tooltip when sliding stops
    slider.addEventListener('change', () => {
        tooltip.style.display = 'none';
    });
});

// Update the button and isPlaying state when WaveSurfer emits events
wavesurfer.on('play', () => {
    isPlaying = true; // Sync with playback state
    playPauseButton.classList.remove('btn-outline-success');
    playPauseButton.classList.add('btn-outline-warning');
    playPauseButton.setAttribute('title', 'Pause');
    playPauseButton.innerHTML = '<i class="fas fa-pause" aria-hidden="true"></i>';
});

wavesurfer.on('pause', () => {
    isPlaying = false; // Sync with playback state
    playPauseButton.classList.remove('btn-outline-warning');
    playPauseButton.classList.add('btn-outline-success');
    playPauseButton.setAttribute('title', 'Play');
    playPauseButton.innerHTML = '<i class="fas fa-play" aria-hidden="true"></i>';
});

wavesurfer.on('ready', function () {
    /**
     *   custom style waveform & progress bar & timeline
     */
    const shadowRoot = waveformContainer.children[0].shadowRoot;
    shadowRoot.querySelector('.canvases').style.cssText = `margin-top: 50px`;
    // const timelines = shadowRoot.querySelectorAll('div[part="timeline"]');
    // timelines[0].style.cssText = 'z-index: 10;';
    // timelines[1].style.cssText = 'z-index: 10;';
    waveformContainer.children[0].shadowRoot.querySelector('div[part="cursor"]').nextElementSibling.style.opacity = '60%';
});
/**
 *   Regions event
 */
// uncomment to drag and select new regions
regions.enableDragSelection({
    color: 'rgb(15,232,174)'
});

regions.on('region-in', (region) => {
    activeRegion = region;
    region.setOptions({color: 'rgb(58,182,20)'});
});

regions.on('region-out', (region) => {
    if (activeRegion === region) {
        if (regionLoop && isPlaying) {
            region.play()
        } else {
            activeRegion = null;
            region.setOptions({color: 'rgb(15,232,174)'});
        }
    }
});
