#!/bin/bash
rm -rf tsconfig.tsbuildinfo
yarn format
yarn typecheck
yarn lint