const publicKey = '7aec8be88ac3f8fff8a0ee870fe35702';
const privateKey = '8ee06740c1ffb4e5e3a4213242522e33130db1d8';
const ts = Date.now().toString();
const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

const url = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

fetch(url)
    .then(function (response) {
        return response.json();
    })

    .then(function (data) {
        console.log(data);


    })

    .catch(function (error) {
        console.error('Error fetching data:', error);
    });

    const images = [
        'image1.jpg',
        'image2.jpg',
        'image3.jpg',
    ]

    function changeBackground() {
        const randomImage = images[Math.floor(Math.random() * images.length)];
        document.body.style.backgroundImage = `url('${randomImage}')`;
    }

    setInterval(changeBackground, 4000)

    changeBackground();

