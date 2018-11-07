#!/bin/sh
npm run build
rm -rf ../../build
cp -r build ../../