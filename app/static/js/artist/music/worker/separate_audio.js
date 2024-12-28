importScripts('/static/js/route.js');
importScripts('/node_modules/axios/dist/axios.min.js');

self.onmessage = async function(e) {
    const audio = e.data;
    const formData = new FormData();
    formData.append('audio', audio);

    try {
        const response = await axios.post(SERVER_SEPARATE_AUDIO, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            responseType: 'blob'
        });
        const arrayBuffer = await response.data.arrayBuffer();
        self.postMessage(arrayBuffer);
    } catch (error) {
        self.postMessage({ error: error.toString() });
    }
};