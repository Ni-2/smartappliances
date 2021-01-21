lint:
	npx eslint ./server && cd ./react-ui && npx eslint ./src

prettier:
	npx prettier --write .

build:
	npm run build-b

run:
	nodemon --watch react-ui/build ./lib/bin

test-all:
	npm run test && cd react-ui && npm run test

test-coverage:
	npm run test -- --coverage --coverageProvider=v8