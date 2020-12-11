#!/usr/bin/env bash
latestYear=`ls | grep '20.*' | tail -n 1`
(cd $latestYear && echo $latestYear/$(ls -v | tail -n 1))