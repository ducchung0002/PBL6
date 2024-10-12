from elasticsearch import Elasticsearch
from dotenv import load_dotenv
import os

load_dotenv()

es = Elasticsearch(os.environ.get('ELASTICSEARCH_HOST'),
                   basic_auth=('elastic', os.environ.get('ELASTICSEARCH_PASSWORD')))
assert es.ping()
