# Use Node LTS
FROM node:lts

# Set working directory
WORKDIR /usr/src/app

# Copy package.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose your port
EXPOSE 3012

# Default command
CMD ["npm", "run", "dev"]