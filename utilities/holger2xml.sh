#!/bin/bash

#!/bin/sh

# A POSIX variable
OPTIND=1         # Reset in case getopts has been used previously in the shell.

# Initialize our own variables:
output_file=""
verbose=0

while getopts "h?vd:" opt; do
    case "$opt" in
    h|\?)
        show_help
        exit 0
        ;;
    v)  verbose=1
        ;;
    d)  db=$OPTARG
        ;;
    esac
done

shift $((OPTIND-1))

[ "$1" = "--" ] && shift

# echo "verbose=$verbose, output_file='$output_file', Leftovers: $@"

mkdir "$db"

edb='DB'
emb='MB'

SAVEIFS=$IFS
IFS=$(echo -en "\n\b")
for dbf in $db?.$edb
do
    table=`basename "$dbf" .$edb`
    dbb=$table.$emb
    xmlf=$table.xml
    echo "File: $dbf"
    echo "Blob: $dbb"
    echo "Table: $table"
    echo "Db: $db"
    pxxmldump -b "$dbb" -f "$dbf" > "$db/$xmlf.iso8859-1"
    iconv -f ISO8859-1 -t UTF-8 "$db/$xmlf.iso8859-1" > "$db/$xmlf"
    rm "$db/$xmlf.iso8859-1"
done
IFS=$SAVEIFS

cp -p $db.{hol,ho7,bas,eve,spa} "$db"

(cd "$db"; made_at=`grep timestamp *.xml | cut -d '>' -f 2- | cut -d '<' -f 1| sort | uniq| tail -n 1`; zip "../$db-$made_at.zip" *)
