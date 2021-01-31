FROM node:14.15.4
RUN mkdir -p /usr/app/cloudhawk
WORKDIR /usr/app/cloudhawk
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3006
CMD ["npm", "run", "start"]