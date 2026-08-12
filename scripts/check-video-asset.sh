#!/bin/bash
cd /home/trumancreative/projects/portfolio-2026
TOKEN=$(grep SANITY_API_READ_TOKEN .env | cut -d= -f2)
curl -s "https://vs8d5hbw.api.sanity.io/v2025-01-01/data/query/production" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"*[_type == \"file\" && _id == \"file-970782ef2866c469b65df0b53939b6acda5b4f2c\"][0]{ _id, mimeType, extension, metadata }"}' | python3 -m json.tool
