echo "restarting python server..."
git pull origin master

echo "restarting python backend..."
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl start app
sudo systemctl enable app
sudo systemctl restart app

# restart node backend
echo "restarting node backend..."
yarn install

cd frontend
yarn install
yarn build
cd ..

cd admin
yarn install
yarn build
cd ..

cd node_backend
yarn install
cd ..

yarn pm2 restart ecosystem.config.cjs --env production
yarn pm2 save

sudo nginx -t
sudo systemctl restart nginx
sudo systemctl restart ngrok

echo "done"