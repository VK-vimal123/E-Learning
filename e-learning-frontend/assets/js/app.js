/* App logic for E-Learning frontend-only app */

// Utility: get query param
function qs(name){
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

// Render courses grid
function renderCourses(container){
  container.innerHTML = '';
  window.COURSES.forEach(course => {
    const card = document.createElement('div');
    card.className = 'card';

    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    thumb.innerHTML = `<div>${course.title}</div>`;

    const title = document.createElement('h3');
    title.textContent = course.title;

    const desc = document.createElement('p');
    desc.textContent = course.description;

    const meta = document.createElement('div');
    meta.className = 'meta';

    const viewBtn = document.createElement('a');
    viewBtn.className = 'btn small primary';
    viewBtn.textContent = 'View Lesson';
    viewBtn.href = `lesson.html?course=${course.id}`;

    meta.appendChild(viewBtn);

    card.appendChild(thumb);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(meta);

    container.appendChild(card);
  });
}

// Load lesson page
function loadLessonFromPage(){
  const id = qs('course');
  const course = window.COURSES.find(c=>c.id===id);
  const titleEl = document.getElementById('lessonTitle');
  const videoWrap = document.getElementById('videoWrap');
  const notes = document.getElementById('lessonNotes');
  const toQuiz = document.getElementById('toQuiz');

  if(!course){
    titleEl.textContent = 'Course not found';
    videoWrap.innerHTML = '<p class="muted">No video available.</p>';
    notes.innerHTML = '';
    toQuiz.style.display = 'none';
    return;
  }

  titleEl.textContent = course.title;
  // Use safe iframe embed
  videoWrap.innerHTML = `<iframe src="${course.video}" title="${course.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  notes.innerHTML = course.notes;
  toQuiz.href = `quiz.html?course=${course.id}`;
}

// Load quiz page
function loadQuizFromPage(){
  const id = qs('course');
  const course = window.COURSES.find(c=>c.id===id);
  const title = document.getElementById('quizTitle');
  const form = document.getElementById('quizForm');
  const result = document.getElementById('quizResult');

  if(!course){
    title.textContent = 'Quiz not found';
    form.innerHTML = '<p class="muted">No quiz available.</p>';
    return;
  }

  title.textContent = `${course.title} — Quiz`;
  form.innerHTML = '';
  result.innerHTML = '';

  course.quiz.forEach((item, idx)=>{
    const qWrap = document.createElement('div');
    qWrap.className = 'question';

    const q = document.createElement('p');
    q.innerHTML = `<strong>Q${idx+1}.</strong> ${item.q}`;

    qWrap.appendChild(q);

    item.options.forEach((opt, oi)=>{
      const idOpt = `q${idx}_opt${oi}`;
      const label = document.createElement('label');
      label.style.display = 'block';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `q${idx}`;
      input.value = String(oi);
      input.id = idOpt;
      label.appendChild(input);
      label.insertAdjacentText('beforeend', ' ' + opt);
      qWrap.appendChild(label);
    });

    form.appendChild(qWrap);
  });

  const submit = document.createElement('button');
  submit.className = 'btn primary';
  submit.type = 'button';
  submit.textContent = 'Submit Quiz';
  submit.onclick = ()=>submitQuiz(course, form, result);

  form.appendChild(submit);
}

// Quiz submission + scoring
function submitQuiz(course, form, resultEl){
  const answers = [];
  const questions = form.querySelectorAll('.question');
  questions.forEach((qEl, idx)=>{
    const selected = qEl.querySelector('input[type="radio"]:checked');
    answers[idx] = selected ? Number(selected.value) : null;
  });

  // Calculate score
  let correct = 0;
  course.quiz.forEach((q, idx)=>{
    if(answers[idx] === q.answer) correct++;
  });

  const total = course.quiz.length;
  const percent = Math.round((correct/total)*100);

  resultEl.className = 'result success';
  resultEl.innerHTML = `<strong>Score:</strong> ${correct}/${total} — ${percent}%<br><small class="muted">${percent>=70 ? 'Great job!' : 'Review the lesson and try again.'}</small>`;
}

// Expose functions for pages
window.renderCourses = renderCourses;
window.loadLessonFromPage = loadLessonFromPage;
window.loadQuizFromPage = loadQuizFromPage;