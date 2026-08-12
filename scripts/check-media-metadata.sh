#!/bin/bash
cd /home/trumancreative/projects/portfolio-2026
TOKEN=$(grep SANITY_API_READ_TOKEN .env | cut -d= -f2)
curl -s "https://vs8d5hbw.api.sanity.io/v2025-01-01/data/query/production" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"*[_type == \"homepage\"][0]{ heroMedia{ video{ asset->{ metadata } }, image{ image{ metadata } } } }"}' | python3 -m json.tool
