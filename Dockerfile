FROM denoland/deno:1.25.4
WORKDIR /app
COPY src/. .
RUN deno cache index.ts
EXPOSE 3000
CMD ["run", "--allow-all", "index.ts"]