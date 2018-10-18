#!make
-include .env
export $(shell sed 's/=.*//' .env)
DATENOW ?= $(shell date +%s)

# Environment variables to set
BUILD_FOLDER=build
SOURCE_FOLDER=src
PROJECT_NAME=hapi-starter
DB_NAME=hapi_starter
LOCAL_DB_PORT=3306



# Recreate build folder
source-clean:
	rm -rf ${BUILD_FOLDER}
	mkdir -p ${BUILD_FOLDER}/${SOURCE_FOLDER}

# Lint code
source-lint:
	./node_modules/.bin/eslint ${SOURCE_FOLDER}

# Build code with babel
source-build:
	./node_modules/.bin/babel ${SOURCE_FOLDER} --out-dir ${BUILD_FOLDER}/${SOURCE_FOLDER} -q

# Copy JSON fixtures files and package.json
source-copy-files:
	cp package.json ${BUILD_FOLDER}
	mkdir -p ${BUILD_FOLDER}/${SOURCE_FOLDER}/config
	mkdir -p ${BUILD_FOLDER}/${SOURCE_FOLDER}/database/seed
	cp ${SOURCE_FOLDER}/config/*.json ${BUILD_FOLDER}/${SOURCE_FOLDER}/config || true
	cp ${SOURCE_FOLDER}/database/seed/* ${BUILD_FOLDER}/${SOURCE_FOLDER}/database/seed || true

# Execute all source targets
source:
	make source-lint
	make source-clean
	make source-build
	make source-copy-files



# Initialize database and create it
db-init:
	docker run --name ${PROJECT_NAME}-db -p ${LOCAL_DB_PORT}:${LOCAL_DB_PORT} -e MYSQL_ROOT_PASSWORD="" -e MYSQL_ALLOW_EMPTY_PASSWORD=true -dt mariadb:latest
	sleep 10
	docker exec -i ${PROJECT_NAME}-db mysql -uroot mysql -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME};"

# Restart database container
db-restart:
	docker container restart ${PROJECT_NAME}-db

# Stop database container
db-stop:
	docker container stop ${PROJECT_NAME}-db

# Remove database container
db-rm:
	docker container rm ${PROJECT_NAME}-db

# Start database container
db-start:
	docker container start ${PROJECT_NAME}-db

# Load or reload database container
db-load:
	make db-stop || true
	make db-rm || true
	make db-init
	make db-start

# If database container found, start it, else load it
db:
ifeq (docker ps -af name=${PROJECT_NAME}-db --format "{{.Names}}", ${PROJECT_NAME}-db)
	make db-start
else
	make db-load
endif



# Remove dependencies before installing them again (also purge lockfile)
fresh-install:
	rm -rf {node_modules,package-lock.json}
	make install

# Install dependencies
install:
	npm i -q

# Run tests
test:
	echo "No tests specified... yet."

# Start app
start:
	make source
	node build/src
