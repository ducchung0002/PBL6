// variables for wavesurfer building
//--------------------------------------------------------------------------------------------------

const audioUploadRegion = document.getElementById('audio-upload-region');
const karaokeUploadRegion = document.getElementById('karaoke-upload-region');
const audioUploadInput = document.getElementById('audio-upload');
const karaokeUploadInput = document.getElementById('karaoke-upload');
const thumbnailUploadBtn = document.getElementById('thumbnail-upload-btn');
const thumbnailUploadInput = document.getElementById('thumbnail-upload');
const thumbnailPreview = document.getElementById('thumbnail-preview');
let audio_file, karaoke_file, thumbnail_file;
const separateAudioButton = document.getElementById('separate-audio-btn');
const karaokeAudioPlayer = document.getElementById('karaoke-audio');
const waveformContainer = document.getElementById('waveform');
const playPauseButton = document.getElementById('btn-toggle-play');
const backwardButton = document.getElementById('btn-backward');
const forwardButton = document.getElementById('btn-forward');
const slider = document.getElementById('audio-playback-speed');
const tooltip = document.getElementById('slider-tooltip');

let isPlaying = false; // Track play/pause state
let regionLoop = false; // Track region loop state
let activeRegion = null;
let audioUrl = null;

// timeline plugin
const topTimeline = WaveSurfer.Timeline.create({
    height: 20,
    insertPosition: 'beforebegin',
    timeInterval: 0.05,
    primaryLabelInterval: 5,
    secondaryLabelInterval: 1,
    style: {
        fontSize: '10px',
        color: '#6A3274',
    },
});

// Create a second timeline
const bottomTimeline = WaveSurfer.Timeline.create({
    height: 20,
    timeInterval: 0.05,
    primaryLabelInterval: 1,
    class: 'hello',
});

// regions plugin
const regions = WaveSurfer.Regions.create();

// minimap plugin
const minimap = WaveSurfer.Minimap.create({
    height: 40,
    waveColor: '#ddd',
    progressColor: '#999',
});

// Create a WaveSurfer instance
const wavesurfer = WaveSurfer.create({
    container: waveformContainer,
    waveColor: '#ff4e00',
    progressColor: '#dd5e98',
    height: 128,
    sampleRate: 8000,
    minPxPerSec: 100,
    // normalize: false,
    dragToSeek: true,
    autoCenter: false,
    plugins: [topTimeline, regions, minimap, bottomTimeline],
    // url: 'http://res.cloudinary.com/dtyvqwbdk/video/upload/v1732677836/am_tham_ben_em_audio.mp3',
});
//--------------------------------------------------------------------------------------------------


const lyric = new Lyric();
const dummy_word = {'word': '', 'start_time': 0, 'end_time': 0};

const lyricTableBody = $('#music-lyrics tbody');

const sentence_detail_table = $('#sentence-detail-table');
let sentence_rows = [];
const MAX_SENTENCE_PER_PAGE = 5;
let current_paging = 1; // 1-based index
let total_pages = 1;
let current_row_index = 0;