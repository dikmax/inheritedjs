#!/bin/sh
java -jar compiler/compiler.jar --js src/inherited.js \
  --js_output_file inherited.min.js \
  --warning_level VERBOSE \
  --compilation_level ADVANCED_OPTIMIZATIONS
