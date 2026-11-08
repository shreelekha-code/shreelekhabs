# Shreelekha Basavaraja Sangapur: personal website

Live address (after setup): https://shreelekhabs.pages.dev
Content editor: https://shreelekhabs.pages.dev/admin

## What’s inside

| Folder or file | What it is |
|---|---|
| `content/` | All the words, photos, trips and itineraries. You edit these through the editor, never by hand. |
| `images/uploads/` | Photos you upload in the editor land here. |
| `index.html`, `mind/`, `movement/`, `bahja/`, `travel/`, `trip/`, `post/` | The pages. |
| `assets/` | The design (`site.css`) and the interactive parts (`site.js`). |
| `admin/` | The content editor. |
| `functions/` | The small piece that lets you sign in to the editor with GitHub. |

## One-time setup

1. **Put the files on GitHub.** Create a new repository called `shreelekhabs` (Public). On the empty repository page, click “uploading an existing file” and drag in everything inside this folder (the files and folders themselves, so `index.html` sits at the top level). Click “Commit changes”.
2. **Tell the editor where your files are.** In GitHub, open `admin/config.yml`, click the pencil icon, replace `YOUR-GITHUB-USERNAME` with your GitHub username, and commit.
3. **Publish with Cloudflare.** In Cloudflare, go to Workers & Pages, choose Create, pick the **Pages** option (not Workers), and import your GitHub repository. Name the project `shreelekhabs`. Framework preset: None. Build command: leave empty. Build output directory: `/`. Click Save and Deploy. If the name was taken and you got a different address, update the three addresses in `admin/config.yml`.
4. **Create the editor sign-in on GitHub.** GitHub, Settings, Developer settings, OAuth Apps, New OAuth App.
   - Application name: `Shreelekha site editor`
   - Homepage URL: `https://shreelekhabs.pages.dev`
   - Authorization callback URL: `https://shreelekhabs.pages.dev/api/callback`
   Register it, then click “Generate a new client secret”. Keep this page open.
5. **Give Cloudflare the two codes.** In your Cloudflare Pages project, Settings, Variables and Secrets, add:
   - `GITHUB_CLIENT_ID` = the Client ID from step 4
   - `GITHUB_CLIENT_SECRET` = the client secret from step 4 (choose the Secret/encrypt option)
   Then go to Deployments and retry the latest deployment so the codes take effect.
6. **Sign in.** Open https://shreelekhabs.pages.dev/admin and click “Login with GitHub”.

## Everyday editing

Open `/admin`, change anything, and click **Publish**. The live site updates within a minute or two.

- **Rename a section:** Home and site settings, Section names.
- **Add a blog post, project, video or certificate:** Pages, Academic page, Library, Add. Give it a short id with dashes (like `my-first-post`). Writing in “Full text” gives it its own page. Paste a YouTube link to show a video.
- **Add a trip to the map:** Pages, Travel map and itineraries, Add.
  - For a single place, type its latitude and longitude. In Google Maps, right-click the spot: the first number is latitude, the second is longitude.
  - For a road trip, choose “Road trip” and add the stops in order, each with its own latitude and longitude.
  - Tick “Has its own itinerary page” and fill in the day-by-day plan to create a full itinerary page. Its address is `/trip/?id=` plus the short id, which is handy for Instagram.
- **Photos:** export at about 2400px on the long edge, JPEG quality 80 to 85. Any spot without a photo shows a cartoon placeholder, which you can choose.
- **Story dots on the featured photo:** set “Across” and “Down” in percent (0 is the left or top edge, 100 the right or bottom).

## Design changes

Layout and design live in `assets/site.css` and `assets/site.js`. To change them, describe what you want to Claude and upload the new file in GitHub the same way (Add file, Upload files). Your content is untouched by design changes.
