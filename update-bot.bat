@echo off
title Olympus Bot - Update & Start

cd /d "E:\Bot Olympus Discord"

echo ================================
echo       OLYMPUS DISCORD BOT
echo ================================
echo.

echo [1/3] Mengambil update dari GitHub...
git pull

echo.
echo [2/3] Memastikan dependencies...
npm install

echo.
echo [3/3] Menjalankan bot...
echo.

node index.js

echo.
echo Bot stopped.
pause