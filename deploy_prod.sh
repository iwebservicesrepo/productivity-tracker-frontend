echo "Switching to development branch.."
git checkout development

echo "Pulling latest code"
git pull

echo "Building react app.."
npm run build:prod

echo "Deployment in progress.."
cp -a /apps/scala_tracker/productivity-tracker-frontend/build/. /var/www/app.prodchimp.com

echo "App deployed to app.prodchimp.com"
