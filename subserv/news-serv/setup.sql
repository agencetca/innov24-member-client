CREATE DATABASE innov24;
CREATE TABLE news (
    id                  SERIAL PRIMARY KEY,
    title               varchar(100) NOT NULL,
    chapo               varchar(255) NOT NULL,
    content             TEXT NOT NULL,
    publication_date    date
);
