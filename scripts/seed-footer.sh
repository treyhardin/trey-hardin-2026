#!/bin/bash
cd /home/trumancreative/projects/portfolio-2026
TOKEN=$(grep SANITY_API_READ_TOKEN .env | cut -d= -f2)

# Patch draft
curl -s -X POST "https://vs8d5hbw.api.sanity.io/v2025-01-01/data/mutate/production" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "mutations": [
    {
      "patch": {
        "id": "drafts.footer",
        "set": {
          "_type": "footer",
          "links": [
            {"_type": "link", "text": "Email", "url": "mailto:hello@treyhardin.com"},
            {"_type": "link", "text": "LinkedIn", "url": "https://linkedin.com/in/treyhardin", "openInNewTab": true},
            {"_type": "link", "text": "Twitter", "url": "https://x.com/treyhardin", "openInNewTab": true}
          ],
          "copyright": "© Trey Hardin. All rights reserved."
        }
      }
    }
  ]
}' | python3 -m json.tool | head -20

echo "---"

# Publish
curl -s -X POST "https://vs8d5hbw.api.sanity.io/v2025-01-01/data/mutate/production" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "mutations": [
    {
      "createOrReplace": {
        "_id": "footer",
        "_type": "footer",
        "links": [
          {"_type": "link", "text": "Email", "url": "mailto:hello@treyhardin.com"},
          {"_type": "link", "text": "LinkedIn", "url": "https://linkedin.com/in/treyhardin", "openInNewTab": true},
          {"_type": "link", "text": "Twitter", "url": "https://x.com/treyhardin", "openInNewTab": true}
        ],
        "copyright": "© Trey Hardin. All rights reserved."
      }
    }
  ]
}' | python3 -m json.tool | head -20
