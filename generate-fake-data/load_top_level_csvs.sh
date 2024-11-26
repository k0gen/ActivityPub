#!/bin/bash
DATABASE="activitypub"
CSV_DIR="/var/lib/mysql-files/csvs"
TABLES=("sites" "accounts" "users" "posts")

for table in "${TABLES[@]}"; do
    docker exec -it scale-testing mysql -uroot -proot -e "
    LOAD DATA INFILE '$CSV_DIR/${table}.csv'
    INTO TABLE $DATABASE.$table
    FIELDS TERMINATED BY ',' ENCLOSED BY '\"'
    LINES TERMINATED BY '\n'
    IGNORE 1 ROWS;"
    echo "Imported ${table}.csv into $table"
done
