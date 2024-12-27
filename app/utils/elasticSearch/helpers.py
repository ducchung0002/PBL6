from elasticsearch import helpers
from app.models.music import Music
from app.models.artist import Artist
from app.models.base.extended_account import ExtendedAccount
from . import es


def bulk_index_lyrics(lyrics_data):
    actions = [
        {
            "_index": "lyrics",
            "_source": {
                "music_id": lyric['music_id'],
                "lyric": lyric['lyric']
            }
        }
        for lyric in lyrics_data
    ]
    helpers.bulk(es, actions)

def bulk_index_musics(music_data):
    actions = []
    for m in music_data:
        actions.append({
            "_op_type": "index",
            "_index": "musics",
            "_id": m["id"],
            "_source": {
                "id": m["id"],
                "name": m["name"]
            }
        })
    helpers.bulk(es, actions)

def search_lyrics(query):
    body = {
        "size": 20,
        "query": {
            "bool": {
                "should": [
                    {
                        "match_phrase": {
                            "lyric": {
                                "query": query,
                                "boost": 2
                            }
                        }
                    },
                    {
                        "match": {
                            "lyric": {
                                "query": query,
                                "fuzziness": "AUTO"
                            }
                        }
                    },
                    {
                        "match": {
                            "lyric.folded": {
                                "query": query,
                                "fuzziness": "AUTO"
                            }
                        }
                    }
                ]
            }
        },
        "highlight": {
            "fields": {
                "lyric": {}
            }
        }
    }
    response = es.search(index="lyrics", body=body)
    results = []
    for hit in response['hits']['hits']:
        results.append({
            "music_id": hit["_source"]["music_id"],
            "lyric": hit["_source"]["lyric"],
            "score": hit["_score"],
            "flag": "lyric",
            "highlights": hit.get("highlight", {}).get("lyric", [])
        })
    return results

def search_musics(query):
    body = {
        "query": {
            "bool": {
                "should": [
                    {
                        "match_phrase": {
                            "name": {
                                "query": query,
                                "slop": 1,
                                "boost": 4
                            }
                        }
                    },
                    {
                        "match": {
                            "name": {
                                "query": query,
                                "fuzziness": "AUTO"
                            }
                        }
                    }
                ]
            }
        },
        "highlight": {
            "pre_tags": ["<em>"],
            "post_tags": ["</em>"],
            "fields": {
                "name": {}
            }
        },
        "size": 20
    }
    res = es.search(index="musics", body=body)
    results = []
    for hit in res["hits"]["hits"]:
        highlights = []
        if "highlight" in hit and "name" in hit["highlight"]:
            highlights = hit["highlight"]["name"]
        results.append({
            "name": hit["_source"]["name"],
            "id": hit["_source"]["id"],
            "score": hit["_score"],
            "flag": "music",
            "highlights": highlights
        })
    return results

def bulk_index_artists(artists):
    actions = [
        {
            "_index": "artists",
            "_id": artist['id'],
            "_source": artist
        }
        for artist in artists
    ]
    helpers.bulk(es, actions)

def search_artists(query):
    body = {
        "size": 20,
        "query": {
            "multi_match": {
                "query": query,
                "fields": ["name^3", "nickname^2", "username"],
                "fuzziness": "AUTO",
                "boost": 8
            }
        },
        "highlight": {
            "pre_tags": ["<em>"],
            "post_tags": ["</em>"],
            "fields": {
                "name": {},
                "nickname": {},
                "username": {}
            }
        }
    }
    response = es.search(index="artists", body=body)
    results = []
    for hit in response['hits']['hits']:
        highlight = hit.get('highlight', {})
        highlights = []
        for field in ['name', 'nickname', 'username']:
            if field in highlight:
                highlights.extend(highlight[field])
        results.append({
            "id": hit["_source"]["id"],
            "name": hit["_source"]["name"],
            "nickname": hit["_source"]["nickname"],
            "score": hit["_score"],
            "highlights": highlights,
            "flag": "artist"
        })
    return results

def bulk_index_users(users):
    actions = [
        {
            "_index": "users",
            "_id": user['id'],
            "_source": user
        }
        for user in users
    ]
    helpers.bulk(es, actions)

def search_users(query):
    body = {
        "size": 5,
        "query": {
            "multi_match": {
                "query": query,
                "fields": ["name^3", "username"],
                "fuzziness": "AUTO",
                "boost": 10
            }
        },
        "highlight": {
            "pre_tags": ["<em>"],
            "post_tags": ["</em>"],
            "fields": {
                "name": {},
                "username": {}
            }
        }
    }
    response = es.search(index="users", body=body)
    results = []
    for hit in response['hits']['hits']:
        highlight = hit.get('highlight', {})
        highlights = []
        for field in ['name', 'username']:
            if field in highlight:
                highlights.extend(highlight[field])
        results.append({
            "id": hit["_source"]["id"],
            "name": hit["_source"]["name"],
            "username": hit["_source"]["username"],
            "score": hit["_score"],
            "highlights": highlights,
            "flag": "user"
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
    if top_result["flag"] == "artist" or top_result["flag"] == "user":
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
