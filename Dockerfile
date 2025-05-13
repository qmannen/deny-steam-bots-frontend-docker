FROM node:18

# Install Azure CLI
RUN curl -sL https://aka.ms/InstallAzureCLIDeb | bash

# Create app directory
WORKDIR /usr/src/app

# Copy application files
COPY package.json ./
COPY server.js ./

# Install app dependencies
RUN npm install

# Expose port
EXPOSE 3000

# Start the application
CMD [ "npm", "start" ]
