BUILD_DIR=build


all: $(BUILD_DIR) $(BUILD_DIR)/index.html $(BUILD_DIR)/press.js $(BUILD_DIR)/words.txt $(BUILD_DIR)/index.html.gz $(BUILD_DIR)/press.js.gz $(BUILD_DIR)/words.txt.gz $(BUILD_DIR)/cache.manifest


$(BUILD_DIR):
	mkdir $@

$(BUILD_DIR)/%.manifest: %.manifest
	cp $< $@

$(BUILD_DIR)/%.html: %.html
	htmlcompressor --remove-intertag-spaces --compress-js  --compress-css  $<  > $@

$(BUILD_DIR)/%.js: %.js
	closure-compiler --compilation_level ADVANCED_OPTIMIZATIONS $< > $@


$(BUILD_DIR)/words.txt: words
	cat $< | ./train.py > $@


$(BUILD_DIR)/%.gz: $(BUILD_DIR)/%
	gzip -9c $< > $@

clean:
	rm -rf build
