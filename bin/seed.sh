#! /usr/bin/env bash

# bash bin/seed.sh local (this is the default if no argument is given)
# bash bin/seed.sh rds

TARGET="{$1:local}"

if [ "$TARGET" == "local" ]; then

    export DATABASE_URL="postgresql+asyncpg://postgres:password@127.0.0.1:5432/medflow"
    PSQL_HOST="127.0.0.1"
    PSQL_DB="medflow"
elif [ "$TARGET" == "rds" ]; then

    export DATABASE_URL="postgresql+asyncpg://postgres:password@medflow.cv8s0o2ayt2o.us-east-2.rds.amazonaws.com:5432/medflow"
    PSQL_HOST="5432"
    PSQL_DB="medflow"

else 
    echo "Usage: bin/seed.sh [local|rds]"
    exit 1
fi

echo "Seeding target: $TARGET"

cd backend

#creating the db tables
python -m scripts.create_tables

#load data
psql -h "$PSQL_HOST" -U postgres -d "$PSQL_DB" -f ../db/seeds.sql

python -m scripts.seed_users

echo "Seed complete for $TARGET"