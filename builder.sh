build_archive (){
	echo "Building archive ..."

	ARCHIVE_NAME=${PWD##*/}""

	if [ ! -f ./$ARCHIVE_NAME.zip ];
	then
	    echo "File not found!"
	else
	echo "File exist. Removing"
	rm ./$ARCHIVE_NAME.zip
	fi

	zip -r ./$ARCHIVE_NAME.zip ./index.html ./game.js ./game.css ./branding ./media -x "*.zip*" -x "*.git*" -x "*.psd*" -x "*.xcf*" -x "*.aif*" -x "*.tiff*" -x "*.au*" -x "*.txt*" -x "*.bat*" -x "*.jar*" -x "*.py*" -x "*.sh*" -x "*.php*" -x "*.htaccess" -x "*.DS_Store"

	echo "Done"
}

# Build the game
sh push.sh -b

# Build game archive
build_archive
echo "Build Done..."
