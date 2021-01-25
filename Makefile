lint:
	npx eslint ./server && cd ./react-ui && npx eslint ./src

prettier:
	npx prettier --write .

build:
	npm run build-b

run:
	nodemon --watch react-ui/build ./lib/bin

test-coverage:
	npm test -- --coverage --coverageProvider=v8

ci:
	make build && cd ./react-ui && npm run build && cd ../ && make prettier && make lint && make test-coverage