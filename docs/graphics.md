# Graphics Generation

This project generates an image for each scene so the web interface can display simple visuals alongside the text. Images are cached locally to avoid re-generating them.

## Pipeline
1. **Scene request** – When a new scene is loaded the server calls `ensureVisual()` in `src/server.js`.
2. **VisualCache** – `ensureVisual` uses `VisualCache.getVisual(key, generator)` to check if an image already exists in the `cache/` directory. If not, it calls the provided generator function.
3. **Prompt reduction** – Because the image API accepts only a short prompt, the server first summarizes the scene using the OpenAI **gpt-4.1-nano** model. The condensed description is then sent to the image generator.
4. **Generator** – If `VISUAL_API_KEY` is set, the server requests an image from the OpenAI image API using `model: dall-e-3` and `size: 1024x1024` (requires an OpenAI key with DALL‑E access). Otherwise it decodes `public/placeholder.png.base64` and writes the PNG to the cache. The future plan described in `docs/tasks/task6_2.md` allows swapping in different generators.
5. **Serving the file** – Once generated, the image is written to `cache/<key>.png` and served over `/visual/<key>.png` using Express static middleware.
6. **Client display** – The browser’s `index.html` sets the scene image element to this path so players see the visual alongside the narrative.
7. **Debug logs** – `ensureVisual` prints messages indicating whether a real API key was detected and where the generated file was saved. Review the server logs if images fail to appear.

`ensureVisual` combines the previous scene description, recent conversation log and the player's latest command to form the next image prompt. This helps each picture flow naturally from the last.

To customize visuals, implement the wrapper described in `docs/tasks/task6_2.md` so `ensureVisual` calls `generateSceneVisual`. This wrapper can use OpenAI images or other frameworks such as Stable Diffusion, Sora or Google VEO to produce still images or short animations.

## Cache Management
- Cached images persist between runs. Delete the `cache/` directory to regenerate visuals.
- The `VisualCache.clear()` method can be called for programmatic cache resets.

This design keeps the core system lightweight while allowing future integration with more sophisticated generative tools.

The web interface displays a short "Loading..." overlay while `ensureVisual()` is generating the next image to indicate progress.
