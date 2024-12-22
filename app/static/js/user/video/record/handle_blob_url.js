const blob_url_cache = {};
async function getBlobUrl(audio_url) {
    // Check if the Blob URL is already in the cache
    if (blob_url_cache[audio_url]) {
        return blob_url_cache[audio_url];
    }

    // Fetch the audio file
    const response = await fetch(audio_url);
    if (!response.ok) {
        throw new Error(`Failed to fetch audio file: ${response.statusText}`);
    }

    // Convert the response to a Blob
    const blob = await response.blob();

    // Create a Blob URL
    const blob_url = URL.createObjectURL(blob);

    // Store the Blob URL in the cache
    blob_url_cache[audio_url] = blob_url;

    return blob_url;
}

// Function to revoke a Blob URL when it's no longer needed
function revokeBlobUrl(audio_url) {
    const blob_url = blob_url_cache[audio_url];
    if (blob_url) {
        URL.revokeObjectURL(blob_url);
        delete blob_url_cache[audio_url];
    }
}