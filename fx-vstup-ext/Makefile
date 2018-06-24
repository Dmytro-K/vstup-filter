AWK=gawk

BUILD_DIR = _build
SRC_DIR = src

DIR_FLAGS = -s $(SRC_DIR) -a $(BUILD_DIR)

WEB_EXT=$(shell which web-ext 2> /dev/null)
NPM=$(shell which npm 2> /dev/null)

# $(info $(WEB_EXT))
# $(info $(NPM))
#
# ifeq ("$(NPM)", "")
#     $(info "empty")
#     # WEB_EXT_EXISTS=true
# else
#     $(info "not empty")
#     # WEB_EXT_EXISTS=false
# endif

init:
ifeq ("$(WEB_EXT)", "")
ifneq ("$(NPM)", "")
	npm --global install web-ext
else
	$(error Install "npm" before)
endif
endif

build:
	web-ext build $(DIR_FLAGS)

build_signed:
	@if [[ -z "$(AMO_JWT_ISSUER)" ]]; then \
		echo "Wrong AMO_JWT_ISSUER"; exit 1; \
	fi
	@if [[ -z "$(AMO_JWT_SECRET)" ]]; then \
		echo "Wrong AMO_JWT_SECRET"; exit 1; \
	fi
	web-ext sign $(DIR_FLAGS) --api-key=$(AMO_JWT_ISSUER) --api-secret=$(AMO_JWT_SECRET)

run:
	web-ext run --no-reload $(DIR_FLAGS)

lint:
	web-ext lint $(DIR_FLAGS)

define AWK_COMMAND
/"version"[[:space:]]*:/ {
	gsub(/"[[:digit:]]+\.[[:digit:]]+\.[[:digit:]]+"/,
		 sprintf("\"%s\"", version));
};
{print}
endef
export AWK_COMMAND

NEW_VERSION=$(shell ./increment_version.sh -p $$(jq -r '.version' src/manifest.json))

bumpversion:
	$(AWK) -i inplace -v version=$(NEW_VERSION) "$$AWK_COMMAND" src/manifest.json

build_signed_inc_version:
	$(MAKE) bumpversion
	$(MAKE) build_signed
