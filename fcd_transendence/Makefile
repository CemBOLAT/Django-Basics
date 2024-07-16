all:
	@docker compose -f ./docker-compose.yml up -d --build

start:
	@docker compose -f ./docker-compose.yml start

stop:
	@docker compose -f ./docker-compose.yml stop

clean:
	@docker compose -f ./docker-compose.yml down --volumes --remove-orphans

fclean: clean
	@docker system prune -af

re: fclean all

.PHONY: all clean fclean re
