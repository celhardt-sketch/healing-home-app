FROM python:3.12-slim

WORKDIR /app

# Copy all source code first (hatchling needs app/ to build the wheel)
COPY . .

# Install the project and its dependencies
RUN pip install --no-cache-dir .

# Create data directory for SQLite on persistent volume
RUN mkdir -p /data/backups

# Expose port (Railway sets PORT env var)
EXPOSE 8000

# Run with uvicorn — Railway provides PORT env var
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
