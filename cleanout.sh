mv ./umd/main.*.css ./umd/Fireworksify.css
mv ./umd/main.*.css.map ./umd/Fireworksify.css.map
rm -rf ./umd/main**
mv ./umd/** ./dist
rm -rf umd

cp ./dist/Fireworksify.d.ts ./example/dist/Fireworksify.d.ts
cp ./dist/Fireworksify.js ./example/dist/Fireworksify.js
cp ./dist/Fireworksify.js.map ./example/dist/Fireworksify.js.map
cp ./dist/Fireworksify.css ./example/dist/Fireworksify.css
cp ./dist/Fireworksify.css.map ./example/dist/Fireworksify.css.map