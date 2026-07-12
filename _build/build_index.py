#!/usr/bin/env python3
"""
build_index.py — 仓内构建脚本
扫描 observations/*.md / poems/*.md / assets/img/quotes-archive/*.jpg
→ 生成 index.json (按发布时间倒序)
供首页 latest.js 渲染「最新小诗/最新观察/最新心头字」。
"""
import json
import os
import re
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / 'index.json'
TZ = timezone(timedelta(hours=8))

FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n?", re.DOTALL)
H1_RE = re.compile(r"^#\s+(.+?)\s*$", re.MULTILINE)
H2_RE = re.compile(r"^##\s+(.+?)\s*$", re.MULTILINE)


def parse_frontmatter(text):
    m = FRONTMATTER_RE.match(text)
    if not m:
        return {}, text
    meta = {}
    for line in m.group(1).split("\n"):
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip().strip(chr(34)).strip(chr(39))
    return meta, text[m.end():]


def entries_from_observations():
    out = []
    obs_dir = ROOT / "observations"
    if not obs_dir.exists():
        return out
    for md_file in sorted(obs_dir.glob("*.md")):
        text = md_file.read_text(encoding="utf-8")
        meta, body = parse_frontmatter(text)
        date_iso = meta.get("date")
        if not date_iso:
            m = re.match(r"(\d{4}-\d{2}-\d{2})", md_file.stem)
            if m:
                date_iso = m.group(1) + "T00:00:00+08:00"
            else:
                date_iso = datetime.fromtimestamp(md_file.stat().st_mtime, TZ).isoformat()
        title = meta.get("title")
        if not title:
            h = H2_RE.search(body) or H1_RE.search(body)
            title = h.group(1).strip() if h else md_file.stem
        summary = meta.get("summary")
        if not summary:
            for line in body.split("\n"):
                line = line.strip()
                if line and not line.startswith("#") and not line.startswith("---") and len(line) >= 6:
                    summary = line
                    if len(summary) > 80:
                        summary = summary[:77] + "…"
                    break
        out.append({
            "kind": "observation",
            "title": title,
            "date": date_iso,
            "summary": summary or "",
            "link": "observations.html#" + md_file.stem,
            "slug": md_file.stem,
            "source": str(md_file.relative_to(ROOT)),
        })
    return out
def entries_from_poems():
    out = []
    p_dir = ROOT / "poems"
    if not p_dir.exists():
        return out
    for md_file in sorted(p_dir.glob("*.md")):
        text = md_file.read_text(encoding="utf-8")
        meta, body = parse_frontmatter(text)
        date_iso = meta.get("date")
        if not date_iso:
            m = re.match(r"(\d{4}-\d{2}-\d{2})", md_file.stem)
            if m:
                date_iso = m.group(1) + "T00:00:00+08:00"
            else:
                date_iso = datetime.fromtimestamp(md_file.stat().st_mtime, TZ).isoformat()
        title = meta.get("title")
        if not title:
            h = H1_RE.search(body)
            title = h.group(1).strip() if h else md_file.stem
        summary = meta.get("summary")
        if not summary:
            for line in body.split("\n"):
                line = line.strip()
                if line and not line.startswith("#") and not line.startswith("---") and len(line) >= 6:
                    summary = line
                    if len(summary) > 80:
                        summary = summary[:77] + "…"
                    break
        out.append({
            "kind": "poem",
            "title": title,
            "date": date_iso,
            "summary": summary or "",
            "link": "poems.html#" + md_file.stem,
            "slug": md_file.stem,
            "source": str(md_file.relative_to(ROOT)),
        })
    return out

def entries_from_quotes():
    """Quotes 是图片; 日期 = 文件名 YYYYMMDD-HHMMSS 或 mtime. title 简易编号."""
    out = []
    archive = ROOT / "assets" / "img" / "quotes-archive"
    if not archive.exists():
        return out
    # 反查 quotes.html — 全部 quote-card 缩略 (NN-标题-作者.jpg) → 元数据, 暂未使用
    quotes_index = {}
    qhtml_path = ROOT / "quotes.html"
    if qhtml_path.exists():
        qhtml = qhtml_path.read_text(encoding="utf-8")
        for m in re.finditer(r'<img[^>]+src="assets/img/quotes/([^"]+)"', qhtml):
            asset_name = m.group(1)
            stem = Path(asset_name).stem
            sm = re.match(r"(\d+)-(.+?)-([^-\n]+?)(?:\.full)?$", stem)
            if sm:
                quotes_index[sm.group(1)] = {"quote": sm.group(2), "author": sm.group(3)}
    for img in sorted(archive.glob("*.[jp][pn]g")):
        m = re.match(r"(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})", img.stem)
        if m:
            dt = datetime(*map(int, m.groups()), tzinfo=TZ)
        else:
            dt = datetime.fromtimestamp(img.stat().st_mtime, TZ)
        idx = len(out) + 1
        out.append({
            "kind": "quote",
            "title": "心头字 #" + str(idx),
            "author": "燕如",
            "date": dt.isoformat(),
            "summary": "",
            "link": "quotes.html",
            "image": "assets/img/quotes-archive/" + img.name,
            "source": str(img.relative_to(ROOT)),
        })
    return out


def main():
    all_entries = []
    all_entries.extend(entries_from_observations())
    all_entries.extend(entries_from_poems())
    all_entries.extend(entries_from_quotes())
    all_entries.sort(key=lambda e: e.get("date", ""), reverse=True)
    payload = {
        "generated_at": datetime.now(TZ).isoformat(),
        "count": len(all_entries),
        "entries": all_entries,
    }
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print("OK", len(all_entries), "entries", "->", OUTPUT.relative_to(ROOT))
    by_kind = {}
    for e in all_entries:
        k = e.get("kind")
        if k not in by_kind:
            by_kind[k] = e
    for k, e in by_kind.items():
        print("  latest", k, ":", e.get("title"), "@", e.get("date", "")[:16])


if __name__ == "__main__":
    main()
