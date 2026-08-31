FROM node:22-bookworm-slim

RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    texlive-fonts-recommended \
    texlive-latex-base \
    texlive-latex-extra \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json ./
COPY src ./src

ENV NODE_ENV=production
ENV PORT=8080

RUN useradd --create-home --uid 10001 compiler
USER compiler

EXPOSE 8080
CMD ["node", "src/server.mjs"]
