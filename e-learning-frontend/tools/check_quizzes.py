from pathlib import Path
import re
s=Path('d:/E learning/e-learning-frontend/assets/js/data.js').read_text(encoding='utf-8')
ids = re.findall(r"id:\s*'([\w\-]+)'", s)
ok = True
for id_ in ids:
    m = re.search(r"id:\s*'"+re.escape(id_)+r"'.*?quiz:\s*\[(.*?)\]\s*[,\}]", s, re.S)
    if not m:
        print(id_, 'quiz not found')
        ok = False
        continue
    block = m.group(1)
    q_count = len(re.findall(r"\{\s*q:\s*'", block))
    print(id_, 'quiz count =', q_count)
    if q_count != 25:
        ok = False
        print('  -> ERROR: expected 25 questions')
if ok:
    print('\nAll quizzes have 25 questions.')
else:
    print('\nSome quizzes are missing or have incorrect number of questions.')
