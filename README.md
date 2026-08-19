# Nexora Creator Suite

Build a complete, polished web application called Nexora.

Nexora is an all-in-one Minecraft creation studio containing:

Skin Editor

Texture Pack Maker

Command Generator

Banner Creator

Build Planner

Pixel Art Maker

The website should feel like a professional Minecraft creator platform, not a basic demo.

BRANDING

The website name is:

Nexora

Use Nexora throughout the UI, page titles, navigation, and branding.

Create a modern logo/wordmark for Nexora using the site's visual style.

Do not call the website "Minecraft Studio" anywhere as the main brand.

DESIGN

Create a polished modern interface with:

Dark mode

Light mode

Responsive layout

Sidebar navigation

Top navigation bar

Modern cards

Smooth animations

Hover effects

Toast notifications

Clean typography

Minecraft-inspired visual elements

Professional dashboard

Mobile-friendly design

Add a clear Light / Dark mode toggle.

Remember the user's selected theme and restore it when they return.

Do not directly copy Minecraft's official UI.

ACCOUNTS

Use Clerk for authentication and accounts.

Use this Clerk publishable key through an environment variable:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

The provided publishable key is:

pk_test_Z29vZC1waG9lbml4LTM2NDcuY2xlcmsuYWNjb3VudHMuZGV2J

Do NOT hard-code sensitive credentials into source files.

Use Clerk for:

Sign up

Sign in

Sign out

User profile

Account management

User avatar

Protected user features

If Clerk requires a secret/server key, use an environment variable such as:

CLERK_SECRET_KEY

Never expose the secret key in client-side code.

USER DASHBOARD

After signing in, users should have a personal dashboard.

Display:

Welcome message

Recently edited projects

Saved creations

Favorite tools

Recently used tools

Account information

Quick-create buttons

Example:

Welcome back, Youssef

Then show cards such as:

Continue Editing

New Skin

New Texture Pack

New Banner

New Build

New Pixel Art

New Command

SAVED CREATIONS

Users must be able to save their creations and access them later.

Create a My Creations section.

Users should be able to:

Save projects

Rename projects

Delete projects

Duplicate projects

Open projects

Continue editing

Download projects

Sort projects

Search projects

Filter by project type

See last modified date

Project types should include:

Skin

Texture Pack

Command

Banner

Build

Pixel Art

For signed-in users, store their projects in persistent user storage/database so their creations remain available across devices.

Do not rely only on localStorage for authenticated users.

For users who are not signed in, localStorage/IndexedDB can be used for temporary local projects.

PROJECT SYSTEM

Create a reusable project system throughout the application.

Every creation should have:

Project ID

Project name

Project type

Creation date

Last modified date

Preview/thumbnail

Project data

Owner/user ID

Create a clean project-management interface.

1. SKIN EDITOR

Build a functional Minecraft skin editor.

Features:

Import skin PNG

2D pixel editor

3D character preview

Steve model

Alex model

Body-part selection

Pencil

Eraser

Fill

Eyedropper

Color picker

Undo

Redo

Zoom

Grid toggle

Layer support

Reset

Export PNG

Save project

Changes should immediately appear in the preview.

2. TEXTURE PACK MAKER

Create a functional texture-pack creator.

Features:

New texture pack

Pack name

Description

Pack icon

Minecraft version selector

Block textures

Item textures

GUI textures

Entity textures

Texture search

Import PNG

Replace texture

Preview texture

Reset texture

Save project

Export .zip

Use a browser-compatible ZIP library such as JSZip.

The export should happen locally in the browser whenever possible.

3. COMMAND GENERATOR

Create a powerful visual Minecraft command generator.

Support commands such as:

/give

/summon

/tp

/effect

/enchant

/attribute

/fill

/setblock

/clone

/execute

/particle

/playsound

/title

/tellraw

Users should generate commands through forms rather than manually constructing complicated syntax.

Include:

Minecraft version selector

Command categories

Search

Copy button

Clear button

Command history

Syntax highlighting

Validation

Error messages

Save command as a project

Do NOT use an AI API for this.

Build the command generation logic directly into the application.

4. BANNER CREATOR

Create a functional Minecraft banner designer.

Features:

Banner base color

Pattern selector

