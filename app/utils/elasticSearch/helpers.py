from elasticsearch import helpers
from mongoengine.base import LazyReference

from app.models.music import Music
from app.models.artist import Artist
from app.models.base.extended_account import ExtendedAccount
from . import es


def create_index(index_name, settings_mappings):
    if es.indices.exists(index=index_name):
        es.indices.delete(index=index_name)
    es.indices.create(index=index_name, body=settings_mappings)

def bulk_index_lyrics(lyrics_data, batch_size=100):
    actions = [
        {
            "_index": "lyrics",
            "_id": f"{lyric['music_id']}_{i}",
            "_source": lyric
        }
        for i, lyric in enumerate(lyrics_data)
    ]
    helpers.bulk(es, actions, chunk_size=batch_size)

def bulk_index_accounts(accounts_data):
    actions = [
        {
            "_index": "accounts",
            "_id": account['id'],
            "_source": account
        }
        for account in accounts_data
    ]
    helpers.bulk(es, actions)

def bulk_index_musics(musics_data, batch_size=100):
    actions = [
        {
            "_index": "musics",
            "_id": music['id'],
            "_source": music
        }
        for music in musics_data
    ]
    helpers.bulk(es, actions, chunk_size=batch_size)

def search_lyrics(query):
    body = {
        "query": {
            "match": {
                "lyric": {
                    "query": query,
                    "fuzziness": "AUTO"
                }
            }
        },
        "collapse": {
            "field": "lyric.keyword"
        },
        "size": 20
    }
    res = es.search(index="lyrics", body=body)
    results = []
    for hit in res["hits"]["hits"]:
        results.append({
            "lyric": hit["_source"]["lyric"],
            "music_id": hit["_source"]["music_id"],
            "score": hit["_score"],
            "flag": "lyric"
        })
    return results

def search_musics(query):
    body = {
        "query": {
            "match": {
                "name": {
                    "query": query,
                    "fuzziness": "AUTO"
                }
            }
        },
        "size": 20
    }
    res = es.search(index="musics", body=body)
    results = []
    for hit in res["hits"]["hits"]:
        results.append({
            "name": hit["_source"]["name"],
            "id": hit["_source"]["id"],
            "score": hit["_score"],
            "flag": "music"
        })
    return results

def search_accounts(query):
    body = {
        "query": {
            "bool": {
                "should": [
                    {
                        "match": {
                            "name": {
                                "query": query,
                                "fuzziness": "AUTO",
                                "boost": 2
                            }
                        }
                    },
                    {
                        "match": {
                            "nickname": {
                                "query": query,
                                "fuzziness": "AUTO",
                                "boost": 3
                            }
                        }
                    },
                    {
                        "match": {
                            "username": {
                                "query": query,
                                "fuzziness": "AUTO",
                                "boost": 3
                            }
                        }
                    }
                ]
            }
        },
        "size": 5
    }
    res = es.search(index="accounts", body=body)
    results = []
    for hit in res["hits"]["hits"]:
        results.append({
            "name": hit["_source"]["name"],
            "id": hit["_source"]["id"],
            "score": hit["_score"],
            "flag": "account"
        })
    return results

def handle_account_results(name_results):
    results = []
    for account in name_results:
        account_id = account["id"]
        account_obj = ExtendedAccount.objects(id=account_id).first()
        if isinstance(account_obj, Artist):
            results.append({
                "id": str(account_obj["id"]),
                "nickname": account_obj["nickname"],
                "flag": "artist",
                "avatar_url": account_obj["avatar_url"],
            })
        else:
            results.append({
                "id": str(account_obj["id"]),
                "name": account_obj["username"],
                "flag": "user",
                "avatar_url": account_obj["avatar_url"],
            })

    return results

def handle_music_results(music_results):
    results = []
    for music in music_results:
        music_id = music["id"]
        music_obj = Music.objects(id=music_id).first()
        results.append({
            "id": str(music_obj["id"]),
            "name": music_obj["name"],
            "thumbnail_url": music_obj["thumbnail_url"],
            "artists": get_artist_results(str(music_obj["id"])),
            "flag": "music"
        })
    return results

def handle_top_result(top_result):
    if top_result["flag"] == "account":
        account_obj = ExtendedAccount.objects(id=top_result["id"]).first()
        if isinstance(account_obj, Artist):
            return {
                "id": str(account_obj["id"]),
                "nickname": account_obj["nickname"],
                "flag": "artist",
                "avatar_url": account_obj["avatar_url"],
            }
        else:
            return {
                "id": str(account_obj["id"]),
                "name": account_obj["username"],
                "flag": "user",
                "avatar_url": account_obj["avatar_url"],
            }
    elif top_result["flag"] == "music":
        music = Music.objects(id=top_result["id"]).first()
        return {
            "id": str(music.id),
            "name": music.name,
            "thumbnail_url": music.thumbnail_url,
            "artists": get_artist_results(str(music.id)),
            "flag": "music"
        }
    elif top_result["flag"] == "lyric":
        music = Music.objects(id=top_result["music_id"]).first()
        return {
            "id": str(music.id),
            "name": music.name,
            "thumbnail_url": music.thumbnail_url,
            "artists": get_artist_results(str(music.id)),
            "flag": "music"
        }

def get_artist_results(music_id):
    results = []
    music = Music.objects(id=music_id).first()
    artists_refs = music.artists
    for artist_ref in artists_refs:
        artist = artist_ref.fetch()
        if isinstance(artist_ref, LazyReference):
            results.append({
                'id': str(artist.id),
                'nickname': artist.nickname
            })
    return results

def get_music_results(lyric_results):
    results = []
    music_id_list = []
    for lyric in lyric_results:
        music_id = lyric["music_id"]
        music = Music.objects(id=music_id).first()
        if str(music.id) not in music_id_list:
            music_id_list.append(str(music.id))
            results.append({
                "id": str(music.id),
                "name": music.name,
                "flag": "music",
                "thumbnail_url": music.thumbnail_url,
                "artists": get_artist_results(str(music.id))
            })
    return results

def get_artist_music_results(artist_id):
    results = []
    musics = Music.objects.filter_by_artists(artist_id)
    for music in musics:
        results.append({
            "id": str(music.id),
            "name": music.name,
            "flag": "music",
            "thumbnail_url": music.thumbnail_url,
            "artists": get_artist_results(str(music.id))
        })
    return results

def get_music_artist_results(music_results):
    results = []
    existing_artist_ids = []
    for music in music_results:
        for artist in music["artists"]:
            artist_obj = ExtendedAccount.objects(id=artist["id"]).first()
            if str(artist_obj.id) not in existing_artist_ids:
                results.append({
                    "id": str(artist_obj.id),
                    "nickname": artist_obj.nickname,
                    "flag": "artist",
                    "avatar_url": artist_obj.avatar_url
                })
            existing_artist_ids.append(str(artist_obj.id))
    return results
