FROM google/cloud-sdk:slim

# Install Node.js and npm
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json .

RUN npm install

COPY config.js .
COPY data-generate-and-upload.sh .
COPY generate-data.js .
COPY generate-follows.js .
COPY generate-follows-worker.js .
COPY generate-feeds.js .
COPY generate-feeds-worker.js .

CMD ["bash", "data-generate-and-upload.sh"]
