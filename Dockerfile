# Use the latest Debian image
FROM debian:latest

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive

# Install initial dependencies
RUN apt-get update && apt-get install --yes \
    curl \
    ca-certificates \
    gnupg2

# Install Microsoft azure-cli
RUN mkdir --parents /etc/apt/keyrings
RUN curl --fail --location --show-error https://packages.microsoft.com/keys/microsoft.asc | \
    gpg --dearmor --output /etc/apt/keyrings/microsoft.gpg 
RUN chmod go+r /etc/apt/keyrings/microsoft.gpg
RUN echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/microsoft.gpg] https://packages.microsoft.com/repos/azure-cli/ $(. /etc/os-release && echo "$VERSION_CODENAME") main" | \
    tee /etc/apt/sources.list.d/azure-cli.list && \
    apt-get update && apt-get install --yes azure-cli

# Install Node.js and npm
RUN curl --fail --location --show-error https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get update && apt-get install --yes nodejs && \
    npm install --global npm@latest

# Set the working directory
WORKDIR /app

# Copy required files from the local directory
COPY package.json .
COPY main.js .

# Install dependencies
RUN npm install express

# Expose port
EXPOSE 3000

# Start the application
CMD [ "npm", "main" ]
