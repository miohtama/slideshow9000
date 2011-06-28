from pyramid.config import Configurator
from sqlalchemy import engine_from_config

from slideshow.models import initialize_sql

from slideshow.views import set_upload_dir

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    engine = engine_from_config(settings, 'sqlalchemy.')
    initialize_sql(engine)
    config = Configurator(settings=settings)
    config.add_static_view('static', 'slideshow:static')
    config.add_route('home', '/', view='slideshow.views.my_view',
                     view_renderer='templates/mytemplate.pt')
    config.add_route('upload', '/upload', view='slideshow.views.upload',
                     view_renderer='json')

    config.add_route('recorder', '/recorder', view='slideshow.views.recorder',
                     view_renderer='templates/recorder.pt')
    
    config.add_route('get_file', '/files/{filename}', view='slideshow.views.get_file')

    set_upload_dir(config.get_settings()['upload_dir'])
    return config.make_wsgi_app()


