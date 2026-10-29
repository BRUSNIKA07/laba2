document.addEventListener('DOMContentLoaded', () => {

    const PHOTOS = {
        about: 'images/me1.jpg',
        hobby: 'images/ho1.jpg'
    };

    const PROJECTS = [
        ['Сайт-визитка', 'HTML + CSS + JS', '#e08aa0'],
        ['Игра на Python', 'Рогалик на python(pygame)', '#6fb7a8'],
        ['Калькулятор', 'C++, консольное приложение', '#f0c36a'],
        ['Конект 2х компов', 'Python + tcp + udp', '#9bb7e0'],
        ['Работа с arduino', 'Валютный флюгер', '#c9a0dc']
    ];

    const LANGS = [['C++', 'cpp'], ['C', 'c'], ['Python', 'py'], ['JS', 'js'], ['CSS', 'css']];

    const img = (src) => `<img class="photo" src="${src}" alt="Фото" onerror="this.style.display='none'">`;

    const minis = PROJECTS.map(([name, desc, color]) =>
        `<div class="mini" style="--c:${color}"><i></i><span class="popup"><b>${name}</b><br>${desc}</span></div>`
    ).join('');

    const langs = LANGS.map(([name, cls]) => `<span class="lang l-${cls}">${name}</span>`).join('');

    const contentData = {
        about: {
            label: 'ОБО МНЕ',
            title: 'Привет! Я, Никишин Александр Михайлович',
            html: `<p>Я студент ДВФУ, вот кое-что обо мне.</p>
                ${img(PHOTOS.about)}
                <ul class="facts">
                    <li>Учусь в ДВФУ во Владивостоке.</li>
                    <li>Учусь писать красивый и рабочий код.</li>
                    <li>Практикую Python, C/C++, JS.</li>
                    <li>Люблю музыку — отсюда и дизайн сайта.</li>
                    <li>Люблю фотографировать пейзажи.</li>
                </ul>`
        },
        hobby: {
            label: 'ХОББИ',
            title: 'Мои Хобби',
            html: `<p>Моё главное хобби - фотографии</p>
                ${img(PHOTOS.hobby)}
                <ul class="facts">
                    <li>Люблю старые японские машины.</li>
                    <li>Играю на гитаре.</li>
                    <li>Люблю поиграть в доту и просто хорошо провести время.</li>
                </ul>`
        },
        projects: {
            label: 'НАВЫКИ',
            title: 'Мои Навыки',
            html: `<p>Наведи курсор на пластинку — увидишь проект.</p>
                <div class="minis">${minis}</div>
                <h4>Языки программирования</h4>
                <div class="langs">${langs}</div>`
        }
    };

    const RED = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
    const SECTOR = 360 / 37;
    const STAKE = 100;
    let balance = 1000, rot = 0, gameId = 0;

    const colorOf = n => n === 0 ? 'green' : RED.includes(n) ? 'red' : 'black';
    const isEven = n => n % 2 === 0;
    const countOf = (c, p) => Array.from({ length: 36 }, (_, i) => i + 1)
        .filter(n => colorOf(n) === c && isEven(n) === (p === 'even')).length;

    const BETS = [['red', 'even', 'Красное чётное'], ['red', 'odd', 'Красное нечётное'],
                  ['black', 'even', 'Чёрное чётное'], ['black', 'odd', 'Чёрное нечётное']];

    const bets = BETS.map(([c, p, name]) =>
        `<button class="bet ${c}" data-c="${c}" data-p="${p}">${name}<small>выплата ×${(37 / countOf(c, p)).toFixed(1)}</small></button>`
    ).join('');

    contentData.game = {
        label: 'РУЛЕТКА',
        title: 'Рулетка',
        html: `<p>Ставка ${STAKE} монет. Колесо крутится, а тонарм опускается и сам решает, куда упасть. Ноль проигрывает всем.</p>
            <div class="bank">Баланс: <b id="bank">${balance}</b></div>
            <div class="bets">${bets}</div>
            <div class="result" id="result">Выбери ставку.</div>`,
        init: initGame
    };

    function initGame() {
        rot = 0;
        document.getElementById('bank').textContent = balance;
        vinyl.classList.add('roulette');
        const paint = { green: '#2e8b57', red: '#c8454f', black: '#262124' };
        const stops = Array.from({ length: 37 }, (_, i) => `${paint[colorOf(i)]} ${i * SECTOR}deg ${(i + 1) * SECTOR}deg`);
        vinyl.style.setProperty('--wheel', `conic-gradient(${stops.join(',')})`);
        for (let i = 0; i < 37; i++) {
            const s = document.createElement('span');
            s.className = 'num';
            s.textContent = i;
            s.style.transform = `translate(-50%,-50%) rotate(${(i + 0.5) * SECTOR}deg) translateY(-190px)`;
            vinyl.appendChild(s);
        }
        contentText.querySelectorAll('.bet').forEach(b =>
            b.addEventListener('click', () => spin(b.dataset.c, b.dataset.p)));
    }

    function spin(color, parity) {
        const buttons = contentText.querySelectorAll('.bet');
        const bank = document.getElementById('bank'), msg = document.getElementById('result');
        const id = ++gameId;
        buttons.forEach(b => b.disabled = true);
        balance -= STAKE;
        bank.textContent = balance;
        msg.textContent = 'Тонарм поднят, колесо крутится…';
        tonearm.classList.remove('playing');
        rot += 360 * 5 + Math.random() * 360;
        vinyl.style.transform = `rotate(${rot}deg)`;
        setTimeout(() => {
            if (id !== gameId) return;
            tonearm.classList.add('playing');
            setTimeout(() => {
                if (id === gameId) finish(color, parity, bank, msg, buttons);
            }, 1100);
        }, 4700);
    }

    function finish(color, parity, bank, msg, buttons) {
        const v = vinyl.getBoundingClientRect();
        const h = tonearm.querySelector('.head').getBoundingClientRect();
        const angle = Math.atan2(h.left + h.width / 2 - v.left - v.width / 2,
                                 -(h.top + h.height / 2 - v.top - v.height / 2)) * 180 / Math.PI;
        const n = Math.floor((((angle - rot) % 360) + 720) % 360 / SECTOR);
        const c = colorOf(n);
        const win = n > 0 && c === color && isEven(n) === (parity === 'even');
        const names = { green: 'зелёное', red: 'красное', black: 'чёрное' };
        let text = `Игла остановилась на ${n}: ${names[c]}${n ? (isEven(n) ? ', чётное' : ', нечётное') : ''}. `;
        if (win) {
            const prize = Math.round(STAKE * 37 / countOf(color, parity));
            balance += prize;
            text += `Выигрыш: ${prize} монет!`;
        } else {
            text += 'Ставка проиграна.';
        }
        if (balance < STAKE) { balance = 1000; text += ' Монеты кончились, банк снова 1000.'; }
        bank.textContent = balance;
        msg.textContent = text;
        buttons.forEach(b => b.disabled = false);
    }

    const records = document.querySelectorAll('.record-item');
    const vinyl = document.getElementById('vinyl-disc');
    const tonearm = document.getElementById('tonearm');
    const labelTitle = document.getElementById('label-title');
    const contentTitle = document.getElementById('content-title');
    const contentText = document.getElementById('content-text');
    const centerLabel = document.querySelector('.label');
    let timer;

    function show(record) {
        const data = contentData[record.dataset.target];
        const color = getComputedStyle(record.querySelector('.record-cover')).getPropertyValue('--cover-color');
        centerLabel.style.setProperty('--current-label-color', color);
        labelTitle.textContent = data.label;
        contentTitle.textContent = data.title;
        gameId++;
        vinyl.classList.remove('roulette');
        vinyl.style.transform = '';
        vinyl.querySelectorAll('.num').forEach(n => n.remove());
        contentText.innerHTML = data.html;
        if (data.init) data.init();
    }

    function play() {
        tonearm.classList.add('playing');
        vinyl.classList.add('spin');
    }

    records.forEach(record => {
        record.addEventListener('click', () => {
            if (record.classList.contains('active')) return;

            records.forEach(r => r.classList.remove('active'));
            record.classList.add('active');

            clearTimeout(timer);
            tonearm.classList.remove('playing');   
            vinyl.classList.remove('spin');        

            timer = setTimeout(() => {
                show(record);                      
                timer = setTimeout(play, 600);     
            }, 900);
        });
    });

    show(document.querySelector('.record-item.active'));
    setTimeout(play, 500);
});