# Ornery Vets Collective — home-screen web app

A lightweight Progressive Web App for Ornery Vets Collective, a veteran-run group in Athens County, Ohio. People can open it in a phone browser and **Add to Home Screen**. No app store listing is required.

**Live site:** https://kr8zysho3.github.io/ornery-vets-collective/  
**Admin (GitHub sign-in):** https://app.pagescms.org  

For day-to-day updates, see [ADMIN-GUIDE.md](ADMIN-GUIDE.md). You should not need to edit code.

## What visitors can do

- Read the mission and gathering details
- Get help (Veterans Crisis Line, VA, and local offices)
- Add the app to an iPhone or Android home screen (works offline for the main pages)

## How content is edited

Admins sign in to [Pages CMS](https://app.pagescms.org) with a GitHub account that has access to this repository. Saving writes to:

- `events.json` — gatherings
- `site.json` — mission, Facebook URL, volunteer/donate copy, and contact details

GitHub Pages then rebuilds the live site. The public website cannot change these files.

## Local preview

From this folder:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`. Add-to-home-screen and the service worker need a local or HTTPS origin (not a `file://` page).
