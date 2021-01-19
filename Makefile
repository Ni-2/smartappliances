lint:
	npx eslint ./server && cd ./react-ui && npx eslint ./src

prettier:
	npx prettier --write .

run:
	nodemon --watch react-ui/build ./lib