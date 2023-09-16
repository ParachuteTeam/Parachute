FROM node:18-alpine
WORKDIR /app
COPY package*.json /app
RUN npm install --save
COPY . /app
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
ENV NEXTAUTH_URL="http://mock"
ENV NEXTAUTH_SECRET="MOCK"
RUN npx prisma generate
RUN npm run build
EXPOSE 3000

CMD /bin/sh -c 'npx prisma migrate deploy && npm run start'