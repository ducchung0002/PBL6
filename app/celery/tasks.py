import cloudinary
from app.celery import make_celery
from app.models.music import Music
from app import create_app
from io import BytesIO
from app.models.enum.task_fail_type import TaskFailType
import uuid

app = create_app()
celery = make_celery(app)

with app.app_context():
    cloudinary.config(
        cloud_name=app.config.get('CLOUDINARY_CLOUD_NAME'),
        api_key=app.config.get('CLOUDINARY_API_KEY'),
        api_secret=app.config.get('CLOUDINARY_API_SECRET')
    )

@celery.task
def upload_music_task(lyrics, name, artists, genres,
                      audio_data, karaoke_data, thumbnail_data):
    """
    Upload files to Cloudinary and save metadata to DB.
    audio_data, karaoke_data, thumbnail_data are raw binary data or base64 strings
    sent from the route. You can also adjust to store files in /tmp and read them.
    """
    audio_url = None
    karaoke_url = None
    thumbnail_url = None
    uploaded_ids = []  # Keep track of successfully uploaded public_ids

    if audio_data:
        try:
            audio_file = BytesIO(audio_data)
            public_id = name + " audio " + str(uuid.uuid4())
            audio_upload_result = cloudinary.uploader.upload(
                audio_file, resource_type="video", public_id=public_id)
            audio_url = audio_upload_result.get('secure_url')
            uploaded_ids.append(public_id)  # Track successful upload
        except Exception as e:
            print('Exception uploading audio: ', str(e))
            return {'fail_type': TaskFailType.UPLOAD_MUSIC_AUDIO, 'detail': str(e)}
    if karaoke_data:
        try:
            karaoke_file = BytesIO(karaoke_data)
            public_id = name + " karaoke " + str(uuid.uuid4())
            karaoke_upload_result = cloudinary.uploader.upload(
                karaoke_file, resource_type="video", public_id=public_id)
            karaoke_url = karaoke_upload_result.get('secure_url')
            uploaded_ids.append(public_id)  # Track successful upload
        except Exception as e:
            print('Exception uploading karaoke: ', str(e), 'Cleaning up previously uploaded files', uploaded_ids)
            # Cleanup previously uploaded files
            for public_id in uploaded_ids:
                cloudinary.uploader.destroy(public_id, resource_type="video")
            return {'fail_type': TaskFailType.UPLOAD_MUSIC_KARAOKE, 'detail': str(e)}
    if thumbnail_data:
        try:
            thumbnail_file = BytesIO(thumbnail_data)
            public_id = name + " thumbnail " + str(uuid.uuid4())
            thumbnail_upload_result = cloudinary.uploader.upload(
                thumbnail_file, resource_type="image", public_id=public_id)
            thumbnail_url = thumbnail_upload_result.get('secure_url')
        except Exception as e:
            print('Exception uploading thumbnail: ', str(e), 'Cleaning up previously uploaded files', uploaded_ids)
            for public_id in uploaded_ids:
                cloudinary.uploader.destroy(public_id, resource_type="video")
            return {'fail_type': TaskFailType.UPLOAD_MUSIC_THUMBNAIL, 'detail': str(e)}

    try:
        music = Music(
            name=name,
            lyrics=lyrics,
            artists=artists,
            genres=genres,
            audio_url=audio_url,
            karaoke_url=karaoke_url,
            thumbnail_url=thumbnail_url
        ).save()

        # Emit to the specific client via SocketIO
        return {'music_id': str(music.id)}

    except Exception as e:
        print('Exception save music: ', str(e), 'Cleaning up previously uploaded files', uploaded_ids)
        for public_id in uploaded_ids:
            cloudinary.uploader.destroy(public_id, resource_type="video" if "thumbnail" not in public_id else "image")

        return {'fail_type': TaskFailType.SAVE_ERROR, 'detail': str(e)}
