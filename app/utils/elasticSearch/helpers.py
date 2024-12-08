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
    account_ids = [account["id"] for account in name_results]
    accounts = ExtendedAccount.objects(id__in=account_ids).only("id", "username", "nickname", "avatar_url")
    for account in accounts:
        if isinstance(account, Artist):
            results.append({
                "id": str(account["id"]),
                "nickname": account["nickname"],
                "flag": "artist",
                "avatar_url": account["avatar_url"],
            })
        else:
            results.append({
                "id": str(account["id"]),
                "name": account["username"],
                "flag": "user",
                "avatar_url": account["avatar_url"],
            })

    return results

def handle_music_results(music_results):
    results = []
    music_ids = [music["id"] for music in music_results]
    musics = Music.objects(id__in=music_ids).only("id", "name", "thumbnail_url")
    for music in musics:
        results.append({
            "id": str(music["id"]),
            "name": music["name"],
            "thumbnail_url": music["thumbnail_url"],
            "artists": get_artist_results(str(music["id"])),
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
        results.append({
            'id': str(artist.id),
            'nickname': artist.nickname
        })
    return results

def get_music_results(lyric_results):
    results = []
    music_id_list = []
    for lyric in lyric_results:
        if lyric["music_id"] not in music_id_list:
            music_id_list.append(lyric["music_id"])
    musics = Music.objects(id__in=music_id_list).only("id", "name", "thumbnail_url")
    for music in musics:
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
            if artist["id"] not in existing_artist_ids:
                existing_artist_ids.append(artist["id"])
    artists = ExtendedAccount.objects(id__in=existing_artist_ids).only("id", "nickname", "avatar_url")
    for artist in artists:
        results.append({
            "id": str(artist.id),
            "nickname": artist.nickname,
            "flag": "artist",
            "avatar_url": artist.avatar_url
        })
    return results
