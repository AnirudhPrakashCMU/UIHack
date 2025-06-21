install: install-frotz setup-keys
	npm install

setup-keys:
	node scripts/setup_keys.js

install-frotz:
	@if command -v dfrotz >/dev/null 2>&1 || command -v frotz >/dev/null 2>&1; then \
	    echo "Frotz already installed"; \
	else \
	    if command -v apt-get >/dev/null 2>&1; then \
	        echo "Installing frotz via apt-get"; sudo apt-get update && sudo apt-get install -y frotz; \
	    elif command -v brew >/dev/null 2>&1; then \
	        echo "Installing frotz via Homebrew"; brew install frotz; \
	    else \
	        echo "Please install frotz manually"; exit 1; \
	    fi; \
	fi

fetch:
	npm run fetch-games

generate-hunger:
	node scripts/generate_hunger_game.js

test:
	npm test

test-image:
	node scripts/test_image.js

play-zork:
	@if [ -x /usr/games/dfrotz ]; then \
	/usr/games/dfrotz game_data/zork1.z3; \
	elif command -v dfrotz >/dev/null 2>&1; then \
	dfrotz game_data/zork1.z3; \
	elif command -v frotz >/dev/null 2>&1; then \
	frotz game_data/zork1.z3; \
	else \
	echo "Frotz not installed"; exit 1; \
	fi

.PHONY: install install-frotz setup-keys fetch generate-hunger test test-image play-zork
