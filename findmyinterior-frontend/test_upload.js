const fs = require('fs');
const path = require('path');

// Create a dummy 3MB PNG file
const dummyFilePath = path.join(__dirname, 'dummy.png');
const buffer = Buffer.alloc(3 * 1024 * 1024, 'a');
fs.writeFileSync(dummyFilePath, buffer);

const formData = new FormData();
formData.append('title', 'Test Upload');
formData.append('description', 'Test Description');
formData.append('city', 'Patna');
formData.append('district', 'Patna');
formData.append('opportunity_type', 'PROJECT');
formData.append('requirement_type', 'INTERIOR_DESIGN');
formData.append('project_category', '3BHK');
formData.append('budget', '10-25 Lakhs');

// Use Blob to append file
const fileBlob = new Blob([buffer], { type: 'image/png' });
formData.append('image', fileBlob, 'dummy.png');

console.log('Sending request...');
fetch('https://find-my-interior-1.onrender.com/api/v1/projects', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer aryan123'
  },
  body: formData
})
.then(async (res) => {
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Response:', text);
})
.catch(err => {
  console.error('Error:', err);
});
