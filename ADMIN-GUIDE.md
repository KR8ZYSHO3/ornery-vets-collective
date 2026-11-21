# How to update the Ornery Vets app

You do not need to write code. Admins sign in with GitHub, make changes in a form, and save. Those changes are stored in this GitHub repository and then show up on the live site after a short rebuild (usually one or two minutes).

**Live site:** https://kr8zysho3.github.io/ornery-vets-collective/  
**Admin:** https://app.pagescms.org  
**Repository:** https://github.com/KR8ZYSHO3/ornery-vets-collective

Visitors to the public site cannot change anything. Only people with access to this GitHub repository can sign in and edit.

## First-time setup (do this once)

1. On your phone or computer, open https://app.pagescms.org
2. Choose **Sign in with GitHub**.
3. Use the **KR8ZYSHO3** GitHub account (or another account that has been added as a collaborator on this repository).
4. If GitHub asks you to install or authorize the **Pages CMS** app:
   - Choose **Only select repositories**.
   - Select **ornery-vets-collective**.
   - Click **Install** or **Authorize**.
5. Back in Pages CMS, open the **ornery-vets-collective** repository.

You should see **Events** and **Site settings**.

## Log in later

Open https://app.pagescms.org and sign in with the same GitHub account. Then open **ornery-vets-collective**.

This works on a phone. If a menu is tight, turn the phone sideways, or use “Request desktop site” in your browser.

## Add, edit, or delete an event

1. Open **Events**.
2. To add a gathering, add a new item in the Events list.
3. Fill in:
   - **Title** (required)
   - **When** — the wording people will see, such as `Fridays at 12:00 PM`
   - **Location** and, if you have one, a **Maps link**
   - **Description** — short and factual
   - For a repeating gathering, turn **Recurring** on so it does not disappear automatically
   - For a one-time event, add a **Start date** (and an **End date** if it lasts more than one day). Past one-time events are hidden on the site
4. To change an event, open it, edit the fields, and save.
5. To remove an event, delete that item from the list and save.
6. Wait for the live site to rebuild, then refresh https://kr8zysho3.github.io/ornery-vets-collective/#events

## Edit contact info, mission, volunteer, or donate details

1. Open **Site settings**.
2. You can update:
   - the official **Facebook page URL** (leave this blank until the real URL is confirmed)
   - **Mission** paragraphs on the Home screen
   - volunteer wording and a volunteer contact
   - donate wording and a donate link (only if the organization has an official one)
   - public email and phone
   - the gathering address and maps link
3. Save, wait a minute, and refresh the live site.

Do not invent founding dates, people’s names, programs, an EIN, or a payment link.

## Add another admin

1. On GitHub, open https://github.com/KR8ZYSHO3/ornery-vets-collective
2. Go to **Settings** → **Collaborators** (you may be asked to confirm your password).
3. Invite the person’s GitHub username.
4. They accept the invite, then sign in at https://app.pagescms.org with **their** GitHub account and open this repository.

Only add people you trust. They will be able to change the public site.

## Security tips

- Turn on two-factor authentication (2FA) on every admin’s GitHub account: https://github.com/settings/security
- Do not put passwords, API keys, or private personal numbers into this repository. The website is public.
- The live page has no login form and no hidden “admin” address that visitors can use to change data. Editing happens only through Pages CMS after a GitHub sign-in.
- If someone should no longer have access, remove them from the repository collaborators list.
- Review changes on the live site after you save, and in the repository’s commit history if something looks wrong.

## If a change does not show up

- Wait a couple of minutes and do a hard refresh.
- Confirm you clicked Save in Pages CMS.
- Check the **Actions** tab on the GitHub repository to see if the “Deploy GitHub Pages” run finished successfully.
