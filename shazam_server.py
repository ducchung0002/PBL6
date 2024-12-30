from gevent import monkey
monkey.patch_all()
import os
from flask import Flask, request, jsonify
from shazamio import Shazam
import base64
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
@app.route('/shazam', methods=['POST'])
async def process_audio():
    try:
        # Parse the Base64 audio from the request JSON
        data = request.json.get('audio', None)
        if not data:
            return jsonify({'error': 'No audio data provided'}), 400

        # Decode Base64 audio into bytes
        audio_data = base64.b64decode(data)
        temp_file_path = 'temp_audio.webm'

        # Save the audio data temporarily
        with open(temp_file_path, 'wb') as temp_file:
            temp_file.write(audio_data)

        # Use Shazam's recognize method
        shazam = Shazam()
        result = await shazam.recognize(data=temp_file_path)

        track_title = result.get('track', {}).get('title', 'Title not found')
        print(track_title)

        # Clean up temporary file
        os.remove(temp_file_path)

        # Return the recognition result
        return jsonify({'result': track_title}), 200

    except Exception as e:
        # Handle errors and return a response with the error message
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    from gevent import pywsgi
    from geventwebsocket.handler import WebSocketHandler

    server = pywsgi.WSGIServer(('0.0.0.0', 15033), app, handler_class=WebSocketHandler)
    print("Production WSGI Server running on http://0.0.0.0:15033")
    server.serve_forever()