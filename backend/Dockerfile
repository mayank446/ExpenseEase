# Use an official Node.js image from the Docker Hub
FROM node:21.6.2

# Set the working directory inside the container
WORKDIR /

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on (default for Node.js is 3000)
EXPOSE 8000:8000

# COMMANDS TO INITIALIZE THE PRISMA
# Command to install Prisma
# command is "npx prisma init"
RUN npx prisma init

# Command to start the application
# command is "npm run dev"
CMD ["npm", "run", "dev"]
