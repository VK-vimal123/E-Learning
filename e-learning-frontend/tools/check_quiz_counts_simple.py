from pathlib import Path
import re
s=Path('d:/E learning/e-learning-frontend/assets/js/data.js').read_text(encoding='utf-8')
for m in re.finditer(r"id:\s*'([\w\-]+)'", s):
    id_ = m.group(1)
    start = m.end()
    # find end of this course block by locating next '},' that follows an id or end of array
    next_course = re.search(r"\n\s*\},\n\s*\{", s[start:])
    if next_course:
        block = s[start:start+next_course.start()]
    else:
        block = s[start:]
    q_count = len(re.findall(r"\{\s*q:\s*'", block))
    print(f"{id_}: {q_count}")
