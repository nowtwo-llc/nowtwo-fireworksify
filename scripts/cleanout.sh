mv ./umd/main.*.css ./umd/fireworksify.css
mv ./umd/main.*.css.map ./umd/fireworksify.css.map
rm -rf ./umd/main**

mkdir -p ./dist
mv ./umd/** ./dist

rm -rf umd