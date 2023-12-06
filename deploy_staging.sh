echo "Switching to development branch.."
git checkout development

echo "Pulling latest code"
git pull

echo "Building react app.."
npm run build:staging

echo "Deployment in progress.."
cp -a /apps/scala_tracker/productivity-tracker-frontend/build/. /var/www/157.245.98.234

echo "App deployed to 157.245.98.234"
