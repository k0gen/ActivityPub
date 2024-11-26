#!/bin/bash
DATABASE="activitypub"
CSV_DIR="csvs/followers"

for file in $(ls $CSV_DIR); do
    docker exec -it scale-testing mysql -uroot -proot -e "
    LOAD DATA INFILE '/var/lib/mysql-files/csvs/followers/$file'
    INTO TABLE $DATABASE.follows
    FIELDS TERMINATED BY ',' ENCLOSED BY '\"'
    LINES TERMINATED BY '\n'
    IGNORE 1 ROWS;"
    echo "Imported $file into follows"
done
