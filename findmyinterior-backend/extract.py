import json
with open("routes_v1.json", encoding="utf-16") as f: routes = json.load(f)
target_prefixes = ["api/v1/user", "api/v1/profile", "api/v1/projects", "api/v1/requirements", "api/v1/listings", "api/v1/bookmarks", "api/v1/ventures", "api/v1/documents", "api/v1/messages", "api/v1/reviews", "api/v1/worker-jobs", "api/v1/rfqs"]
for r in routes:
  uri = r["uri"]
  if any(uri.startswith(p) for p in target_prefixes) and r["method"] != "GET|HEAD":
    print(f"{r['method']} /{uri} => {r['action']}")
