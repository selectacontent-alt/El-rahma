async function test() {
  try {
    const form = new FormData();
    const blob = new Blob(['test'], { type: 'image/jpeg' });
    form.append('file', blob, 'test.jpg');
    
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
