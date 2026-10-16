# Use the :json adapter so that every collection response carries a root key
# and a `meta` block. The default :attributes adapter renders a bare array and
# silently discards the `meta:` passed to `render`, which meant the pagination
# metadata never reached the client.
#
#   { "posts": [ ... ], "meta": { "current_page": 1, "total_pages": 3, ... } }
ActiveModelSerializers.config.adapter = :json
