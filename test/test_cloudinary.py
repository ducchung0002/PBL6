import os

import cloudinary.uploader
from dotenv import load_dotenv

load_dotenv('D:\PBL6\.env')

cloudinary.config(
    cloud_name='dddiwftri',  # Replace with your Cloudinary cloud name
    api_key='171257253152235',  # Replace with your Cloudinary API key
    api_secret=os.getenv('CLOUDINARY_API_SECRET')  # Replace with your Cloudinary API secret
)
# Path to the video file
video_path = r'C:\Users\minhl\Downloads\video.mp4'

# Upload the video to Cloudinary
try:
    response = cloudinary.uploader.upload(video_path, resource_type="video")
    print("Video uploaded successfully.")
    print("URL:", response['url'])
except Exception as e:
    print(f"Error uploading video: {e}")
