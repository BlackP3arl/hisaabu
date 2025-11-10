#!/bin/bash

# Admin token
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4OTcxZjk1Ny01YzNmLTRkYjItOTVlNS03OGM3NDBkYjZiMTYiLCJlbWFpbCI6ImFkbWluQHRlY2h2ZXJpbi5jb20iLCJ1c2VyVHlwZSI6InBsYXRmb3JtX2FkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzYyNjI2ODY2LCJleHAiOjE3NjMyMzE2NjZ9.7C0dn_tAKdq1rHyEZjGhRCKNBGvJ5ELJTwCDN7x5Hhg"

echo "Getting all companies..."
curl -s -X GET "http://localhost:5002/api/admin/companies" \
  -H "Authorization: Bearer $TOKEN" | jq .

echo ""
echo "Updating company status..."
curl -s -X PUT "http://localhost:5002/api/admin/companies/b9408f50-196f-4220-af26-49576f255d36/status" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"suspended"}' | jq .

echo ""
echo "Updating company plan..."
curl -s -X PUT "http://localhost:5002/api/admin/companies/b9408f50-196f-4220-af26-49576f255d36/plan" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"plan":"pro"}' | jq .
