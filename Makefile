MAKEFILE_DIR:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
BAKE_SCRIPT:=$(MAKEFILE_DIR)/buildtools/docker-bake.hcl
BUILDX_HOST_PLATFORM:=$(shell docker buildx inspect default | sed -nE 's/^Platforms: ([^,]*),.*$$/\1/p')
BAKE:=cd $(MAKEFILE_DIR) && docker buildx bake --builder default --load --set *.platform=$(BUILDX_HOST_PLATFORM) -f $(BAKE_SCRIPT)

all: ui-example

ui-example:
	$(BAKE) starling-ui-example

.PHONY: ui-example
