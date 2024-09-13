const publicKey = '7aec8be88ac3f8fff8a0ee870fe35702';
const privateKey = '8ee06740c1ffb4e5e3a4213242522e33130db1d8';
const date = Date.now().toString();
const hash = CryptoJS.MD5(date + privateKey + publicKey).toString();

const images = [
    'image1.jpg',
    'image2.jpg',
    'image3.jpg',
];

document.addEventListener('DOMContentLoaded', function() {
    setInterval(changeBackground, 4000);
    changeBackground();
});

function changeBackground() {
    const randomImage = images[Math.floor(Math.random() * images.length)];
    document.body.style.backgroundImage = `url('${randomImage}')`;
}

function handleMainPage() {
    setInterval(changeBackground, 4000);
    changeBackground();

    document.getElementById('searchForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const characterName = document.getElementById('searchInput').value;

        if (characterName) {
            const url = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${characterName}&ts=${date}&apikey=${publicKey}&hash=${hash}`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    const hero = data.data.results[0];

                    if (hero) {
                        document.getElementById('heroInfo').innerHTML = `
                            <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${hero.name}">
                            <h2>${hero.name}</h2>
                            <p>${hero.description || 'No description available.'}</p>
                        `;
                    } else {
                        document.getElementById('heroInfo').innerHTML = '<p>Character not found.</p>';
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    document.getElementById('heroInfo').innerHTML = '<p>Error retrieving data.</p>';
                });
        }
    });

    document.getElementById('heroInfo').insertAdjacentHTML('afterend', `
        <nav>
            <button id="comicsNavButton">Go to Comics List</button>
        </nav>`);

    document.getElementById('comicsNavButton').addEventListener('click', function () {
        const characterName = document.getElementById('searchInput').value;

        if (characterName) {
            const comicsUrl = `https://gateway.marvel.com/v1/public/characters?name=${characterName}&ts=${date}&apikey=${publicKey}&hash=${hash}`;

            fetch(comicsUrl)
                .then(response => response.json())
                .then(data => {
                    const hero = data.data.results[0];
                    if (hero) {
                        const characterId = hero.id;

                        fetch(`https://gateway.marvel.com/v1/public/characters/${characterId}/comics?ts=${date}&apikey=${publicKey}&hash=${hash}`)
                            .then(response => response.json())
                            .then(comicsData => {
                                localStorage.setItem('comics', JSON.stringify(comicsData.data.results));
                                window.location.href = `comics.html?characterId=${characterId}`;
                            })
                            .catch(error => {
                                console.error('Problem fetching comics:', error);
                            });
                    }
                })
                .catch(error => {
                    console.error('Problem fetching character data:', error);
                });
        }
    });
}

function handleComicsPage() {
    document.addEventListener('DOMContentLoaded', function () {
       
        const urlParams = new URLSearchParams(window.location.search);
        const characterId = urlParams.get('characterId');

        if (characterId) {
            
            const comics = JSON.parse(localStorage.getItem('comics'));

            if (comics && comics.length > 0) {
                const contentDiv = document.querySelector('.content');
                contentDiv.innerHTML = '<h1>Comics List</h1>';

                const comicsList = document.createElement('ul');
                comics.forEach(comic => {
                    const listItem = document.createElement('li');
                    listItem.textContent = comic.title;
                    comicsList.appendChild(listItem);
                });

                contentDiv.appendChild(comicsList);
            } else {
                document.querySelector('.content').innerHTML = '<p>No comics found for this character.</p>';
            }
        } else {
            document.querySelector('.content').innerHTML = '<p>Character ID not provided.</p>';
        }
    });
}


if (window.location.pathname.endsWith('index.html')) {
    handleMainPage();
} else if (window.location.pathname.endsWith('comics.html')) {
    handleComicsPage();
}
