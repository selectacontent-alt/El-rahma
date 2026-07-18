async function test() {
  try {
    const form = new FormData();
    for(let i=0; i<35; i++) {
      form.append('files', new Blob(['test' + i], { type: 'image/jpeg' }), `test${i}.jpg`);
    }
    form.append('multiple', 'true');
    
    const uploadRes = await fetch('http://localhost:5005/api/admin/upload/drive', {
      method: 'POST',
      body: form
    });
    
    const text = await uploadRes.text();
    console.log('Upload Status:', uploadRes.status);
    console.log('Upload Response:', text);
  } catch(e) {
    console.error(e);
  }
}
test();
