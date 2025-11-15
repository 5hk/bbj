# Images Directory

This directory contains all static images used in the website.

## Folder Structure

- `artists/` - Artist profile images
  - Example: `gaho-1.png`, `gaho-2.png`, `gaho-3.png`
  
- `releases/` - Album/single/EP cover images
  - Example: `album-cover-1.jpg`, `single-cover-1.jpg`
  
- `about/` - About section images
  - Example: `label-identity.jpg`

## Usage

Images in the `public` folder are served from the root path `/`.

For example:
- `public/images/artists/gaho-1.png` → `/images/artists/gaho-1.png`
- `public/images/releases/album-1.jpg` → `/images/releases/album-1.jpg`

## Image Guidelines

- Use optimized image formats (WebP, AVIF when possible)
- Keep file sizes reasonable for web performance
- Recommended dimensions:
  - Artist images: 800x800px or larger (will be cropped to fit)
  - Release covers: 1000x1000px (square format)
  - About images: 1200x600px or larger

