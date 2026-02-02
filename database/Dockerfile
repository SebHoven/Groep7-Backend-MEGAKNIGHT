# SQLite Database Container
FROM alpine:latest

# Install SQLite3
RUN apk add --no-cache sqlite

# Create a directory for the database
RUN mkdir -p /db

# Set working directory
WORKDIR /db

# Initialize an empty database (Prisma will handle migrations)
RUN touch groups.db && chmod 666 groups.db

# Expose volume for persistent data
VOLUME ["/db"]

# Keep container running to maintain volume
CMD ["sh", "-c", "while true; do sleep 3600; done"]
