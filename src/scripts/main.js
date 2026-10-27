document.addEventListener('DOMContentLoaded', () => {
    const records = document.querySelectorAll('.record-item');
    const vinyl = document.getElementById('vinyl-disc');
    const tonearm = document.getElementById('tonearm');
    const labelTitle = document.getElementById('label-title');
    const contentTitle = document.getElementById('content-title');
    const contentText = document.getElementById('content-text');
    const centerLabel = document.querySelector('.label');

    const contentData = {
        'about': {
            title: 'Привет! Я, Никишин Александр Михайлович',
            text: 'Здесь будет текст обо мне, моем опыте и навыках.',
            label: 'ОБО МНЕ'
        },
        'hobby': {
            title: 'Мои Хобби',
            text: 'Я люблю фотографировать, играть на гитаре и путешествовать.',
            label: 'ХОББИ'
        },
        'projects': {
            title: 'Мои Проекты',
            text: 'Вот список моих лучших работ: сайт-визитка, игра на JS и т.д.',
            label: 'ПРОЕКТЫ'
        }
    };

    function updateLabelColor(recordElement) {
        const cover = recordElement.querySelector('.record-cover');
        const bgColor = window.getComputedStyle(cover).backgroundColor;
        centerLabel.style.setProperty('--current-label-color', bgColor);
    }

    records.forEach(record => {
        record.addEventListener('click', () => {
            records.forEach(r => r.classList.remove('active'));
            record.classList.add('active');

            const target = record.getAttribute('data-target');
            const data = contentData[target];

            tonearm.classList.remove('playing');

            setTimeout(() => {
                vinyl.classList.add('spin');
                
                updateLabelColor(record); 
                labelTitle.textContent = data.label;

                setTimeout(() => {
                    tonearm.classList.add('playing');
                }, 500);

                contentTitle.textContent = data.title;
                contentText.textContent = data.text;

                setTimeout(() => {
                    vinyl.classList.remove('spin');
                }, 1500);

            }, 300);
        });
    });

    const activeRecord = document.querySelector('.record-item.active');
    if (activeRecord) {
        updateLabelColor(activeRecord);
    }

    setTimeout(() => {
        tonearm.classList.add('playing');
    }, 500);
});