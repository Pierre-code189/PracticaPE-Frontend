#!/usr/bin/env python3
"""Convierte los HTML de Stitch en fragmentos para el SPA de Practicape.

- Extrae el <body>, quita <header>/<footer> y los <script> inline.
- Añade ganchos data-field / data-job para hidratar con la API real.
- Guarda en frontend/static/pages/<slug>.html con data-page en un wrapper.
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, ".stitch", "designs")
OUT = os.path.join(ROOT, "frontend", "static", "pages")

SLUGS = [
    "home", "ofertas", "oferta-detalle", "auth", "perfil-candidato",
    "panel-empresa", "panel-admin", "empresas", "mapa",
    "home-mobile", "ofertas-mobile",
]


def body_inner(html):
    m = re.search(r"<body\b[^>]*>(.*)</body>", html, re.S)
    return m.group(1) if m else html


def strip_scripts(html):
    return re.sub(r"<script\b[^>]*>.*?</script>", "", html, flags=re.S | re.I)


def strip_chrome(html):
    html = re.sub(r"<header\b.*?</header>", "", html, flags=re.S | re.I)
    html = re.sub(r"<footer\b.*?</footer>", "", html, flags=re.S | re.I)
    return html


def strip_inline_handlers(html):
    html = re.sub(r'\sonsubmit="[^"]*"', "", html, flags=re.I)
    html = re.sub(r'\sonclick="[^"]*"', "", html, flags=re.I)
    return html


def add_attr(html, tag_open, attr, count=1):
    """Añade attr dentro de la etiqueta cuyo opening tag coincide con tag_open."""
    idx = 0
    done = 0
    while done < count:
        i = html.find(tag_open, idx)
        if i == -1:
            break
        if tag_open.endswith("/>"):
            head, tail = tag_open[:-2], "/>"
        else:
            head, tail = tag_open[:-1], ">"
        html = html[:i] + head + " " + attr + tail + html[i + len(tag_open):]
        idx = i + len(head) + len(attr) + len(tail) + 1
        done += 1
    if done < count:
        print(f"  !! attr {attr}: solo {done}/{count}")
    return html


def hook_text(html, text, attr):
    """Envuelve el texto exacto (conwhitespace tolerante) en un <span data-...>."""
    pat = re.compile(r">(\s*)" + re.escape(text) + r"(\s*)<")
    m = pat.search(html)
    if not m:
        print(f"  !! texto no encontrado: {text!r}")
        return html
    return html[:m.start()] + '><span ' + attr + ">" + text + "</span><" + html[m.end():]


def prep_home(h):
    h = add_attr(h, '<article class="bg-surface rounded-[16px] p-space-lg shadow-[0_1px_3px_rgba(20,32,27,0.05),0_8px_20px_rgba(20,32,27,0.03)] hover:shadow-[0_8px_28px_rgba(0,97,79,0.12)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">', 'data-job="template"')
    h = add_attr(h, '<span class="inline-flex items-center px-3 py-1 rounded-full font-body-s text-body-s bg-primary-container text-primary font-medium">', 'data-job="modality"')
    h = hook_text(h, "Hace 2 horas", 'data-job="time"')
    h = add_attr(h, '<h3 class="font-headline-s text-headline-s text-ink-primary mb-1">', 'data-job="title"')
    h = add_attr(h, '<p class="font-body-m text-body-m text-ink-secondary mb-space-md">', 'data-job="company"')
    h = hook_text(h, "Distrito Piura", 'data-job="district"')
    h = hook_text(h, "20h semanales", 'data-job="hours"')
    h = add_attr(h, '<span class="font-headline-s text-headline-s text-secondary bg-accent-container px-2.5 py-1 rounded-[8px] tabular-nums inline-block">', 'data-job="salary"')
    h = add_attr(h, '<button class="inline-flex items-center justify-center px-space-md py-2.5 rounded-[12px] bg-primary text-on-primary font-body-m text-body-m font-semibold hover:bg-primary-deep transition-all active:scale-95 shadow-sm" type="button">', 'data-job="link"')
    h = add_attr(h, '<button class="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-xl py-3 rounded-full bg-primary text-on-primary font-headline-s text-body-m hover:bg-primary-deep shadow-sm hover:shadow transition-all active:scale-[0.98]" type="button">', 'id="home-search-btn"')
    return h


def prep_ofertas(h):
    h = add_attr(h, '<article class="bg-surface rounded-2xl p-space-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group">', 'data-job="template"')
    h = add_attr(h, '<div class="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary font-headline-s font-bold shadow-inner">', 'data-job="logo"')
    h = add_attr(h, '<span class="font-body-s text-body-s font-semibold text-ink-primary">', 'data-job="company"')
    h = add_attr(h, '<span class="material-symbols-outlined text-primary text-[16px]" style="font-variation-settings: \'FILL\' 1;" title="Empresa verificada">', 'data-job="verified"')
    h = hook_text(h, "Distrito Piura Centro", 'data-job="district"')
    h = add_attr(h, '<span class="inline-flex items-center px-2.5 py-1 rounded-full bg-primary-container text-primary font-body-s text-body-s font-semibold">', 'data-job="modality"')
    h = add_attr(h, '<h2 class="font-headline-s text-headline-s text-ink-primary group-hover:text-primary transition-colors tracking-tight mb-space-sm">', 'data-job="title"')
    h = add_attr(h, '<div class="space-y-space-xs mb-space-md">', 'data-job="meta"')
    h = add_attr(h, '<span class="px-2.5 py-1 rounded-full bg-accent-container text-secondary font-headline-s text-headline-s tabular-nums font-bold">', 'data-job="salary"')
    h = hook_text(h, "Hace 2 horas", 'data-job="time"')
    h = add_attr(h, '<a class="px-space-md py-2 rounded-xl bg-surface hover:bg-surface-elevated text-ink-primary font-body-m text-body-m font-semibold shadow-sm hover:shadow transition-all inline-flex items-center gap-1" href="#">', 'data-job="link"')
    return h


def prep_detalle(h):
    h = add_attr(h, '<div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary text-on-primary font-headline-m text-headline-m flex items-center justify-center tracking-tight shadow-sm font-extrabold select-none">', 'data-field="logo"')
    h = add_attr(h, '<span class="font-headline-s text-headline-s text-ink-primary font-bold">', 'data-field="company"')
    h = add_attr(h, '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label text-label" title="Empresa verificada por SUNAT y UDEP/UNP">', 'data-field="verified"')
    h = add_attr(h, '<span class="font-body-s text-body-s text-ink-secondary">', 'data-field="sector"')
    h = hook_text(h, "Publicado hace 2 horas", 'data-field="time"')
    h = add_attr(h, '<h1 class="font-headline-l text-headline-l text-ink-primary font-extrabold tracking-tight max-w-4xl">', 'data-field="title"')
    h = add_attr(h, '<p class="font-body-m text-body-m text-ink-secondary max-w-3xl">', 'data-field="intro"')
    h = add_attr(h, '<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-ink-primary font-body-s text-body-s font-medium">', 'data-field="chip-1"')
    h = add_attr(h, '<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-ink-primary font-body-s text-body-s font-medium">', 'data-field="chip-2"')
    h = add_attr(h, '<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-ink-primary font-body-s text-body-s font-medium">', 'data-field="chip-3"')
    h = add_attr(h, '<span class="tabular-nums">', 'data-field="salary"')
    h = add_attr(h, '<span class="text-body-s font-body-s font-normal text-secondary opacity-90">', 'data-field="salary-note"')
    for n in (1, 2, 3, 4):
        h = add_attr(h, '<div class="font-headline-s text-body-m font-bold text-ink-primary mt-0.5">', f'data-field="fact-{n}"', count=1)
    h = add_attr(h, '<main class="lg:col-span-8 flex flex-col gap-space-2xl max-w-[720px]">', 'data-field="main"')
    h = add_attr(h, '<div class="w-12 h-12 rounded-xl bg-primary text-on-primary font-headline-s text-body-l flex items-center justify-center font-bold">', 'data-field="side-logo"')
    h = add_attr(h, '<h3 class="font-headline-s text-body-m font-bold text-ink-primary leading-tight">', 'data-field="side-company"')
    h = h.replace('<span class="font-body-s text-body-s text-ink-secondary">RUC: 20601894231 (Habido)</span>',
                  '<span class="font-body-s text-body-s text-ink-secondary" data-field="side-ruc">RUC: 20601894231 (Habido)</span>')
    h = h.replace('<span class="font-medium text-ink-primary">Agroindustria exportadora</span>',
                  '<span class="font-medium text-ink-primary" data-field="side-sector">Agroindustria exportadora</span>')
    h = h.replace('<span class="font-medium text-ink-primary">250 - 500 colaboradores</span>',
                  '<span class="font-medium text-ink-primary" data-field="side-size">250 - 500 colaboradores</span>')
    h = h.replace('<span class="font-medium text-ink-primary">Veintiséis de Octubre, Piura</span>',
                  '<span class="font-medium text-ink-primary" data-field="side-address">Veintiséis de Octubre, Piura</span>')
    h = h.replace('<strong>Practicante Preprofesional de Marketing Digital</strong>',
                  '<strong data-field="modal-text">Practicante Preprofesional de Marketing Digital</strong>')
    h = add_attr(h, '<p class="font-body-s text-body-s text-ink-secondary pt-space-xs leading-relaxed">', 'data-field="side-desc"')
    h = hook_text(h, "9 postulantes activos", 'data-field="applicants"')
    return h


def prep_auth(h):
    # botones de rol: marcar estado inicial
    h = h.replace('<button type="button" id="roleApplicantBtn"',
                  '<button type="button" id="roleApplicantBtn" data-role-selected="true"', 1)
    return h


def prep_home_mobile(h):
    h = add_attr(h, '<article class="bg-brand-surface dark:bg-brand-darkSurface p-4 rounded-2xl border border-brand-border dark:border-brand-darkBorder shadow-card">', 'data-job="template"')
    h = add_attr(h, '<span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-brand-emerald dark:text-emerald-400 border border-emerald-200/50">', 'data-job="modality"')
    h = hook_text(h, "Hace 2 horas", 'data-job="time"')
    h = add_attr(h, '<h3 class="text-base font-bold text-slate-900 dark:text-white font-heading">', 'data-job="title"')
    h = add_attr(h, '<p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">', 'data-job="company"')
    h = hook_text(h, "Distrito Piura", 'data-job="district"')
    h = hook_text(h, "20h semanales", 'data-job="hours"')
    h = add_attr(h, '<span class="text-base font-extrabold text-amber-700 dark:text-amber-400">', 'data-job="salary"')
    h = add_attr(h, '<button class="px-4 py-2 bg-brand-emerald text-white text-xs font-semibold rounded-xl hover:bg-brand-emeraldDark transition-colors">', 'data-job="link"')
    return h


def prep_ofertas_mobile(h):
    h = add_attr(h, '<article class="bg-surface rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">', 'data-job="template"')
    h = add_attr(h, '<div class="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary font-headline-s font-bold shadow-inner text-[16px]">', 'data-job="logo"')
    h = add_attr(h, '<span class="font-body-s text-body-s font-semibold text-ink-primary">', 'data-job="company"')
    h = add_attr(h, '<span class="material-symbols-outlined text-primary text-[15px]" style="font-variation-settings: \'FILL\' 1;" title="Empresa verificada">', 'data-job="verified"')
    h = hook_text(h, "Piura Centro", 'data-job="district"')
    h = add_attr(h, '<span class="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-container text-primary font-body-s text-[11px] font-semibold shrink-0">', 'data-job="modality"')
    h = add_attr(h, '<h2 class="font-headline-s text-[17px] text-ink-primary group-hover:text-primary transition-colors tracking-tight font-bold mb-2">', 'data-job="title"')
    h = add_attr(h, '<div class="space-y-1.5 mb-3 text-body-s text-[13px] text-on-surface-variant">', 'data-job="meta"')
    h = add_attr(h, '<span class="px-2 py-0.5 rounded-full bg-accent-container text-secondary font-headline-s text-[15px] tabular-nums font-bold">', 'data-job="salary"')
    h = hook_text(h, "2h", 'data-job="time"')
    h = add_attr(h, '<a class="px-3 py-1.5 rounded-xl bg-primary text-on-primary font-body-s text-[13px] font-semibold shadow-sm hover:bg-primary-deep transition-all inline-flex items-center gap-1 active:scale-[0.97]" href="#">', 'data-job="link"')
    return h


PREP = {
    "home": prep_home,
    "home-mobile": prep_home_mobile,
    "ofertas": prep_ofertas,
    "ofertas-mobile": prep_ofertas_mobile,
    "oferta-detalle": prep_detalle,
    "auth": prep_auth,
}


def main():
    os.makedirs(OUT, exist_ok=True)
    for slug in SLUGS:
        src = os.path.join(SRC, slug + ".html")
        if not os.path.exists(src):
            print(f"falta {src}")
            continue
        html = open(src, encoding="utf-8").read()
        frag = body_inner(html)
        frag = strip_chrome(frag)
        frag = strip_scripts(frag)
        frag = strip_inline_handlers(frag)
        if slug in PREP:
            frag = PREP[slug](frag)
        frag = frag.replace('href="#"', 'href="#/"')
        frag = '<div class="pp-screen" data-page="%s">\n%s\n</div>\n' % (slug, frag.strip())
        open(os.path.join(OUT, slug + ".html"), "w", encoding="utf-8").write(frag)
        print(f"{slug}: {len(frag)} chars")
    print("OK")


if __name__ == "__main__":
    main()
