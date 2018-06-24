AWK=gawk
CHROME=google-chrome-stable

PROJECT_NAME=$(shell jq -r '.name' src/manifest.json)

VERSION=$(shell jq -r '.version' src/manifest.json)
NEW_VERSION=$(shell ./increment_version.sh -p $(VERSION))

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

.PHONY: init
init:
	@if [[ ! -d $(BUILD_DIR) ]]; then \
		mkdir $(BUILD_DIR); \
	fi

.PHONY: init_firefox
init_firefox: init
ifeq ("$(WEB_EXT)", "")
ifneq ("$(NPM)", "")
	npm --global install web-ext
else
	$(error Install "npm" before)
endif
endif

build_firefox: init
	web-ext build $(DIR_FLAGS)

build_firefox_signed: init
	@if [[ -z "$(AMO_JWT_ISSUER)" ]]; then \
		echo "Wrong AMO_JWT_ISSUER"; exit 1; \
	fi
	@if [[ -z "$(AMO_JWT_SECRET)" ]]; then \
		echo "Wrong AMO_JWT_SECRET"; exit 1; \
	fi
	web-ext sign $(DIR_FLAGS) --api-key=$(AMO_JWT_ISSUER) --api-secret=$(AMO_JWT_SECRET)

run_firefox: init
	web-ext run --no-reload $(DIR_FLAGS)

lint_firefox: init
	web-ext lint $(DIR_FLAGS)

define AWK_COMMAND
/"version"[[:space:]]*:/ {
	gsub(/"[[:digit:]]+\.[[:digit:]]+\.[[:digit:]]+"/,
		 sprintf("\"%s\"", version));
};
{print}
endef
export AWK_COMMAND

bumpversion:
	$(AWK) -i inplace -v version=$(NEW_VERSION) "$$AWK_COMMAND" src/manifest.json

build_firefox_signed_inc_version: init
	$(MAKE) bumpversion
	$(MAKE) build_firefox_signed

build_chrome: init
	@if [[ ! -d "$(BUILD_DIR)/$(PROJECT_NAME)" ]]; then \
		ln -s $$(realpath --relative-to=$(BUILD_DIR) $(SOURCE_DIR)) $(BUILD_DIR)/$(PROJECT_NAME); \
	fi
	@if [[ -e "$(PROJECT_NAME).pem" ]]; then \
		$(CHROME) "--pack-extension=$(BUILD_DIR)/$(PROJECT_NAME)" "--pack-extension-key=$(PROJECT_NAME).pem"; \
	else \
		$(CHROME) "--pack-extension=$(BUILD_DIR)/$(PROJECT_NAME)"; \
		mv "$(PROJECT_NAME).pem" ./; \
	fi
	mv "$(BUILD_DIR)/$(PROJECT_NAME).crx" "$(BUILD_DIR)/$(PROJECT_NAME)-$(VERSION).crx"

.PHONY: all
all:
	$(MAKE) build_firefox_signed_inc_version
	$(MAKE) build_chrome

# .PHONY: default
# default: all
