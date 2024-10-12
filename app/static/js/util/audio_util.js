async function trimAudio(audioUrl, startTime, endTime) {
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    const originalSampleRate = audioBuffer.sampleRate;
    const targetSampleRate = 16000;

    const startSample = Math.floor(startTime * originalSampleRate);
    const endSample = Math.floor(endTime * originalSampleRate);
    const trimmedLength = endSample - startSample;

    const trimmedBuffer = audioCtx.createBuffer(audioBuffer.numberOfChannels, trimmedLength, originalSampleRate);
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const channelData = audioBuffer.getChannelData(channel).slice(startSample, endSample);
        trimmedBuffer.copyToChannel(channelData, channel, 0);
    }

    // Resample the trimmed buffer to 16kHz
    const resampledBuffer = await resampleAudioBuffer(trimmedBuffer, targetSampleRate);
    return await bufferToWav(resampledBuffer);
}

async function resampleAudioBuffer(buffer, targetSampleRate) {
    const offlineCtx = new OfflineAudioContext(
        buffer.numberOfChannels,
        Math.ceil((buffer.length * targetSampleRate) / buffer.sampleRate),
        targetSampleRate
    );

    const source = offlineCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(offlineCtx.destination);
    source.start(0);

    return await offlineCtx.startRendering();
}

function bufferToWav(buffer) {
    return new Promise((resolve) => {
        const numOfChan = buffer.numberOfChannels,
            length = buffer.length * numOfChan * 2 + 44,
            bufferArray = new ArrayBuffer(length),
            view = new DataView(bufferArray),
            channels = [],
            sampleRate = buffer.sampleRate,
            bitsPerSample = 16,
            blockAlign = numOfChan * bitsPerSample / 8,
            byteRate = sampleRate * blockAlign;
        let offset = 0;

        writeString(view, offset, 'RIFF'); offset += 4;
        view.setUint32(offset, length - 8, true); offset += 4;
        writeString(view, offset, 'WAVE'); offset += 4;
        writeString(view, offset, 'fmt '); offset += 4;
        view.setUint32(offset, 16, true); offset += 4;
        view.setUint16(offset, 1, true); offset += 2;
        view.setUint16(offset, numOfChan, true); offset += 2;
        view.setUint32(offset, sampleRate, true); offset += 4;
        view.setUint32(offset, byteRate, true); offset += 4;
        view.setUint16(offset, blockAlign, true); offset += 2;
        view.setUint16(offset, bitsPerSample, true); offset += 2;
        writeString(view, offset, 'data'); offset += 4;
        view.setUint32(offset, length - offset - 4, true); offset += 4;

        for(let i = 0; i < buffer.numberOfChannels; i++) {
            channels.push(buffer.getChannelData(i));
        }

        let interleaved;
        if (numOfChan === 2) {
            interleaved = interleave(channels[0], channels[1]);
        } else {
            interleaved = channels[0];
        }

        let index = offset;
        for (let i = 0; i < interleaved.length; i++) {
            let sample = Math.max(-1, Math.min(1, interleaved[i]));
            sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
            view.setInt16(index, sample, true);
            index += 2;
        }

        resolve(new Blob([bufferArray], {type: 'audio/wav'}));
    });
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function interleave(left, right) {
    const length = left.length + right.length;
    const result = new Float32Array(length);
    let inputIndex = 0;

    for (let i = 0; i < length;) {
        result[i++] = left[inputIndex];
        result[i++] = right[inputIndex];
        inputIndex++;
    }
    return result;
}
