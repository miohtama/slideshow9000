import os
from pyechonest import config, track

api_key = os.getenv("ECHO_NEST_API_KEY")
if api_key == None:
    raise Exception("ECHO_NEST_API_KEY environment variable is not set!")

config.ECHO_NEST_API_KEY = api_key

def get_beats(filename):
    audio_file = open(filename)
    track_analysis = track.track_from_file(audio_file, 'mp3')
    return track_analysis
