# HeadLight: Targeted Adaptation of World-Action Models via Interaction and Motion Heads

Project page for **HeadLight**: [paper (PDF)](HeadLight_arxiv.pdf).

Yuze Zhu, Jacky Li, Yusen Luo, Ken Jiankun Zheng, Chancharik Mitra, Trevor Darrell, Roei Herzig  
UC Berkeley · University of Toronto · USC · MIT

## Website

The page is a static site (`index.html` + `static/`) with no build step, served by GitHub Pages.

**Enable GitHub Pages:** repo **Settings → Pages → Build and deployment → Source: "Deploy from a branch"**, branch `main`, folder `/ (root)`. The site will be published at `https://<user>.github.io/<repo>/`.

**Preview locally:**

```bash
python -m http.server 8000
# then open http://localhost:8000
```

### Layout

```
index.html               page content
static/css/style.css     styles
static/js/main.js        charts, tabs, rollout browser (all numbers from the paper's tables)
static/images/figures/   figures cropped from the paper
static/images/rollouts/  real-robot keyframes (Fig. 15), one folder per task
.nojekyll                serve files as-is (skip Jekyll processing)
```

### To update

- **Code link:** search `index.html` for `TODO`. Replace `href="#"` with the URL and remove the `is-pending` class and the `<span class="soon">` badge.
- **Author homepages:** wrap each name in the `.authors` list with `<a href="...">`.
