#!/bin/bash

TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxZWM3YTI0Ny0wZTQ1LTQzNmYtOGU0Mi1kOTZlNWU2YTViN2MiLCJlbWFpbCI6InVzZXJAZGVtb2NvbXBhbnkuY29tIiwidXNlclR5cGUiOiJjb21wYW55X3VzZXIiLCJyb2xlIjoiYWRtaW4iLCJjb21wYW55SWQiOiJiOTQwOGY1MC0xOTZmLTQyMjAtYWYyNi00OTU3NmYyNTVkMzYiLCJjb21wYW55U3RhdHVzIjoiYXBwcm92ZWQiLCJpYXQiOjE3NjI2MjY4NjYsImV4cCI6MTc2MzIzMTY2Nn0._JCQ1xHN6ZZEMIaVSY8HtY1GhvraQDeNd3nwZDh_yXU"

echo "Testing Customers API..."
echo "GET /api/customers"
curl -s -X GET http://localhost:5002/api/customers \
  -H "Authorization: Bearer $TOKEN" | jq .

echo ""
echo "Testing Products API..."
echo "GET /api/products"
curl -s -X GET http://localhost:5002/api/products \
  -H "Authorization: Bearer $TOKEN" | jq .
