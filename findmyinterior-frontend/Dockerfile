FROM node:22-alpine

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the application
COPY . .

# Set build-time environment variables for Next.js
ARG NEXT_PUBLIC_API_URL=https://findmyinterior.com/api/v1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# CACHE_BUST: changes each deploy to force npm run build to re-run.
# npm install layer above stays cached (fast). Only the build step re-runs.
ARG CACHE_BUST=1
RUN echo "Build: $CACHE_BUST" && npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
