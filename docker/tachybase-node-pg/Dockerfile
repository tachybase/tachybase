FROM node:20.18.0-bookworm as base

# install 
RUN apt-get update && \
    apt-get install -y --no-install-recommends postgresql-client zip && \
    rm -rf /var/lib/apt/lists/*