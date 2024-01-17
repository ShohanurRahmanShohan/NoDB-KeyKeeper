var button = document.getElementById("Login_button");
var div = document.getElementById("Login_Section");
var backupTextArea = document.getElementById("backupText"); // Add this line


// handle textarea scrolling
backupTextArea.addEventListener("input", function() {
    // Set the overflow-y property to "scroll"
    this.style.overflowY = "scroll";
});

// Array to store password data
var passwordData = [];

// Function to add a new row to the table
function addRow() {
    var website = document.getElementById("websiteInput").value;
    var user = document.getElementById("userInput").value;
    var password = document.getElementById("passwordInput").value;

    // Check if all fields are filled
    if (website && user && password) {
        // Add data to the array
        passwordData.push({ website: website, user: user, password: password });

        // Call a function to update the table
        updateTable();

        // Clear input fields
        document.getElementById("websiteInput").value = "";
        document.getElementById("userInput").value = "";
        document.getElementById("passwordInput").value = "";
    } else {
        alert("Please fill in all fields.");
    }
}

// Function to update the table with current data
function updateTable() {
    var tbody = document.querySelector("#passwordTable tbody");

    // Clear existing rows
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    // Populate table with data from the array
    passwordData.forEach(function(data) {
        var row = document.createElement("tr");
        var websiteCell = document.createElement("td");
        var userCell = document.createElement("td");
        var passwordCell = document.createElement("td");

        websiteCell.textContent = data.website;
        userCell.textContent = data.user;
        passwordCell.textContent = data.password;

        row.appendChild(websiteCell);
        row.appendChild(userCell);
        row.appendChild(passwordCell);

        tbody.appendChild(row);
    });
}
// Hashing start here 
// Note: The encryption and decryption functions used here (Caesar Cipher) are for demonstration purposes only.
//       They are not suitable for secure data protection and should not be used in real-world applications.
//       For actual security, consider using well-established cryptographic libraries and algorithms.


// Funtion to encrypt 
function encrypt(text, password) {
    let encryptedText = '';
  
    for (let i = 0; i < text.length; i++) {
      let charCode = text.charCodeAt(i);
      charCode += password.charCodeAt(i % password.length);
      encryptedText += String.fromCharCode(charCode);
    }
  
    return encryptedText;
  }
  
// Function to decrypt 

function decrypt(encryptedText, password) {
    let decryptedText = '';
  
    for (let i = 0; i < encryptedText.length; i++) {
      let charCode = encryptedText.charCodeAt(i);
      charCode -= password.charCodeAt(i % password.length);
      decryptedText += String.fromCharCode(charCode);
    }
  
    return decryptedText;
  }

// This is the function where I'm implementing everything.

function convertFormValues() {
    // Get values from the form
    var username = document.getElementById('username').value;
    var backupText = document.getElementById('backupText');
    console.log('Username:', username);

    // Convert passwordData array to a formatted text
    var text = passwordData.map(function(entry) {
        return entry.website + ': ' + entry.user + ' - ' + entry.password;
    }).join(', ');

    // Reverse the conversion
    function arrayToText(text) {
        // Split the text into individual entries
        var entries = text.split(', ');

        // Parse each entry into an object
        var reversedData = entries.map(function(entry) {
            var parts = entry.split(': ');
            if (parts.length === 2) {
                var website = parts[0];
                var userAndPassword = parts[1].split(' - ');
                if (userAndPassword.length === 2) {
                    var user = userAndPassword[0];
                    var password = userAndPassword[1];

                    return { website: website, user: user, password: password };
                }
            }

            // If the format is incorrect, return null
            return null;
        }).filter(Boolean); // Filter out null entries

        return reversedData;
    }

    // Encrypt or Decrypt based on backupText value
    if (backupText.value !== "") {
        // Decrypt the hash using the same password
        try {
            var decryptedText = decrypt(backupText.value, username);

            // Convert the decrypted text to an array
            var decryptedData = arrayToText(decryptedText);

            if (decryptedData.length > 0) {
                // Update the global passwordData array with the decrypted data
                passwordData = decryptedData;

                // function to update the table
                updateTable();
            } else {
                console.error('Invalid decrypted data format.');
                alert('Error: Incorrect username or corrupted hash.');
            }
        } catch (error) {
            console.error('Error during decryption:', error.message);
            alert('Error: Incorrect username or corrupted hash.');
        }
    } else {
        // Encrypt the concatenated string
        var hash = encrypt(text, username);

        // Set the value of the textarea
        backupText.value = hash;
    }

    // Log the original text, hash, and decrypted text
    console.log('Original Text:', text);
    console.log('Hash:', backupText.value);
    console.log('Decrypted Text:', decryptedText);
}