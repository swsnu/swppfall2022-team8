#!/bin/bash

cd backend
sudo docker build -t backend .
cd ../frontend
sudo docker build -t frontend .
cd ..