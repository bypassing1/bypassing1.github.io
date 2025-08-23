const carousel = document.getElementById('carousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentIndex = 0;

function updateButtons() {
    const items = document.querySelectorAll('.carousel-item');
    const visibleItems = Math.round(carousel.clientWidth / items[0].clientWidth);
    const itemWidth = carousel.clientWidth / visibleItems;

    if (currentIndex === 0) {
        prevBtn.classList.add('hidden');
    } else {
        prevBtn.classList.remove('hidden');
    }

    if (currentIndex === items.length - visibleItems) {
        nextBtn.classList.add('hidden');
    } else {
        nextBtn.classList.remove('hidden');
    }
}

nextBtn.addEventListener('click', () => {
    const items = document.querySelectorAll('.carousel-item');
    const visibleItems = Math.round(carousel.clientWidth / items[0].clientWidth);
    const itemWidth = carousel.clientWidth / visibleItems;

    if (currentIndex < items.length - visibleItems) {
        currentIndex++;
        carousel.style.transform = `translateX(-${currentIndex * itemWidth+10}px)`;
    }
    updateButtons();
});

prevBtn.addEventListener('click', () => {
    const items = document.querySelectorAll('.carousel-item');
    const visibleItems = Math.round(carousel.clientWidth / items[0].clientWidth);
    const itemWidth = carousel.clientWidth / visibleItems;

    if (currentIndex > 0) {
        currentIndex--;
        carousel.style.transform = `translateX(-${currentIndex * itemWidth+10}px)`;
    }
    updateButtons();
});

updateButtons();
window.addEventListener('resize', updateButtons);

function scrollToForm() {
    document.getElementById('obbyFormSection').scrollIntoView({
        behavior: 'smooth'
    });
}
document.getElementById('obbyForm').addEventListener('submit', function (event) {
    event.preventDefault();

    let formData = {
        region: document.getElementById('region').value,
        title: document.getElementById('title').value,
        verifier: document.getElementById('verifier').value,
        link: document.getElementById('link').value,
        gamelink: document.getElementById('gamelink').value,
        opinions: document.getElementById('opinions').value
    };

    let formDataForJson = {
        ...formData
    };
    delete formDataForJson.opinions;

    sendToDiscord(formData, formDataForJson);
});

function sendToDiscord(formData, formDataForJson) {
    let webhookURL =
        'https://discord.com/api/webhooks/' + '1253170766841647104/nQxjjKET67Y0YCNYvWFXk1tV46jc-eE45eUxTZaFoZkgZ8gsmmHtPhUCWkf1XUbpe2vo';

    let embedMessage = {
        embeds: [{
            title: 'New Obby Submission',
            fields: [{
                    name: 'Region',
                    value: formData.region
                },
                {
                    name: 'Title',
                    value: formData.title
                },
                {
                    name: 'Verifier',
                    value: formData.verifier
                },
                {
                    name: 'Video Link',
                    value: formData.link
                },
                {
                    name: 'Game Link',
                    value: formData.gamelink
                },
                {
                    name: 'Opinions',
                    value: formData.opinions
                }
            ],
            color: 0x7289da
        }]
    };

    let jsonData = JSON.stringify(formDataForJson, null, 2);

    embedMessage.embeds[0].fields.push({
        name: 'JSON Data',
        value: '```json\n' + jsonData + '\n```'
    });

    fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(embedMessage),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Form submitted successfully!');
            alert('Form submitted successfully!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while submitting the form.');
        });
}
particlesJS("particles", {
    particles: {
        number: {
            value: 100,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: "#ffffff"
        },
        shape: {
            type: "circle",
            stroke: {
                width: 0,
                color: "#000000"
            }
        },
        opacity: {
            value: 1,
            random: true,
            animation: {
                enable: true,
                speed: 1,
                opacity_min: 0,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 1,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
        }
    },
    interactivity: {
        detectsOn: "canvas",
        events: {
            onHover: {
                enable: true,
                mode: "push"
            },
            onClick: {
                enable: true,
                mode: "push"
            },
            resize: true
        },
        modes: {
            repulse: {
                distance: 100,
                duration: 0.4
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
});