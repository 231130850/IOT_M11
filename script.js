const firebaseConfig = {
    apiKey: "AIzaSyAYgr4G2-1DAPO_DlMEbGo8Ig6k6YVoJrk", 
    authDomain: "iot-project-m11.firebaseapp.com",
    databaseURL: "https://iot-project-m11-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "iot-project-m11",
    storageBucket: "iot-project-m11.firebasestorage.app",
    messagingSenderId: "915095149218",
    appId: "1:915095149218:web:938dfd41f8e21a36db15fb",
    measurementId: "G-HJMTZMKZM4"
};

// Inisialisasi Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const database = app.database();
const sensorRef = database.ref('greenhouse/sensors');

auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('dashboard-section').style.display = 'block';
        listenToSensors();
    } else {
        document.getElementById('login-section').style.display = 'flex';
        document.getElementById('dashboard-section').style.display = 'none';
    }
});

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('login-error');
    errorElement.textContent = "";

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
        })
        .catch((error) => {
            errorElement.textContent = "❌ Login gagal: " + error.message;
        });
}

function logout() {
    auth.signOut();
}

function listenToSensors() {
    sensorRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            updateSoil(data.soilMoisture);
            updateLight(data.lightlevel);
            updateMotion(data.motion);
            updateFlame(data.flame);
            updateObject(data.object);
            updateTimestamp(data.timestamp);
        }
    });
}

function updateSoil(value) {
    document.getElementById('soilMoisture').innerText = value + ' %';
    const statusElement = document.getElementById('soil-status');
    
    if (value < 30) {
        statusElement.innerText = '⚠️ KERING, Perlu Penyiraman!';
        statusElement.style.color = '#D32F2F';
    } else if (value < 70) {
        statusElement.innerText = '✔️ Cukup';
        statusElement.style.color = '#388E3C';
    } else {
        statusElement.innerText = '💧 Basah';
        statusElement.style.color = '#1976D2';
    }
}

function updateLight(value) {
    document.getElementById('lightlevel').innerText = value + ' %';
    const statusElement = document.getElementById('light-status');

    if (value < 30) {
        statusElement.innerText = '⚠️ GELAP, Perlu Cahaya Tambahan!';
        statusElement.style.color = '#D32F2F';
    } else if (value < 70) {
        statusElement.innerText = '✔️ Cukup';
        statusElement.style.color = '#388E3C';
    } else {
        statusElement.innerText = '☀️ Terang';
        statusElement.style.color = '#FBC02D';
    }
}

function updateMotion(value) {
    const valElement = document.getElementById('motion');
    const statusElement = document.getElementById('motion-status');
    
    if (value === true) {
        valElement.innerText = 'ADA'; 
        statusElement.innerText = '⚠️ Terdeteksi'; 
        statusElement.style.color = '#D32F2F';
    } else {
        valElement.innerText = '--';
        statusElement.innerText = '✔️ Aman'; 
        statusElement.style.color = '#388E3C';
    }
}

function updateFlame(value) {
    const valElement = document.getElementById('flame');
    const statusElement = document.getElementById('flame-status');
    
    if (value === true) {
        valElement.innerText = '!!!';
        statusElement.innerText = '🔥 KEBAKARAN!';
        statusElement.style.color = '#D32F2F';
    } else {
        valElement.innerText = '--';
        statusElement.innerText = '✔️ Aman';
        statusElement.style.color = '#388E3C';
    }
}

function updateObject(value) {
    const valElement = document.getElementById('object');
    const statusElement = document.getElementById('object-status');
    
    if (value === true) {
        valElement.innerText = 'ADA';
        statusElement.innerText = '⚠️ Terdeteksi';
        statusElement.style.color = '#D32F2F';
    } else {
        valElement.innerText = '--';
        statusElement.innerText = '✔️ Kosong';
        statusElement.style.color = '#388E3C';
    }
}

function updateTimestamp(timestamp) {
    if (timestamp) {
        const date = new Date(timestamp); 
        document.getElementById('last-update').innerText = date.toLocaleString('id-ID'); 
    }
}