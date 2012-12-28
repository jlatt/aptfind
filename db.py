import sqlalchemy
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import *
from geoalchemy import *
from geoalchemy.postgis import PGComparator
from geoalchemy.postgis import pg_functions


engine = sqlalchemy.create_engine('postgresql+psycopg2://localhost/aptfind', client_encoding='utf-8')
metadata = sqlalchemy.MetaData(engine)
Session = sessionmaker(bind=engine)
Base = declarative_base(metadata=metadata)


class Listing(Base):
    __tablename__ = 'listing'
    id = Column(sqlalchemy.Integer, sqlalchemy.Sequence('listing_id_seq'), primary_key=True)
    url = Column(sqlalchemy.String(64), nullable=False)
    geom = GeometryColumn(Point(2), comparator=PGComparator)

GeometryDDL(Listing.__table__)
