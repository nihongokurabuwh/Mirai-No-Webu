#!/usr/bin/env python3
"""
apply_universal_zebra.py
Menerapkan sistem Universal Zebra Theme (PUTIH -> HITAM -> PUTIH -> HITAM)
pada seluruh halaman HTML di MIRAI NO WEBU dan memperbarui footer GitHub links.
"""

import os
import re

PAGE_SECTION_THEMES = {
    "tentang/index.html": [
        ("about-intro-section", "light"),
        ("about-flag-section", "dark"),
        ("about-filosofi-section", "light"),
        ("logo-meaning-section", "dark"),
        ("slogan-section", "light"),
        ("vision-mission-section", "dark"),
        ("timeline-section", "light"),
        ("sora-profile-section", "dark"),
        ("wall-of-fame-section", "light"),
        ("haori-section", "dark"),
        ("accessories-section", "light"),
        ("management-section", "dark"),
        ("feedback-preview", "light"),
    ],
    "kegiatan/index.html": [
        ("division-section", "light"),
        ("program-section", "dark"),
        ("facility-section", "light"),
        ("documentation-section", "dark"),
    ],
    "kegiatan/kimi-to-nippon.html": [
        ("proker-section", "light"), # sec 1
        ("proker-section", "dark"),  # sec 2
        ("proker-section", "light"), # sec 3
        ("documentation-section", "dark"), # sec 4
    ],
    "kegiatan/konbini.html": [
        ("proker-section", "light"),
        ("proker-section", "dark"),
        ("proker-section", "light"),
        ("documentation-section", "dark"),
    ],
    "kegiatan/nihon-go-rajio.html": [
        ("proker-section", "light"),
        ("proker-section", "dark"),
        ("proker-section", "light"),
        ("proker-section", "dark"),
        ("proker-section", "light"),
        ("documentation-section", "dark"),
    ],
    "kegiatan/ramadhan.html": [
        ("proker-section", "light"),
        ("proker-section", "dark"),
        ("proker-section", "light"),
        ("documentation-section", "dark"),
    ],
    "kegiatan/tomodachi.html": [
        ("proker-section", "light"),
        ("proker-section", "dark"),
        ("proker-section", "light"),
        ("documentation-section", "dark"),
    ],
    "divisi/index.html": [
        ("division-section", "light"),
        ("division-quiz-section", "dark"),
    ],
    "divisi/bahasa.html": [
        ("proker-section", "light"),
        ("proker-section", "dark"),
        ("proker-section", "light"),
        ("proker-section", "dark"),
    ],
    "divisi/cosplay.html": [
        ("proker-section", "light"),
        ("proker-section", "dark"),
        ("proker-section", "light"),
        ("proker-section", "dark"),
    ],
    "divisi/desain.html": [
        ("proker-section", "light"),
        ("proker-section", "dark"),
        ("proker-section", "light"),
        ("proker-section", "dark"),
    ],
    "divisi/kewirausahaan.html": [
        ("proker-section", "light"),
        ("proker-section", "dark"),
        ("proker-section", "light"),
        ("proker-section", "dark"),
    ],
    "kelas/index.html": [
        ("learning-path", "light"), # #dasar
        ("soft-section", "dark"),   # #lanjutan
        ("learning-path", "light"), # #kurikulum
    ],
    "kelas/latihan.html": [
        ("quest-overview", "light"),
        ("mix-section", "dark"),
    ],
    "kelas/motivasi.html": [
        ("motivasi-section", "light"),
    ],
    "kamus/index.html": [
        ("dictionary-section", "light"),
        ("translator-studio-section", "dark"),
        ("name-generator-section", "light"),
    ],
    "kamus/kanji.html": [
        ("dictionary-section", "light"),
    ],
    "lomba/index.html": [
        ("lomba-upcoming-section", "light"),
        ("lomba-catalog-section", "dark"),
    ],
    "peringkat/index.html": [
        ("peringkat-section", "light"),
    ],
    "materi/dasar/index.html": [
        ("material-library", "light"),
        ("learning-path", "dark"), # #minigames
    ],
    "materi/dasar/hiragana.html": [
        ("lesson-article", "light"),
    ],
    "materi/dasar/katakana.html": [
        ("lesson-article", "light"),
    ],
    "materi/dasar/kosakata.html": [
        ("lesson-article", "light"),
    ],
    "materi/dasar/jikoshokai.html": [
        ("lesson-article", "light"), # Sec 1
        ("buuku-lesson", "dark"),    # Sec 2
    ],
    "materi/lanjutan/index.html": [
        ("material-library", "light"),
    ],
    "materi/lanjutan/kanji.html": [
        ("lesson-article", "light"),
    ],
    "materi/lanjutan/grammar.html": [
        ("lesson-article", "light"),
    ],
    "materi/lanjutan/kalimat.html": [
        ("lesson-article", "light"),
    ],
}

def process_file(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    orig_content = content

    # 1. Update footer github link if present
    content = content.replace("https://github.com/Hans46824/Mirai-No-Webu", "https://github.com/nihongokurabuwh/Mirai-No-Webu")
    content = content.replace("Hans46824/Mirai-No-Webu", "nihongokurabuwh/Mirai-No-Webu")

    # 2. Update section data-theme if configured
    if filepath in PAGE_SECTION_THEMES:
        theme_sequence = PAGE_SECTION_THEMES[filepath]
        # find all <section ...> tags inside the file
        def replace_section(match):
            attrs = match.group(1)
            # Skip hero sections
            if re.search(r'\b(hero|page-hero|proker-hero|quest-hero)\b', attrs):
                return match.group(0)
            # Skip practice-view / result-view hidden sections
            if "practice-view" in attrs or "result-view" in attrs:
                return match.group(0)

            # Consume the next theme from sequence
            if replace_section.idx < len(theme_sequence):
                hint, theme = theme_sequence[replace_section.idx]
                replace_section.idx += 1
                # Remove existing data-theme if any
                clean_attrs = re.sub(r'\s*data-theme="[^"]*"', '', attrs)
                # Ensure feedback-theme-white on feedback-preview when light
                if "feedback-preview" in clean_attrs:
                    if theme == "light":
                        clean_attrs = clean_attrs.replace("feedback-theme-dark", "")
                        if "feedback-theme-white" not in clean_attrs:
                            clean_attrs = re.sub(r'class="([^"]*)"', r'class="\1 feedback-theme-white"', clean_attrs)
                    elif theme == "dark":
                        clean_attrs = clean_attrs.replace("feedback-theme-white", "")
                        if "feedback-theme-dark" not in clean_attrs:
                            clean_attrs = re.sub(r'class="([^"]*)"', r'class="\1 feedback-theme-dark"', clean_attrs)

                return f'<section{clean_attrs} data-theme="{theme}">'
            return match.group(0)

        replace_section.idx = 0
        content = re.sub(r'<section([^>]*)>', replace_section, content)

    if content != orig_content:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {filepath}")
    else:
        print(f"No changes needed for {filepath}")

if __name__ == "__main__":
    all_files = list(PAGE_SECTION_THEMES.keys()) + [
        "index.html", "toko/index.html", "404.html", "offline.html",
        "arsip/halaman-rekomendasi/rekomendasi.archive.html"
    ]
    for fp in all_files:
        process_file(fp)

