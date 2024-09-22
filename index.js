const publicKey = '7aec8be88ac3f8fff8a0ee870fe35702';
const privateKey = '8ee06740c1ffb4e5e3a4213242522e33130db1d8';
const date = Date.now().toString();
const hash = CryptoJS.MD5(date + privateKey + publicKey).toString();

const images = [
    'image1.jpg',
    'image2.jpg',
    'image3.jpg',
];

document.addEventListener('DOMContentLoaded', function () {
    setInterval(changeBackground, 4000);
    changeBackground();

    document.getElementById('searchForm').addEventListener('submit', function (event) {
        event.preventDefault();

        var characterName = document.getElementById('searchInput').value;

        if (characterName) {
            fetchCharacterData(characterName);
        }
    });

    document.getElementById('comicsNavButton').addEventListener('click', function () {
        document.getElementById('comicsSection').scrollIntoView({
            behavior: 'smooth'
        });
    });
});

function fetchCharacterData(characterName) {
    var url = 'https://gateway.marvel.com/v1/public/characters?nameStartsWith=' + characterName + '&ts=' + date + '&apikey=' + publicKey + '&hash=' + hash;

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var hero = data.data.results[0];

            if (hero) {
                document.getElementById('heroInfo').innerHTML = `
                    <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${hero.name}" style="width: 100%; height: auto;">
                    <h2>${hero.name}</h2>
                    <p>${hero.description || 'No description available.'}</p>
                `;


                fetchComicsData(hero.id);
            } else {
                document.getElementById('heroInfo').innerHTML = '<p>Character not found.</p>';
            }
        })
        .catch(function (error) {
            console.error('Error fetching character data:', error);
            document.getElementById('heroInfo').innerHTML = '<p>Error retrieving data.</p>';
        });
}

function fetchComicsData(characterId) {
    var comicsUrl = 'https://gateway.marvel.com/v1/public/characters/' + characterId + '/comics?ts=' + date + '&apikey=' + publicKey + '&hash=' + hash;

    fetch(comicsUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var comics = data.data.results;

            if (comics.length > 0) {
                var comicsList = comics.map(function (comic) {
                    return '<li>' + comic.title + '</li>';
                }).join('');
                document.getElementById('comicsSection').innerHTML = `
                    <h3>Comics List</h3>
                    <ul>${comicsList}</ul>
                `;
            } else {
                document.getElementById('comicsSection').innerHTML = '<p>No comics found for this character.</p>';
            }
        })
        .catch(function (error) {
            console.error('Error fetching comics data:', error);
            document.getElementById('comicsSection').innerHTML = '<p>Error retrieving comics.</p>';
        });
}

function changeBackground() {
    var randomImage = images[Math.floor(Math.random() * images.length)];
    document.body.style.backgroundImage = 'url(\'' + randomImage + '\')';
}
