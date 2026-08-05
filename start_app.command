#!/bin/bash
echo "Uruchamiam lokalny serwer testowy dla Uki's BodyBuild..."
cd "$(dirname "$0")"
python3 -m http.server 8080 &
sleep 1
open http://localhost:8080
echo "Serwer działa na http://localhost:8080"
echo "Aby zamknąć serwer, zamknij to okno terminala."
wait
