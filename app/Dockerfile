# Stage 1: build
FROM node:18.2.0 as build

WORKDIR /app
COPY makefile $WORKDIR

# Install requirements
COPY package.json .
COPY package-lock.json .
RUN make install

# Build app
COPY . $WORKDIR
ARG KRT_PROJECT
RUN make build

# Stage 2: Serve with nginx
FROM ghcr.io/kibalabs/app-serve:latest
COPY --from=build /app/dist /usr/share/nginx/html
