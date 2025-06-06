# --- variables ajustables ---------------------------------
DC       ?= docker compose
SERVICE  ?= nuxt
EXEC     := $(DC) exec $(SERVICE)

# --- cibles ------------------------------------------------
.PHONY: migration-create migration-run migration-undo

## make migration NAME=create-entity
migration-create:
	@if [ -z "$(NAME)" ]; then \
		echo "❌  Merci de préciser le nom : make migration NAME=<nom_migration>"; \
		exit 1; \
	fi
	$(EXEC) npx sequelize-cli migration:create --name $(NAME)&& \
    for f in migrations/*-$(NAME).js; do mv "$$f" "$${f%.js}.cjs"; done

migration-run:
	$(EXEC) npx sequelize-cli db:migrate

migration-undo:
	$(EXEC) npx sequelize-cli db:migrate:undo

migration-reset:
	$(EXEC) npx sequelize-cli db:migrate:undo:all
	$(EXEC) npx sequelize-cli db:migrate