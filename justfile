set shell := ["bash", "-cu"]
set dotenv-load := true

default:
    @just --list

install:
    pnpm install && npx lefthook install

dev app="":
    #!/usr/bin/env bash
    if [ -z "{{app}}" ]; then pnpm turbo run dev; else pnpm --filter @daracademy/{{app}} dev; fi

build:
    pnpm turbo run build

typecheck:
    pnpm turbo run typecheck

lint:
    pnpm turbo run lint

format:
    pnpm prettier --write "**/*.{ts,tsx,js,jsx,json,md,css}"

db-generate:
    pnpm --filter @daracademy/database db:generate

db-migrate:
    pnpm --filter @daracademy/database db:migrate

db-push:
    pnpm --filter @daracademy/database db:push

db-studio:
    pnpm --filter @daracademy/database studio

clean:
    pnpm turbo run clean && rm -rf node_modules .turbo

doctor:
    @node --version
    @pnpm --version
    @git rev-parse --abbrev-ref HEAD
    @git status --short | head -10
