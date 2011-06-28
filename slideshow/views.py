import re
import os
import shutil
import hashlib
import time
from odict import odict

from slideshow.models import DBSession
from slideshow.models import MyModel
from pyramid.exceptions import NotFound
from webob import Response
from pyramid import config

from mutagen.mp3 import MP3

def create_mp3_list():
    """
    Read all songs in music folder and get their titles for the <select>
    """    
    songs = odict()
                 
    path = os.path.join(os.path.dirname(__file__), "static", "music") 
    
    for file in os.listdir(path):
        
        if not file.endswith(".mp3"):
            # .jsoen
            continue
        
        fname = os.path.join(path, file)
        audio = MP3(fname)
        
        # Parse ID3 tag
        tits = audio.get("TIT2", None)
        if tits:
            title = tits.text[0]
        else:
            title = file
            
        print "Found song " + fname + " " + title
        songs["static/music/" + file] = title
                
    return songs


# Scan available MP3s on start-up
songs = create_mp3_list()

def my_view(request):
    """
    Home view
    """
    
    dbsession = DBSession()
    root = dbsession.query(MyModel).filter(MyModel.name==u'root').first()
    
    
    return {'root':root, 'project':'slideshow', 'songs' : songs}


def recorder(request):
    """
    Selenium video recorder
    """        
    return {'project':'slideshow', 'songs' : songs}


def set_upload_dir(dirname):
    global permanent_store_dir
    permanent_store_dir = dirname
current_counter   = 0

def get_temp_file_name():
    global current_counter
    current_counter += 1
    return "%d-%d.tmp" % (int(time.time()), current_counter)

def md5_for_file(f, block_size=2**18):
    md5 = hashlib.md5()
    while True:
        data = f.read(block_size)
        if not data:
            break
        md5.update(data)
    return md5.hexdigest()

def get_permanent_file_name(name):
    return os.path.join(permanent_store_dir, name)

def upload(request):
    if request.method != 'POST':
        return { 'error': 'POST method expected' }

    files = request.POST.getall('files[]')
    
    uploaded = []
    for myfile in files:
        tmp_file_name = get_permanent_file_name(get_temp_file_name())
        permanent_file = open(tmp_file_name, 'w')
        shutil.copyfileobj(myfile.file, permanent_file)
        permanent_file.close()

        f = open(tmp_file_name, 'r')
        hash = md5_for_file(f)
        f.close()

        final_name = hash + '.jpg'
        os.rename(tmp_file_name, get_permanent_file_name(final_name))
        uploaded.append({ 'name': '/files/' + final_name })

    return uploaded

filematch = re.compile('^[a-f0-9A-F]+\.jpg$');

def get_file(request):
    filename = request.matchdict.get('filename')
    if not filename:
        raise NotFound("The requested resource could not be found")

    if not filematch.match(filename):
        raise NotFound("The requested resource could not be found")

    f = open(get_permanent_file_name(filename))
    content = f.read()
    f.close()
 
    res = Response()
    res.body = content
    res.content_type = 'image/jpeg'

    return res

