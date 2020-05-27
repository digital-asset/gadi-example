build:
	daml build
	daml codegen js -o daml2js .daml/dist/*.dar
	cd ui && yarn install --force --frozen-lockfile
