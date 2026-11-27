/* Bundles the multi-page site into dist/preview.html — one self-contained
   file with a hash router, for sharing as a single link.
   Run: node build.js                                                    */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PAGES = [
  'index', 'ai', 'markets', 'positions', 'history', 'copy', 'learn', 'responsible',
  'terms', 'privacy', 'risk', 'security', 'complaints',
  'account', 'chat',
  'login', 'signup', 'forgot-password', 'reset-password'
];

const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');

const css = read('assets/css/app.css');
const MODULES = ['config', 'countries', 'net', 'format', 'api', 'chart', 'modals', 'trade', 'positions', 'ai', 'tour', 'app'];
const js = MODULES.map(m => read(`assets/js/${m}.js`)).join(String.fromCharCode(10));

const pages = {};
for (const name of PAGES) {
  const src = read(name + '.html');
  const bodyTag = src.match(/<body([^>]*)>/i)[1];
  const attrs = {};
  bodyTag.replace(/(data-[\w-]+)="([^"]*)"/g, (_, k, v) => { attrs[k] = v; return ''; });

  const main = src.match(/<main>([\s\S]*?)<\/main>/i);
  const title = (src.match(/<title>([^<]*)<\/title>/i) || [, 'TradeSwif'])[1];

  // inline page-specific scripts (those without a src)
  const inline = [...src.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n');

  pages[name] = {
    attrs,
    title,
    html: main ? main[1] : '',
    script: inline.trim()
  };
}

/* The bundle is one file with no assets beside it, so the icon travels
   inside it as a data URI rather than as a link to something that will
   not be there. */
const favicon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAEGklEQVR4nO2W308cVRTH77k7P3Z2psNC6aZCoIbGNDFGBbEam4CpUNsHEQimaZs+2FjKNvqgsX8IBh4ktuFH+2Liq0krBvfBGHdLS0xsalJNWSgbWHaHHWBnZ+6de83+gC3sLiyJffO8zr2f77nn3O+5A7W1fvQiA79QOvpf4L/qAQAGqLQSADwIQaW9QjV0QtKIc1FSS78xlzr2uiipGGPO+YEFAMCxN442tCKA2OJ9wLlz5DmAOHMVX13Ty+8uLcxSYmFBQiUaewkAeBzbfPX18z3nbxHHfrYQzu4HyFMgl76mNzQ2v/bkceiHOwOuS7IZ7NTYWwAQ4m3vDImSSBy75ZXT2+ljT2GNS9HmRvr4ic7G5pN//3VX9vo5cqtqMgAQQih1H0bGnExGljXGEGeFM6yblplKm6blOBYAUMoq9VnYgx4IBBCqn4tMra48OqS/5LoMAASPZyUev3Zt8OKlixnLDP2mLC2D7K2YqFCJruv61c+uYIzHxm4+W5zDeC67WhBSqcyVTy/c+PIjStdUTXn4p7CwtKMmu2K3MgBwzl3X7frgtN/vZ4xxxEXR51X8qnY4lbKvB4M3b922LOZT60K//BqJPFBVmbPqBPJ023b6+j4+deo9wzDGxydjsZgoChjQyvJycOjqyMhwMhGvqamJRCIDn1xIJg1BwOUMUCKQd0qW3tvT2dGRSCQmJqfmo1FFUTDG8fhqcGhwdHTEMJK1tXXhSKS3t980Uz6fj1VOv9gDALBth3PW19fT2dmRWM3R56OqqgJAWfr6+oaiyJSSvfB5gXxXjx1rOnv2w+MtLclEcl+6aZqadmhjPbE1o/iWvyuUiFK3u6ur9c03jLW18Ymq6JZlNjS1Nza125kNAMBYLKtRKJEgeKanf0aI3/tp+unTeU3bk66qViZDCQFAoqxJIrYdaqYWsUcq1YDtN5lS6rqux+ORJKlyV01N0yzLCgQCADgafdLafrn15OUH4alHf3wvSSovubBFgdzkKdzUZNIIBgdHR8rTdV3/4vPrGONvx75bXPxHEERASJK1suO6eE3zn0kubnz91TfDw4ZhPE9XVZUQ8rwHEUKyXOP16pKsl6XvGBXZ8cuYLMt3bk92nzm3Go8drq8Ph4t0Sum2B7MumZiKxWKKojBW3ajAGG9ubr7d/lb3mXPxlaX6I4Hw7+HtyhBCynowf46qBBhjqqpG7s/eu/vjkcDRUCjU3z+Qzz2dThNCsh58f4uevce+fek7mlx4IB1HUZS2trbZ2VnLsnw+XyaTaW4ueNA0zfGJyTzddfen7x52nHNJkgghMzMzlFKv1+u6bjkPVksv8x5wzjHGuq6zXABAiQcPQN9dokpBix4Usw/EQWL//yKEkCiKkiRyjg5Kr1aAZ+Og5EL8C/Qwnl6JwWK+AAAAAElFTkSuQmCC';

const out = `<title>TradeSwif Terminal</title>
<link rel="icon" type="image/png" href="${favicon}">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,300..400,0..1,0&icon_names=account_circle,explore,finance_mode,smart_toy,stacks&display=block">
<style>
${css}
</style>

<div class="app" id="app"></div>

<script>window.NEXAS_BUNDLE = true; window.NEXAS_PAGES = ${JSON.stringify(pages)};</script>
<script>
${js}
</script>
<script>
(function () {
  var app = document.getElementById('app');

  function route() {
    var name = (location.hash || '#/index').replace('#/', '').split('?')[0] || 'index';
    var page = window.NEXAS_PAGES[name] || window.NEXAS_PAGES.index;

    document.body.className = '';
    Object.keys(page.attrs).forEach(function (k) { document.body.setAttribute(k, page.attrs[k]); });
    ['data-back', 'data-title'].forEach(function (k) {
      if (!page.attrs[k]) document.body.removeAttribute(k);
    });

    app.innerHTML = '<main>' + page.html + '</main>';
    window.NexBoot();
    if (page.script) { try { new Function(page.script)(); } catch (e) {} }
    window.scrollTo(0, 0);
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.indexOf('.html') === -1) return;
    e.preventDefault();
    location.hash = '#/' + href.replace('.html', '');
  });

  window.addEventListener('hashchange', route);
  route();
})();
</script>
`;

fs.mkdirSync(path.join(ROOT, 'dist'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'dist', 'preview.html'), out);
console.log('dist/preview.html  ' + (out.length / 1024).toFixed(0) + ' KB  ·  ' + PAGES.length + ' pages');
