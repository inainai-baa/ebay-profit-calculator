# Assets

## `photos/` — used by the live-aligned prototype
Clean images downloaded from the live Studio site (plus star-trail / night lodge).

| File | Used for |
| --- | --- |
| `01-hero-illustration.jpg` | Hero |
| `02-entrance-sign.jpg` | About |
| `04-facility-interior.jpg` | Facilities |
| `08-toys.jpg` | Service: toys |
| `09-campfire.jpg` | Service: BBQ/camp |
| `10-field-scarecrow.jpg` | Service: field |
| `11-lodge-exterior.jpg` | Philosophy |
| `14-star-trails.jpg` | Service: stars |
| `15-lodge-night.jpg` | Optional night stay |

## Replace with client photos
1. Drop new JPG/WebP files into `REPLACE_PHOTOS_HERE/` using the **same filenames** as in `photos/`.
2. Copy/overwrite into `photos/`.
3. Redeploy / push to `main` so GitHub Pages updates.
4. Keep images free of UI chrome; ~1200–1600px wide is enough.

Do not hotlink Studio CDN URLs in production — files here are already local for Pages.
