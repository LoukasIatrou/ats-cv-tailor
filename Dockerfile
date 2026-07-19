# Bundles Node + Tectonic (a self-contained, statically linked LaTeX engine) so the
# preview server works with no local LaTeX install. Mount your CV directory to /cv.
#
# Tectonic fetches LaTeX package/class files it needs from its "bundle" lazily, per file,
# on first use, rather than shipping a full TeX Live inside the binary. We warm the cache
# by compiling this repo's own example CVs at build time (requires network access during
# `docker build`, same as any `apt-get`/`npm install` layer), so the bundled examples work
# with zero runtime network access. A CV that uses LaTeX packages beyond what
# examples/*.tex reference will still need network on its first compile — mount a volume
# at TECTONIC_CACHE_DIR (see README) to persist whatever it fetches across restarts.
FROM node:20-slim AS tectonic
ARG TECTONIC_VERSION=0.16.9
ENV TECTONIC_CACHE_DIR=/opt/tectonic-cache
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl \
    && curl -fsSL -o /tmp/tectonic.tar.gz \
      "https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%40${TECTONIC_VERSION}/tectonic-${TECTONIC_VERSION}-x86_64-unknown-linux-musl.tar.gz" \
    && tar -xzf /tmp/tectonic.tar.gz -C /usr/local/bin \
    && chmod +x /usr/local/bin/tectonic \
    && rm /tmp/tectonic.tar.gz \
    && rm -rf /var/lib/apt/lists/*
COPY examples/sample-cv.tex examples/sample-cv-tailored.tex /tmp/warm/
RUN mkdir -p /tmp/warm/out \
    && tectonic /tmp/warm/sample-cv.tex --outdir /tmp/warm/out \
    && tectonic /tmp/warm/sample-cv-tailored.tex --outdir /tmp/warm/out \
    && rm -rf /tmp/warm

FROM node:20-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY --from=tectonic /usr/local/bin/tectonic /usr/local/bin/tectonic
COPY --from=tectonic /opt/tectonic-cache /opt/tectonic-cache
ENV TECTONIC_CACHE_DIR=/opt/tectonic-cache

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY bin ./bin
COPY src ./src
COPY public ./public

ENV PORT=5050
ENV LATEX_ENGINE=tectonic
EXPOSE 5050

HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||5050)+'/', r => process.exit(r.statusCode===200?0:1)).on('error', () => process.exit(1))"

ENTRYPOINT ["node", "bin/preview.js"]
CMD ["/cv/cv.tex"]
