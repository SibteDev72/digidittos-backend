#!/bin/sh
set -e

echo "Running admin seeder..."
node src/database/seeders/adminSeeder.js || echo "Seeder warning: seeding skipped or failed (non-fatal)"

echo "Starting server..."
exec "$@"