Pattern colors

Multiple layers

Layer ordering

Remove pattern

Undo

Redo

Live preview

Generate /give command

Copy command

Export design

Save project

5. BUILD PLANNER

Create a Minecraft build-planning tool.

Features:

2D grid

Adjustable grid size

Block palette

Block search

Paint tool

Eraser

Fill

Layers

Zoom

Undo

Redo

Save project

Automatically calculate required materials.

Example:

Oak Planks × 384
Stone × 217
Glass × 64

Include:

Material list

Total blocks

Search materials

Copy material list

Export project

Add a basic 3D preview if practical.

6. PIXEL ART MAKER

Create a functional pixel-art editor.

Features:

Custom canvas size

Minecraft-inspired palette

Pencil

Eraser

Fill

Eyedropper

Line

Rectangle

Undo

Redo

Grid

Zoom

Import image

Pixelate image

Export PNG

Save project

NEXORA PROJECTS

Create a dedicated section called:

Nexora Projects

This section displays other projects created by Nexora.

IMPORTANT:

Create a dedicated file or data structure in the codebase called something like:

nexora-projects

or

nexoraProjects

Make it extremely easy to add new project links.

For example, use a simple configuration file where I can add:

Project name

Description

URL

Icon/image if available

Do NOT hard-code the projects throughout different React components.

The website should automatically display every project added to this configuration.

The FIRST project must be:

Nexora AI

URL:

https://ai.nexoras.workers.dev/

Display it in the Nexora Projects section with:

Nexora AI

Description

Open Project button

External-link icon

The Open Project button should open:

https://ai.nexoras.workers.dev/

in a new tab.

Make the configuration easy to expand later.

For example, I should be able to add another project to the projects file and have it automatically appear on the website.

EXPLORE / OTHER PROJECTS

Add an Explore or Other Projects section to the main dashboard.

Show:

Check out other Nexora projects

Then display the Nexora Projects cards.

The first card should always be Nexora AI.

Make the section visually appealing and make it obvious that these are other Nexora projects.

SETTINGS

Create a Settings page containing:

Appearance

Light mode

Dark mode

System theme

Account

Profile

Account settings

Sign out

Preferences

Default Minecraft version

Editor preferences

Grid preferences

Autosave

AUTOSAVE

Add automatic project saving.

When a user is editing a project:

Automatically save changes

Show "Saved" / "Saving..." status

Prevent accidental loss of work

Restore the latest version when reopening the project

SEARCH

Add global search functionality.

Users should be able to search:

Their creations

Tools

Nexora Projects

Example:

Search "banner"

Results:

Banner Creator

My banner projects

RECENT PROJECTS

The dashboard should display the user's recently opened projects.

Show:

Thumbnail

Project name

Type

Last modified

Open button

FAVORITES

Allow users to favorite tools/projects.

Create a favorites section on the dashboard.

TECHNICAL REQUIREMENTS

Use a modern web stack, preferably:

Next.js

React

TypeScript

Tailwind CSS

Use appropriate browser APIs such as:

Canvas

IndexedDB

LocalStorage

Use Clerk for authentication.

Use a proper persistent database/storage solution for authenticated user creations.

Do not require paid AI APIs.

Do not use OpenAI.

Do not use Gemini.

Do not use an AI API for any core feature.

The core functionality must work without AI.

ENVIRONMENT VARIABLES

Use environment variables for credentials.

At minimum:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

and, where required by Clerk/server-side authentication:

CLERK_SECRET_KEY

Never expose server-side secrets in client-side JavaScript.

PERFORMANCE

Make the application fast.

Lazy-load large editors

Avoid unnecessary re-renders

Optimize canvas rendering

Compress generated previews when appropriate

Keep the dashboard responsive

Avoid loading every editor at startup

IMPORTANT

Do not create fake functionality.

Do not make buttons that do nothing.

Do not use placeholder text where a real feature can be implemented.

Every major tool should actually work.

Build the project as a real usable application.

Start with the main Nexora dashboard, authentication, theme system, project system, and Nexora Projects system, then implement all six creation tools.

Make the final result feel like a real product that could be publicly launched as Nexora.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ecdb0cb3-a8b5-4065-bf0d-9cfa271ed216).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
