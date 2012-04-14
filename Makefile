TESTS = $(shell find test -name "*.test.js")
REPORTER = spec

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--timeout 6000 \
		--growl \
		$(TESTS)


.PHONY: test
