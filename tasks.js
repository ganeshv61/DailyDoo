document.addEventListener("DOMContentLoaded", function() {
  const taskTB = document.getElementById('taskTableBody');
  const quotes = [
    "Great job! Keep it up!",
    "You're doing amazing!",
    "Success is the sum of small efforts repeated!"
  ];
  const timers = {};

  document.getElementById('taskForm').addEventListener('submit', e => {
    e.preventDefault();
    addTaskRow(
      document.getElementById('task').value.trim(),
      parseInt(document.getElementById('minutes').value),
      document.getElementById('reference').value.trim(),
      parseInt(document.getElementById('days').value)
    );
    ['task','minutes','reference','days'].forEach(id => document.getElementById(id).value = '');
  });

  function addTaskRow(name, mins, ref, days) {
    const id = Date.now();
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${name}</td>
      <td>${mins} min</td>
      <td id="timer-${id}">${mins}m 0s</td>
      <td>
        <button class="table-btn" id="startBtn-${id}">Start</button>
        <button class="table-btn" style="display:none" id="stopBtn-${id}">Stop</button>
        <button class="table-btn" style="display:none" id="resumeBtn-${id}">Resume</button>
        <button class="table-btn" style="display:none" id="restartBtn-${id}">Restart</button>
      </td>
      <td id="days-${id}">${days}</td>
      <td><input type="checkbox"></td>
      <td>${ref}</td>
      <td>
        <button class="table-btn delete-btn" id="del-${id}">Delete</button>
        <div id="deleteOptions-${id}" style="display:none;">
          <button class="table-btn" id="delToday-${id}">Delete for Today</button>
          <button class="table-btn" id="delPerm-${id}">Delete Permanently</button>
        </div>
      </td>
    `;
    taskTB.appendChild(tr);

    document.getElementById(`startBtn-${id}`).onclick   = () => runTimer(id, mins*60, mins*60);
    document.getElementById(`stopBtn-${id}`).onclick    = () => stopTimer(id);
    document.getElementById(`resumeBtn-${id}`).onclick  = () => runTimer(id, timers[id].left, timers[id].total);
    document.getElementById(`restartBtn-${id}`).onclick = () => runTimer(id, timers[id].total, timers[id].total);
    
    // Delete options
    document.getElementById(`del-${id}`).onclick = () => {
      const opt = document.getElementById(`deleteOptions-${id}`);
      opt.style.display = opt.style.display === 'none' ? 'block' : 'none';
    };
    document.getElementById(`delToday-${id}`).onclick = () => {
      tr.style.display = "none";
    };
    document.getElementById(`delPerm-${id}`).onclick = () => {
      clearInterval(timers[id]?.int);
      tr.remove();
    };
  }

  function runTimer(id, secondsLeft, total) {
    clearInterval(timers[id]?.int);
    const tDisp   = document.getElementById(`timer-${id}`);
    const startB  = document.getElementById(`startBtn-${id}`);
    const stopB   = document.getElementById(`stopBtn-${id}`);
    const resB    = document.getElementById(`resumeBtn-${id}`);
    const reB     = document.getElementById(`restartBtn-${id}`);

    startB.style.display  = 'none';
    stopB.style.display   = 'inline';
    resB.style.display    = 'none';
    reB.style.display     = 'none';

    timers[id] = {
      total,
      left: secondsLeft,
      int: setInterval(() => {
        if (--timers[id].left < 0) {
          clearInterval(timers[id].int);
          tDisp.textContent = "Done";
          return;
        }
        const m = Math.floor(timers[id].left/60),
              s = timers[id].left % 60;
        tDisp.textContent = `${m}m ${s}s`;
      }, 1000)
    };

    stopB.onclick = () => {
      clearInterval(timers[id].int);
      stopB.style.display = 'none';
      resB.style.display  = 'inline';
      reB.style.display   = 'inline';
    };
  }

  function scheduleMidnightReset() {
    const now = new Date();
    const msTillMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1).getTime() - now.getTime();
    setTimeout(() => { location.reload(); }, msTillMidnight + 1000);
  }
  scheduleMidnightReset();

  taskTB.addEventListener('change', () => {
    const rows = [...taskTB.querySelectorAll('tr')];
    const allDone = rows.length && rows.every(r => r.querySelector('input[type="checkbox"]').checked || r.style.display === 'none');
    document.getElementById('completionMessage').style.display = allDone ? 'block' : 'none';
    if (allDone) document.getElementById('quoteBox').textContent = quotes[Math.floor(Math.random() * quotes.length)];
  });
});