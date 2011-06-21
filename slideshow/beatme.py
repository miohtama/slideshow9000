"""
    Rescan beat data from MP3s and make it available as JSON.

"""

import os
import json
from json import JSONEncoder

import echonest.audio as audio
from echonest.audio import AudioQuantum
from echonest.audio import AudioAnalysis
from pyechonest.track import Track


class EchoNestEncoder(JSONEncoder):
    """
    Helper JSON encoder to export Echo Nest audio data to JSON.
    
    Support our special callbacks to convert Python objects directly to JSON.    
    """
    
    def map_instance_variables(self, obj, *args):
        """
        """
        dict = {}
                
        # convert seconds -> milliseconds
        convert_to_ms = [ "start", "duration" ]
        
        for a in args:
            val = getattr(obj, a)
            
            if a in convert_to_ms:
                val *= 1000
            
            dict[a] = val
        
        return dict
    
    def default(self, o):
        
        #print "Serializing object:" + str(o)
        
        if isinstance(o, AudioQuantum):
            # XXX: kind not needed as each array contains only one of kind                        
            #return self.map_instance_variables(o, "kind", "start", "duration", "confidence")        
            return self.map_instance_variables(o, "start", "duration", "confidence")
        elif isinstance(o, AudioAnalysis):
            stuff = """
            bars
            beats
            duration
            end_of_fade_in
            identifier
            key
            loudness
            metadata
            mode
            pyechonest_track
            sections
            segments
            source
            start_of_fade_out
            tatums
            tempo
            time_signature            
            """            
            keys = [ x.strip() for x in stuff.split("\n") if x.strip() != "" ]
            return self.map_instance_variables(o, *keys)
        elif isinstance(o, Track) or isinstance(o, audio.LocalAudioFile):
            # Don't know what should be serialized
            return {}
        else:
            import pdb ; pdb.set_trace()
            JSONEncoder.default(self, o)
            
encoder = EchoNestEncoder()


def analyze(infile, outfile):    
    """ Create .json blob out of Echo Nest analysis """    
    print "Analyzing:" + infile
    
    data = audio.LocalAudioFile(infile)

    beats = data.analysis.beats
    
    #print "Beats:" + str(beats)
    
    json =  encoder.encode(data.analysis)
    # print json
    
    with open(outfile, "wt") as f:        
        f.write(json)
        print "Wrote " + outfile
    

path = "static/music"
for song in os.listdir(path):
    
    if not song.endswith(".mp3"):
        continue
    
    fname = os.path.join(path, song)
        
    outfile = fname.replace(".mp3", ".json")
    
    analyze(fname, outfile)
    
    

         