docker build -t matchstick .

docker run -it --rm --mount type=bind,source=$(pwd),target=/matchstick matchstick

