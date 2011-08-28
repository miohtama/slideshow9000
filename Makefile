# force bash to make sure that we get what we want
SHELL:=/bin/bash

# override this from commandline as needed
ifndef VIRTUAL_ENV
VIRTUAL_ENV:=../venv
endif

PATH:=$(VIRTUAL_ENV)/bin:$(PATH)

# silly MacOSX does not necessarily export PATH even if we tell it to :(
P:=PATH=$(PATH)

export VIRTUAL_ENV
export PATH

# make sure that the .flags directory exists
$(shell mkdir -p .flags)

venv: $(VIRTUAL_ENV)/bin/activate

$(VIRTUAL_ENV)/bin/activate:
	@which virtualenv > /dev/null 2>&1 || (echo "Missing virtualenv package! 'sudo easy_install virtualenv' maybe?" && false)
	@virtualenv --no-site-packages $(VIRTUAL_ENV)
	@$P easy_install Pyramid==1.0

develop: venv .flags/setup-done

.flags/setup-done: setup.py
	@$P python setup.py develop
	@touch .flags/setup-done

run-server: develop
	paster serve development.ini

